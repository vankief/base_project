import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Note } from '@interfaces/notes.interface';
import { UserEntity } from './users.entity';

@Entity()
export class NoteEntity extends BaseEntity implements Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  title: string;

  @Column()
  descrtition: string;

  @Column()
  @CreateDateColumn()
  ceatedAt: Date;

  @Column()
  @CreateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, user => user.notes)
  user: UserEntity;
}
