import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateObservationDto {
  @IsString()
  @IsNotEmpty()
  intersectionId: string;

  @IsString()
  @IsNotEmpty()
  source: string; // SENSOR, CAMERA, SIMULATED

  @IsNumber()
  @Min(0)
  vehicleCount: number;

  @IsNumber()
  @Min(0)
  averageSpeed: number;

  @IsNumber()
  @Min(0)
  density: number;

  @IsNumber()
  @Min(0)
  queueLength: number;

  @IsNumber()
  @Min(0)
  laneOccupancy: number;
}
