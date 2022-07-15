import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { BullModule } from '@nestjs/bull';
import { QUEUE } from '@constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE,
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
