import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS - 允许所有域名
  app.enableCors({
    origin: '*',
    credentials: false,
  });
  
  // Global prefix
  app.setGlobalPrefix('api');
  
  // Vercel 需要用这个端口
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: ${port}`);
}

bootstrap();
