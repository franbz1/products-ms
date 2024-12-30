import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';
import { Logger } from '@nestjs/common';

async function bootstrap() {

  const logger = new Logger('Products-App-Main');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(  
    new ValidationPipe({ 
      whitelist: true, 
      forbidNonWhitelisted: true, 
    }) 
  );

  await app.listen(envs.port);
  logger.log(`App is running on port ${envs.port}`);
}
bootstrap();
