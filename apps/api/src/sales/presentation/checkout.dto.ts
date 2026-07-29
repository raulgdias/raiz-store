import type {
  CheckoutItemRequest,
  CheckoutRequest,
} from "@raizstore/contracts";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";

export class CheckoutItemDto implements CheckoutItemRequest {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty({ minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CheckoutDto implements CheckoutRequest {
  @ApiProperty({ type: [CheckoutItemDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  items: CheckoutItemDto[];
}
