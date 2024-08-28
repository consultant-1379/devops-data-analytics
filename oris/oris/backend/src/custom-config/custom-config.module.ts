import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ElasticSearchConfig } from './custom-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ElasticSearchConfig],
      isGlobal: true,
      cache: true,
    }),
  ],
})
export class CustomConfigModule {}
