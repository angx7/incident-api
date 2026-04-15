import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { IncidentsModule } from './incidents/incidents.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './config/envs';
import { dataSourceOptions } from './core/db/migrations/data-source';

@Module({
  imports: [
    EmailModule,
    IncidentsModule,
    TypeOrmModule.forRoot(dataSourceOptions),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
