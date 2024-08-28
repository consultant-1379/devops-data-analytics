import { Module } from '@nestjs/common';
import { CustomConfigModule } from './custom-config/custom-config.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    SearchModule,
    CustomConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
