import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Author } from "./Author";

@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column() title: string;
  @Column({type: "text"}) description: string;

  @ManyToOne(type => Author, author => author.books, {
    nullable: false, 
    onDelete: "CASCADE"
  })
  author: Author;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
