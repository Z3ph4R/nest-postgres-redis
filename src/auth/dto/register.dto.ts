import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'admin@test.com', description: 'Електронна пошта користувача' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Пароль (мін. 8 символів)' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ example: 'John Doe', description: 'Ім’я користувача' })
  @IsString()
  name?: string;
}