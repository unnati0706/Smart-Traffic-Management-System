import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CitizenReportsService } from './citizen-reports.service';
import { CreateCitizenReportDto } from './dto/create-citizen-report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { imageFileFilter } from '../../common/utils/file-upload.utils';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('citizen-reports')
export class CitizenReportsController {
  constructor(private readonly citizenReportsService: CitizenReportsService) {}

  @Permissions('incident.create')
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './storage/uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `report_${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: imageFileFilter,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per §22
    }),
  )
  async create(
    @Body() dto: CreateCitizenReportDto,
    @UploadedFile() file: any,
    @Request() req,
  ) {
    if (file) {
      dto.imagePath = file.path;
    }
    return this.citizenReportsService.create(dto, req.user?.userId);
  }

  @Permissions('incident.view')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.citizenReportsService.findOne(id);
  }
}
