import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, BeforeInsert, BeforeUpdate } from "typeorm";
import { Book } from './Book';
import { IsNotEmpty, validate, ValidationError } from "class-validator";
import { ModelValidationError } from "../errors/ModelValidationError";

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
  
  @OneToMany(type => Book, book => book.author, {
    eager: true
  })
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
