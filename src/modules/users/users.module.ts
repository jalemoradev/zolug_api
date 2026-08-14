import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { TypeUserRole } from './entities/type-user-role.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, TypeUserRole])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
