import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Book } from './Book';

@Entity()
export class Author extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column() firstName: string;
  @Column() lastName: string;
  
  @OneToMany(type => Book, book => book.author)
  books: Book[];

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
