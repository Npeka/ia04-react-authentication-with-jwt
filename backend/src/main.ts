import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? [
            process.env.FRONTEND_URL,
            'https://ia04-react-authentication-with-pgi6ayo3w-npekas-projects.vercel.app',
            'https://ia04-react-authentication-with-jwt.vercel.app',
            'https://ia04-react-authentication-with-jwt-git-main-npekas-projects.vercel.app',
          ].filter(Boolean)
        : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  console.log(
    `CORS configuration: ${JSON.stringify(app.getHttpAdapter().getInstance()._events.request._corsOptions)}`,
  );

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Backend running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`CORS enabled for production origins`);
}
bootstrap();
