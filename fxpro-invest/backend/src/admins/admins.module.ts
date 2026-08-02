import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { AdminsController } from './admins.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AdminsController],
})
export class AdminsModule {}

