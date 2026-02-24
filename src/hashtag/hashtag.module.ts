import { Module } from '@nestjs/common';
import { HashtagController } from './hashtag.controller';
import { HashtagService } from './hashtag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hashtag } from './hashtag.entity';

@Module({
  controllers: [HashtagController],
  providers: [HashtagService],
  imports: [TypeOrmModule.forFeature([Hashtag])],
  exports: [HashtagService],
})
export class HashtagModule {}
