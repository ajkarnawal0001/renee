import {
  BadRequestException,
  Module,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from './app/auth/auth.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphqlService } from '@config';
import { AppResolver } from './app.resolver';
import { ScheduleModule } from '@nestjs/schedule';
import { S3Module } from './app/s3/s3.module';
import { CronService, CustomExceptionsFilter } from '@utility';
import { ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from './app/user/user.module';
import { CountryModule } from './app/country/country.module';
import { TypeOrmService } from './core/config/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { StockUpdateModule } from './app/stock_update/stock_update.module';
import { OpeningStockModule } from './app/opening_stock/opening_stock.module';
import { StoreModule } from './app/store/store.module';
import { OutletSaleModule } from './app/outlet_sale/outlet_sale.module';
import { AttendanceModule } from './app/attendance/attendance.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmService,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GraphqlService,
    }),
    TerminusModule,
    AuthModule,
    StoreModule,
    StockUpdateModule,
    OpeningStockModule,
    UserModule,
    S3Module,
    CountryModule,
    AttendanceModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 5,
    }),
    OutletSaleModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CustomExceptionsFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        exceptionFactory: (error: ValidationError[]) =>
          new BadRequestException(error),
      }),
    },
    AppResolver,
    CronService,
  ],
})
export class AppModule {}
