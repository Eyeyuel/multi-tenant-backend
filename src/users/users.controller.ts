import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';

@Controller('users')
// @UseGuards(AuthorizeGuard)
export class UsersController {
  constructor(
    private userService: UsersService,
    private configService: ConfigService,
  ) {}

  @Get()
  getUsers(@Query() paginationQueryDto: PaginationQueryDto) {
    console.log(process.env.NODE_ENV);
    // console.log(this.configService.get<string>('NODE_ENV'));
    return this.userService.getAllUsers(paginationQueryDto);
  }

  @Get(':id')
  getSingleUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  // this should be handled in the auth module
  // @Post()
  // createUser(@Body() user: CreateUserDto) {
  //   return this.userService.createUser(user);
  // }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
