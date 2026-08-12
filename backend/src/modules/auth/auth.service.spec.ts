import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        PrismaService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock_jwt_token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user with correct credentials', async () => {
    const user = await service.validateUser('admin@sih.gov.in', 'Password123!');
    expect(user).toBeDefined();
    expect(user.email).toBe('admin@sih.gov.in');
    expect(user.password).toBeUndefined();
  });

  it('should return null for invalid credentials', async () => {
    const user = await service.validateUser('admin@sih.gov.in', 'WrongPassword');
    expect(user).toBeNull();
  });

  it('should generate login payload with access token', async () => {
    const mockUser = {
      id: 'user-id-123',
      email: 'admin@sih.gov.in',
      name: 'System Admin',
      role: { name: 'ADMIN' },
    };

    const res = await service.login(mockUser);
    expect(res).toHaveProperty('accessToken');
    expect(res).toHaveProperty('refreshToken');
    expect(res.user.email).toBe('admin@sih.gov.in');
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });
});
