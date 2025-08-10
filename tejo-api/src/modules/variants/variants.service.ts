import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@Injectable()
export class VariantsService {
  constructor(private prisma: PrismaService) {}

  async create(productId: string, createVariantDto: CreateVariantDto) {
    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if SKU is unique
    const existingSku = await this.prisma.productVariant.findUnique({
      where: { sku: createVariantDto.sku },
    });

    if (existingSku) {
      throw new ConflictException('SKU already exists');
    }

    return this.prisma.productVariant.create({
      data: {
        ...createVariantDto,
        productId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  }

  async findAll(productId: string) {
    return this.prisma.productVariant.findMany({
      where: { 
        productId,
        isActive: true 
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    return variant;
  }

  async update(id: string, updateVariantDto: UpdateVariantDto) {
    // Check if variant exists
    const existingVariant = await this.prisma.productVariant.findUnique({
      where: { id },
    });

    if (!existingVariant) {
      throw new NotFoundException('Variant not found');
    }

    // Check if SKU is unique (if being updated)
    if (updateVariantDto.sku && updateVariantDto.sku !== existingVariant.sku) {
      const existingSku = await this.prisma.productVariant.findUnique({
        where: { sku: updateVariantDto.sku },
      });

      if (existingSku) {
        throw new ConflictException('SKU already exists');
      }
    }

    return this.prisma.productVariant.update({
      where: { id },
      data: updateVariantDto,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    // Check if variant exists
    const variant = await this.prisma.productVariant.findUnique({
      where: { id },
    });

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    // Check if variant has any orders
    const orderItems = await this.prisma.orderItem.findMany({
      where: { variantId: id },
    });

    if (orderItems.length > 0) {
      // Soft delete - just mark as inactive
      return this.prisma.productVariant.update({
        where: { id },
        data: { isActive: false },
      });
    }

    // Hard delete if no orders
    return this.prisma.productVariant.delete({
      where: { id },
    });
  }

  async getVariantAttributes(productId: string) {
    const variants = await this.prisma.productVariant.findMany({
      where: { 
        productId,
        isActive: true 
      },
      select: { attributes: true },
    });

    // Extract unique attributes
    const attributes: Record<string, string[]> = {};
    
    variants.forEach(variant => {
      const attrs = variant.attributes as Record<string, any>;
      Object.keys(attrs).forEach(key => {
        if (!attributes[key]) {
          attributes[key] = [];
        }
        if (!attributes[key].includes(attrs[key])) {
          attributes[key].push(attrs[key]);
        }
      });
    });

    return attributes;
  }

  async checkStock(variantId: string, quantity: number) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    return variant.stock >= quantity;
  }

  async updateStock(variantId: string, quantity: number, operation: 'add' | 'subtract') {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    const newStock = operation === 'add' 
      ? variant.stock + quantity 
      : Math.max(0, variant.stock - quantity);

    return this.prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: newStock },
    });
  }
}
