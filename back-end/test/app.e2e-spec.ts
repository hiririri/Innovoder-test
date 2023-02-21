import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UserDto } from 'src/auth/dto/user.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const mockLoginUserFailed: UserDto = {
    username: 'aaa@gmail.com',
    password: '123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should not authenticate user', async () => {
    return await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send(mockLoginUserFailed)
    .expect(401);
  })

  const mockProduct = {
    "code": "123123",
  };

  it('should not return a product info',async () => {
    return await request(app.getHttpServer())
    .get('/api/v1/product/1=')
    .send(mockProduct)
    .expect(401);
  })

  const mockLoginUserSuccess: UserDto = {
    username: 'aaa@gmail.com',
    password: 'qwe',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should authenticate user and return a product info', async () => {
    const loginResponse = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send(mockLoginUserSuccess)
    .expect(200);
  })
});
