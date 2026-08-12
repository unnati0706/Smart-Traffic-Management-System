import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateIncidentDto {
  @IsString()
  @IsNotEmpty()
  type: string; // ACCIDENT, ROAD_WORK, CONGESTION, WEATHER, HAZARD

  @IsString()
  @IsNotEmpty()
  intersectionId: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  @IsNotEmpty()
  severity: string; // LOW, MEDIUM, HIGH, CRITICAL

  @IsString()
  @IsNotEmpty()
  source: string; // CITIZEN, AUTHORITY, AI_CV

  @IsString()
  @IsNotEmpty()
  description: string;
}
