import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const APP_PORT = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(APP_PORT ?? 3000);
}

bootstrap()
  .then(() => {
    console.log('Application is running on:', APP_PORT ?? 3000);
  })
  .catch((err) => {
    console.error('Error during application bootstrap:', err);
  });
