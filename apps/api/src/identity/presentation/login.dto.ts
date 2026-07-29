import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import type { LoginRequest } from "@raizstore/contracts";

export class LoginDto implements LoginRequest {
  @ApiProperty({ example: "admin" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  username: string;

  @ApiProperty({ example: "admin123" })
  @IsString()
  @MinLength(6)
  @MaxLength(120)
  password: string;
}
