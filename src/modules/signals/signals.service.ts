import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SignalsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.signal.findMany({
      include: {
        intersection: true,
        phases: true,
      },
    });
  }

  async findOne(id: string) {
    const signal = await this.prisma.signal.findUnique({
      where: { id },
      include: {
        intersection: true,
        phases: true,
      },
    });

    if (!signal) {
      throw new NotFoundException(`Signal with ID ${id} not found`);
    }

    return signal;
  }
}
