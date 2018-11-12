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

  public serialize(): Object {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      author: { 
        id: this.author.id,
        firstName: this.author.firstName,
        lastName: this.author.lastName,
        createdAt: this.author.createdAt,
        updatedAt: this.author.updatedAt
      },
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}
