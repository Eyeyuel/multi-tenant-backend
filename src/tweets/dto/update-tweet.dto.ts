import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateTweetDto } from './create-tweet.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateTweetDto extends PartialType(CreateTweetDto) {
  @IsInt()
  @IsNotEmpty()
  id: number;
}
