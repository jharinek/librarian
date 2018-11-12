import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Author extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column() firstName: string;
  @Column() lastName: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
