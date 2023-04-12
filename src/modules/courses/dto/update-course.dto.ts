import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCourseDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  type?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  cost?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  level?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  time?: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  averageRating?: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  numberOfSubscribers?: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  numberOfLessions?: number;

  @IsString()
  @IsOptional()
  thumbnail?: string;
}
