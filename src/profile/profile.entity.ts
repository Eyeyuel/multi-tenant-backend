import { user } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 10,
  })
  gender: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  dateOfBirth: Date;

  @Column({
    type: 'text',
    nullable: true,
  })
  bio: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  profileImage: string;

  // this is a relation with table user that has a col in the table with id of user so its a foreign key
  // and when a user is deleted the realted profile will be deleted using cascade.
  @OneToOne(() => user, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: user;
}
