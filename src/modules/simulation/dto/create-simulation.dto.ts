import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSimulationDto {
  @IsString()
  @IsNotEmpty()
  scenario: string; // NORMAL, INCREASED_TRAFFIC, ACCIDENT, HEAVY_RAIN, ROAD_CLOSURE, FESTIVAL, EMERGENCY

  @IsString()
  @IsOptional()
  intersectionId?: string;

  @IsOptional()
  parameters?: Record<string, any>;
}
