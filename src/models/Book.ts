import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Author } from "./Author";

@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column() name: string;
  @Column() description: string;

  @ManyToOne(type => Author, author => author.books)
  author: Author;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
