import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Book } from './Book';

@Entity()
export class Author extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column() firstName: string;
  @Column() lastName: string;
  
  @OneToMany(type => Book, book => book.author, {
    eager: true
  })
  books: Book[];

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;

  public serialize(): Object {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      books: this.books.map(book => {
        return {
          id: book.id,
          title: book.title,
          description: book.description,
          createdAt: book.createdAt,
          updatedAt: book.updatedAt
        }
      }),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}
