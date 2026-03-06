import { IsEmail, IsString, MinLength, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  nickname?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  moralScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  cultivationScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  socialScore?: number;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
