import {
  IsString,
  IsEmail,
  IsNotEmpty,
  ValidateIf,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'The email of the user. Required if username is not provided.',
  })
  @IsString()
  @IsEmail()
  @IsOptional()
  @ValidateIf((o) => !o.username)
  email?: string;

  @ApiPropertyOptional({
    example: 'john_doe',
    description: 'The username of the user. Required if email is not provided.',
  })
  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.email)
  username?: string;

  @ApiProperty({
    example: 'Password123',
    description: 'The password of the user.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'USER',
    description: 'The role of the user.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  role: string;
}
