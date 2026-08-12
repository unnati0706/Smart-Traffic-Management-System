import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCitizenReportDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  imagePath?: string;
}
