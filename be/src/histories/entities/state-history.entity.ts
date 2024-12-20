import { AbstractAuditingEntity } from "../../common/entities/abstract-auditing-entity";
import { DeviceEntity } from "../../devices/entities/device.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity('state-history')
export class StateHistory extends AbstractAuditingEntity {
  @Column({ type: 'timestamp', name: 'recorded_at' })
  recordedAt: Date;

  @Column({ type: 'float', name: 'altitude', nullable: false })
  altitude: number;

  @ManyToOne(() => DeviceEntity, (device) => device.stateHistories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'device_id',
  })
  device: DeviceEntity;
}