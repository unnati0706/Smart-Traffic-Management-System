import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DataSourcesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.dataSource.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const source = await this.prisma.dataSource.findUnique({
      where: { id },
    });

    if (!source) {
      throw new NotFoundException(`Data Source with ID ${id} not found`);
    }

    return source;
  }
}
