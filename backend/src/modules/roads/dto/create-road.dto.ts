import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateRoadDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  geometry: string;

  @IsInt()
  @Min(1)
  laneCount: number;

  @IsInt()
  @Min(100)
  capacity: number;

  @IsString()
  @IsOptional()
  status?: string;
}
