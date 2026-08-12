import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it('/api/v1/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.data.status).toBe('UP');
      });
  });

  it('/api/v1/auth/login (POST) - Valid Admin Login', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@sih.gov.in',
        password: 'Password123!',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toHaveProperty('accessToken');
        authToken = res.body.data.accessToken;
      });
  });

  it('/api/v1/auth/login (POST) - Invalid Credentials', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@sih.gov.in',
        password: 'WrongPassword',
      })
      .expect(401);
  });

  it('/api/v1/traffic/map (GET) - Protected Route with Bearer Token', () => {
    return request(app.getHttpServer())
      .get('/api/v1/traffic/map')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data.type).toBe('FeatureCollection');
      });
  });

  it('/api/v1/incidents (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/incidents')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });

  it('/api/v1/signals (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/signals')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });

  it('/api/v1/emergency-vehicles (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/emergency-vehicles')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });

  it('/api/v1/simulations (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/simulations')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        scenario: 'ACCIDENT',
        parameters: { laneClosureCount: 1 },
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.data.status).toBe('COMPLETED');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
