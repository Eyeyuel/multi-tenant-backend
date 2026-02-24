import { Injectable } from '@nestjs/common';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Hashtag } from './hashtag.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class HashtagService {
  constructor(
    @InjectRepository(Hashtag)
    private hashtagRepositary: Repository<Hashtag>,
  ) {}

  public async createHashtag(createHashtagDto: CreateHashtagDto) {
    const newHashtag = this.hashtagRepositary.create(createHashtagDto);
    return await this.hashtagRepositary.save(newHashtag);
  }

  public async findHashtags(hashtags: number[]) {
    return await this.hashtagRepositary.find({
      where: {
        id: In(hashtags),
      },
    });
  }

  async deleteHashtag(id: number) {
    await this.hashtagRepositary.delete({ id });
    return { delete: true, id };
  }

  async softDeleteHashtag(id: number) {
    await this.hashtagRepositary.softDelete({ id });
    return { delete: true, id };
  }
}
