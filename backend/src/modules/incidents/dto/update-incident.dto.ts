import { IsOptional, IsString } from 'class-validator';

export class UpdateIncidentDto {
  @IsString()
  @IsOptional()
  severity?: string;

  @IsString()
  @IsOptional()
  status?: string; // REPORTED, IN_PROGRESS, RESOLVED

  @IsString()
  @IsOptional()
  description?: string;
}
