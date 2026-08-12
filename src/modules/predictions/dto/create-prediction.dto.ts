import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePredictionDto {
  @IsString()
  @IsNotEmpty()
  intersectionId: string;

  @IsInt()
  @Min(5)
  horizonMinutes: number;

  @IsNumber()
  predictedDensity: number;

  @IsNumber()
  predictedQueue: number;

  @IsNumber()
  congestionProbability: number;

  @IsNumber()
  confidence: number;

  @IsOptional()
  factors?: string[];
}
