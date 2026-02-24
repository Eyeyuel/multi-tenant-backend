import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { ActiveUser } from 'src/auth/docorators/active-user.decorator';
import type { ActiveUserType } from 'src/auth/interfaces/Active-user-type.interface';

@Controller('tweets')
export class TweetsController {
  constructor(private tweetsService: TweetsService) {}

  @Get()
  getAllTweets() {
    return this.tweetsService.getAllTweets();
  }

  @Get(':userId')
  getTweets(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    // console.log(GetTweetQuaryDto);
    return this.tweetsService.getTweets(userId, paginationQueryDto);
  }

  @Post()
  public createTweet(
    @Body() createTweetDto: CreateTweetDto,
    @ActiveUser() user: ActiveUserType,
  ) {
    createTweetDto.userId = user.sub;
    console.log(createTweetDto);
    return this.tweetsService.createTweet(createTweetDto);
  }

  @Patch()
  updateTweet(@Body() updateTweetDto: UpdateTweetDto) {
    return this.tweetsService.updateTweet(updateTweetDto);
  }

  @Delete(':id')
  deleteTweet(@Param('id', ParseIntPipe) id: number) {
    return this.tweetsService.deleteTweet(id);
  }
}
