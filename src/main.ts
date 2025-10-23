import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const APP_PORT = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove properties not in DTO
    forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
    transform: true, // Automatically transform payloads to DTO instances
    transformOptions: {
      enableImplicitConversion: true, // Convert types automatically
    },
  }));
  
  await app.listen(APP_PORT ?? 3000);
}

bootstrap()
  .then(() => {
    console.log('Application is running on:', APP_PORT ?? 3000);
  })
  .catch((err) => {
    console.error('Error during application bootstrap:', err);
  });
