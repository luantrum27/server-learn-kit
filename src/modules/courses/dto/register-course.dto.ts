import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RegisterCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @IsString()
  @IsNotEmpty()
  level: string;

  @IsNumber()
  @IsNotEmpty()
  time: number;

  @IsNumber()
  @IsNotEmpty()
  averageRating: number;

  @IsNumber()
  @IsNotEmpty()
  numberOfSubscribers: number;

  @IsNumber()
  @IsNotEmpty()
  numberOfLessions: number;

  @IsString()
  @IsOptional()
  thumbnail?: string;
}
