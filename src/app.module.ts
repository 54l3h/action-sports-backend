import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { GlobalModule } from './global.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL!),
    AuthModule,
    CategoryModule,
    GlobalModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
