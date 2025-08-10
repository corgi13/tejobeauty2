import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VariantsService } from './variants.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { AdminGuard } from '../../common/admin.guard';

@ApiTags('variants')
@Controller('variants')
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @Post(':productId')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product variant' })
  @ApiResponse({ status: 201, description: 'Variant created successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 409, description: 'SKU already exists' })
  async create(@Param('productId') productId: string, @Body() createVariantDto: CreateVariantDto) {
    return this.variantsService.create(productId, createVariantDto);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get all variants for a product' })
  @ApiResponse({ status: 200, description: 'List of variants' })
  async findAll(@Param('productId') productId: string) {
    return this.variantsService.findAll(productId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific variant' })
  @ApiResponse({ status: 200, description: 'Variant details' })
  @ApiResponse({ status: 404, description: 'Variant not found' })
  async findOne(@Param('id') id: string) {
    return this.variantsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a variant' })
  @ApiResponse({ status: 200, description: 'Variant updated successfully' })
  @ApiResponse({ status: 404, description: 'Variant not found' })
  @ApiResponse({ status: 409, description: 'SKU already exists' })
  async update(@Param('id') id: string, @Body() updateVariantDto: UpdateVariantDto) {
    return this.variantsService.update(id, updateVariantDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a variant' })
  @ApiResponse({ status: 200, description: 'Variant deleted successfully' })
  @ApiResponse({ status: 404, description: 'Variant not found' })
  async remove(@Param('id') id: string) {
    return this.variantsService.remove(id);
  }

  @Get('product/:productId/attributes')
  @ApiOperation({ summary: 'Get available attributes for a product' })
  @ApiResponse({ status: 200, description: 'Product attributes' })
  async getAttributes(@Param('productId') productId: string) {
    return this.variantsService.getVariantAttributes(productId);
  }

  @Get(':id/stock')
  @ApiOperation({ summary: 'Check stock availability for a variant' })
  @ApiResponse({ status: 200, description: 'Stock availability' })
  @ApiResponse({ status: 404, description: 'Variant not found' })
  async checkStock(@Param('id') id: string, @Query('quantity') quantity: number) {
    const available = await this.variantsService.checkStock(id, quantity);
    return { available, variantId: id, requestedQuantity: quantity };
  }
}


