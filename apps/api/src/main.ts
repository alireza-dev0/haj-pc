import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from "@scalar/nestjs-api-reference"

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());

    app.setGlobalPrefix('api');

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );

    if (process.env.NODE_ENV === 'development') {
        const config = new DocumentBuilder()
            .setTitle('HajPC Backend API')
            .setDescription('Haj PC API documentation')
            .setVersion('1.0')
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api/docs/swagger', app, document);

        app.use("/api/docs/scalar", apiReference({
            content: document
        }))

        app.enableCors({
            origin: 'http://localhost:3000',
            credentials: true,
        });
    }

    const port = process.env.PORT ?? 7700;
    await app.listen(port);
}
bootstrap();