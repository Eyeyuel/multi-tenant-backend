import { IsInt } from 'class-validator';
import { Hashtag } from 'src/hashtag/hashtag.entity';
import { user } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Tweet {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'text',
    nullable: false,
  })
  text!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  image?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => user, (user) => user.tweets, { eager: true })
  user!: user;

  @ManyToMany(() => Hashtag, (hashtag) => hashtag.tweets, { eager: true })
  @IsInt({ each: true })
  @JoinTable()
  hashtags!: Hashtag[];
}
