import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class PlanRouteDto {
  @IsNumber()
  originLatitude: number;

  @IsNumber()
  originLongitude: number;

  @IsNumber()
  destinationLatitude: number;

  @IsNumber()
  destinationLongitude: number;

  @IsOptional()
  avoidIncidents?: boolean;
}
