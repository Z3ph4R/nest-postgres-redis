import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@test.com', description: 'Електронна пошта для входу' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Пароль користувача' })
  @IsString()
  password: string;
}