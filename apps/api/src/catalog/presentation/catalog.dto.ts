import type {
  CreateCategoryRequest,
  CreateProductRequest,
  CreatePromotionRequest,
  UpdateProductPriceRequest,
} from "@raizstore/contracts";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class ProductFiltersDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPriceInCents?: number;

  @ApiPropertyOptional({ minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPriceInCents?: number;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @Transform(({ value }) => value === true || value === "true")
  @IsBoolean()
  onPromotion?: boolean;
}

export class CreateCategoryDto implements CreateCategoryRequest {
  @ApiProperty({ example: "Escritório" })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name: string;
}

export class CreateProductDto implements CreateProductRequest {
  @ApiProperty({ example: "Caderno Focus" })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @ApiProperty({
    example: "Caderno pontilhado para organizar ideias e estudos.",
  })
  @IsString()
  @MinLength(10)
  @MaxLength(800)
  description: string;

  @ApiProperty({ example: 7990, description: "Preço em centavos." })
  @IsInt()
  @Min(0)
  priceInCents: number;

  @ApiProperty({ example: 20 })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  imageUrl?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}

export class UpdateProductPriceDto implements UpdateProductPriceRequest {
  @ApiProperty({ example: 8990, description: "Preço em centavos." })
  @IsInt()
  @Min(0)
  priceInCents: number;
}

export class CreatePromotionDto implements CreatePromotionRequest {
  @ApiProperty({ example: "Volta às aulas" })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 15, minimum: 1, maximum: 99 })
  @IsInt()
  @Min(1)
  @Max(99)
  discountPercentage: number;

  @ApiProperty({ example: "2026-08-01T00:00:00.000Z" })
  @IsDateString()
  startsAt: string;

  @ApiProperty({ example: "2026-08-31T23:59:59.000Z" })
  @IsDateString()
  endsAt: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  productIds: string[];
}
