import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tweet } from './tweet.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { Paginated } from 'src/common/pagination/pagination.interface';

@Injectable()
export class TweetsService {
  constructor(
    private hashtagService: HashtagService,

    @InjectRepository(Tweet)
    private tweetRepositary: Repository<Tweet>,

    private readonly paginationProvider: PaginationProvider,

    private readonly userService: UsersService,
  ) {}

  public async createTweet(tweet: CreateTweetDto) {
    // first get the user using userId
    const user = await this.userService.getUserById(tweet.userId);
    if (!user) throw new NotFoundException();

    // Fetch all the hashtags based on hashtag array
    const hashtags = await this.hashtagService.findHashtags(
      tweet.hashtags ?? [],
    );

    // create a tweet
    const newTweet = this.tweetRepositary.create({ ...tweet, user, hashtags });
    // save the tweet

    return await this.tweetRepositary.save(newTweet);
  }

  async getAllTweets() {
    return await this.tweetRepositary.find({
      relations: { user: true, hashtags: true },
    });
  }

  async getTweets(
    id: number,
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Paginated<Tweet>> {
    const user = await this.userService.getUserById(id);

    if (!user) {
      throw new NotFoundException(`User with id: ${id} is not found.`);
    }

    return this.paginationProvider.paginationQuery(
      paginationQueryDto,
      this.tweetRepositary,
      { user: { id: id } },
    );

    // const { page = 1, limit = 10 } = paginationQueryDto;

    // return await this.tweetRepositary.find({
    //   where: { user: { id: id } },
    //   relations: { user: true },
    //   skip: (page - 1) * limit,
    //   take: limit,
    // });
  }

  async updateTweet(updateTweetDto: UpdateTweetDto) {
    // find all hashtags
    const hashtags = await this.hashtagService.findHashtags(
      updateTweetDto.hashtags ?? [],
    );

    // find the tweet by id
    const tweet = await this.tweetRepositary.findOneBy({
      id: updateTweetDto.id,
    });

    // update properties of the tweet
    if (tweet) {
      tweet.text = updateTweetDto.text ?? tweet.text;
      tweet.image = updateTweetDto.image ?? tweet.image;
      tweet.hashtags = hashtags;
      // save the tweet
      return await this.tweetRepositary.save(tweet);
    }
  }

  async deleteTweet(id: number) {
    await this.tweetRepositary.delete(id);
    return { delete: true, id };
  }
}
