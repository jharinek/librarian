import { Book } from './Book';

import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, BeforeInsert, BeforeUpdate, JoinTable, BeforeRemove } from "typeorm";
import { IsNotEmpty, validate, ValidationError } from "class-validator";

import { ModelValidationError } from "../errors/ModelValidationError";
import { RelatedRecordsFound } from "../errors/RelatedRecordsFound";

@Entity()
export class Author extends BaseEntity {
  public errors: ValidationError[];

  @PrimaryGeneratedColumn() 
  id: number;

  @Column()
  @IsNotEmpty() 
  firstName: string;
  
  @Column()
  @IsNotEmpty() 
  lastName: string;
  
  @ManyToMany(type => Book, book => book.authors)
  books: Book[];

  @CreateDateColumn() 
  createdAt: Date;
  
  @UpdateDateColumn() 
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async checkValidations() {
    this.errors = await(validate(this));
    
    if(this.errors.length > 0) {
      throw new ModelValidationError("Validation failed!", this.errors);
    }
  }

  @BeforeRemove()
  checkRelatedBooks() {
    if(this.books.length > 0){
      throw new RelatedRecordsFound("Author", "Book");
    }
  }

  public serialize(): Object {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      books: this.books && this.books.map(book => {
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
