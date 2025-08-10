import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean, IsArray, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVariantDto {
  @ApiProperty({
    description: 'SKU (Stock Keeping Unit) - must be unique',
    example: 'PROD-001-50ML-RED',
  })
  @IsString({ message: 'SKU must be a string' })
  @IsNotEmpty({ message: 'SKU is required' })
  sku!: string;

  @ApiProperty({
    description: 'Variant name',
    example: '50ml Red',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @ApiProperty({
    description: 'Variant price (optional - uses product price if not provided)',
    example: 29.99,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price must be positive' })
  price?: number;

  @ApiProperty({
    description: 'Stock quantity',
    example: 100,
  })
  @IsNumber({}, { message: 'Stock must be a number' })
  @Min(0, { message: 'Stock must be positive' })
  stock!: number;

  @ApiProperty({
    description: 'Variant weight in grams',
    example: 150.5,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Weight must be a number' })
  @Min(0, { message: 'Weight must be positive' })
  weight?: number;

  @ApiProperty({
    description: 'Variant attributes (size, color, scent, etc.)',
    example: { size: '50ml', color: 'Red', scent: 'Lavender' },
  })
  @IsNotEmpty({ message: 'Attributes are required' })
  attributes!: Record<string, any>;

  @ApiProperty({
    description: 'Variant images',
    example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Images must be an array' })
  @IsString({ each: true, message: 'Each image must be a string' })
  images?: string[];

  @ApiProperty({
    description: 'Whether the variant is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;
}
