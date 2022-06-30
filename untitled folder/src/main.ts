/* eslint-disable @typescript-eslint/no-var-requires */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});
  app.useStaticAssets(join(__dirname, '..', 'www'));
  // app.useWebSocketAdapter(new WsAdapter(app));

  app.enableCors();

  app.use(function(req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );

    next();
  });

  // const configService = app.get(ConfigService);
  // app.setGlobalPrefix('api');
  // const PORT = configService.get<number>('PORT');
  await app.listen(80);
  console.log('app listening on port ', 3000);
}
bootstrap();
