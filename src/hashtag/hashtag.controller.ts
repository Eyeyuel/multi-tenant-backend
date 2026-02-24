import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { HashtagService } from './hashtag.service';

@Controller('hashtag')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}
  @Post()
  createHashtag(@Body() createHashtagDto: CreateHashtagDto) {
    return this.hashtagService.createHashtag(createHashtagDto);
  }

  @Delete(':id')
  deleteHashtag(@Param('id', ParseIntPipe) id: number) {
    return this.hashtagService.deleteHashtag(id);
  }

  @Delete('soft/:id')
  softDeleteHashtag(@Param('id', ParseIntPipe) id: number) {
    return this.hashtagService.softDeleteHashtag(id);
  }
}
