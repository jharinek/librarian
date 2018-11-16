import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, BeforeInsert, BeforeUpdate } from "typeorm";
import { Author } from "./Author";
import { IsNotEmpty, ValidationError, validate } from "class-validator";
import { ModelValidationError } from "../errors/ModelValidationError";

@Entity()
export class Book extends BaseEntity {
  public errors: ValidationError[];

  @PrimaryGeneratedColumn() 
  id: number;

  @Column()
  @IsNotEmpty() 
  title: string;
  
  @Column({type: "text"}) 
  @IsNotEmpty() 
  description: string;

  @ManyToMany(type => Author, author => author.books)
  @JoinTable()
  @IsNotEmpty()
  authors: Author[];

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
      title: this.title,
      description: this.description,
      authors: this.authors.map(author => { 
        return {
          id: author.id,
          firstName: author.firstName,
          lastName: author.lastName,
          createdAt: author.createdAt,
          updatedAt: author.updatedAt
        }
      }),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}
