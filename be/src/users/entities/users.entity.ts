import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'email', unique: true })
  email: string;
}