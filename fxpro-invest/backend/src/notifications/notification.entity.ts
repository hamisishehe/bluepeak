import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column()
  userId!: string;
  @Column()
  title!: string;
  @Column()
  body!: string;
  @Column({ default: false })
  read!: boolean;
  @CreateDateColumn()
  createdAt!: Date;
}

