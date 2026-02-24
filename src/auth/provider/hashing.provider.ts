import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingProvider {
  abstract hashPassword(data: string | Buffer): Promise<string>;

  abstract comparePassword(
    palinPassword: string | Buffer,
    hashedPassword: string | Buffer,
  ): Promise<boolean>;
}
