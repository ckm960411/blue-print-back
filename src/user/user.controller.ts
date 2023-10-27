import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../../utils/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateUserReqDto } from './dto/create-user.req.dto';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserReqDto: CreateUserReqDto) {
    return this.userService.createUser(createUserReqDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getUser(@User() user: UserEntity) {
    delete user.password;
    return user;
  }
}
