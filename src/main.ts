import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('AI Recommendation System')
    .setDescription('API documentation for the AI Recommendation System')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Save the Swagger JSON to a file
  writeFileSync('./swagger.json', JSON.stringify(document));

  SwaggerModule.setup('api', app, document);

  await app.listen(7000);
}
bootstrap();
