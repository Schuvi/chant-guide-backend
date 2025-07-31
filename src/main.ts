import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { doubleCsrf } from 'csrf-csrf';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  });

  app.use(cookieParser());

  app.use(
    session({
      secret: 'a_very_strong_random_string_for_session_secret_here',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'lax',
      },
    }),
  );

  const doubleCsrfUtilities = doubleCsrf({
    getSecret: () => 'a_very_strong_random_string_for_session_secret_here',
    getSessionIdentifier: (req) => req.session.id,
    cookieName: '__Host-psifi.x-csrf-token',
    cookieOptions: {
      sameSite: 'strict',
      path: '/',
      secure: true,
      httpOnly: true,
    },
    size: 32,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
    getCsrfTokenFromRequest: (req) => req.headers['x-csrf-token'],
    skipCsrfProtection: undefined,
  });

  const { doubleCsrfProtection } = doubleCsrfUtilities;
  app.use(doubleCsrfProtection);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [`'self'`, 'data:', 'ik.imagekit.io'],
          scriptSrc: [`'self'`],
          manifestSrc: [`'self'`],
          frameSrc: [`'self'`],
          connectSrc: [
            `'self'`,
            `http://localhost:${process.env.PORT ?? 3000}`,
          ],
        },
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Chant Guide API')
    .setDescription('API documentation for the Chant Guide application')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory(), {
    swaggerOptions: {
      persistAuthorization: true,
      requestInterceptor: async (request) => {
        if (
          ['post', 'put', 'delete', 'patch'].includes(
            request.method.toLowerCase(),
          )
        ) {
          try {
            const csrfResponse = await fetch(
              `http://localhost:${process.env.PORT ?? 3000}/csrf/token`,
              {
                method: 'GET',
                credentials: 'include',
              },
            );

            if (csrfResponse.ok) {
              const data = await csrfResponse.json();
              const csrfToken = data.csrfToken;
              if (csrfToken) {
                request.headers['X-CSRF-Token'] = csrfToken;
                console.log('Swagger: CSRF Token added to request:', csrfToken);
              }
            } else {
              console.error(
                'Swagger: Failed to fetch CSRF token:',
                csrfResponse.statusText,
              );
            }
          } catch (error) {
            console.error('Swagger: Error fetching CSRF token:', error);
          }
        }
        return request;
      },
      docExpansion: 'none',
    },
    customSiteTitle: 'Chant Guide API Docs',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
