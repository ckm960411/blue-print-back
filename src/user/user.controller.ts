import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUser(@Param('id', new ParseIntPipe()) id: number) {
    return new UserEntity(await this.userService.findUser(id));
  }
}
