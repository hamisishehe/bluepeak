import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('system_settings')
export class SystemSetting {
  @PrimaryColumn()
  key!: string;
  @Column({ type: 'jsonb' })
  value!: string | number | boolean | string[];
  @UpdateDateColumn()
  updatedAt!: Date;
}

