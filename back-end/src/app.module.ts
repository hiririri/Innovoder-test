import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductController } from './product/product.controller';
import { ProductModule } from './product/product.module';
import { ProductService } from './product/product.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    CacheModule.register({
      ttl: 10,
      max: 10,
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      cache: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    UserModule,
    AuthModule,
    ProductModule,
    HttpModule,
  ],
  providers: [ProductService],
  controllers: [ProductController],
})
export class AppModule {}
