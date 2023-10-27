import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id', new ParseIntPipe()) id: number) {
    return new UserEntity(await this.userService.findUser(id));
  }
}
