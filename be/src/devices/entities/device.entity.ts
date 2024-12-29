import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity('devices')
export class DeviceEntity {
  @PrimaryColumn({ type: 'varchar', name: 'id', unique: true })
  id: string;

  @Column({ type: 'varchar', name: 'device_name', unique: true })
  deviceName: string;

  @Column({ type: 'varchar', nullable: false })
  location: string;

}