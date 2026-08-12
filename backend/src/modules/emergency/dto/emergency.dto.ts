import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEmergencyVehicleDto {
  @IsString()
  @IsNotEmpty()
  type: string; // AMBULANCE, FIRE_TRUCK, POLICE

  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  destinationLatitude: number;

  @IsNumber()
  destinationLongitude: number;
}

export class PlanGreenCorridorDto {
  @IsString()
  @IsNotEmpty()
  emergencyVehicleId: string;
}
