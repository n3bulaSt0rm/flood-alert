import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity('devices')
export class UsersEntity {
  @PrimaryColumn({ type: 'varchar', name: 'id', unique: true })
  id: string;

  @Column({ type: 'varchar', name: 'email', unique: true })
  email: string;

}