import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoadDto } from './dto/create-road.dto';

@Injectable()
export class RoadsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.road.findMany({
      include: {
        intersections: true,
      },
    });
  }

  async create(createRoadDto: CreateRoadDto) {
    return this.prisma.road.create({
      data: createRoadDto,
    });
  }

  async findOne(id: string) {
    return this.prisma.road.findUnique({
      where: { id },
      include: {
        intersections: true,
      },
    });
  }
}
