import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm'
import { Article } from './Article'
import { DiscordChannel } from './DiscordChannel'

@Entity()
export class ScheduledTask {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'text', nullable: true })
    program: string;

    @Column()
    description: string;

    @Column({ nullable: false, default: 15 })
    intervalMinutes: number;

    @Column({ nullable: false, default: 'stopped' })
    status: 'stopped'|'running' = 'stopped';

    @Column({
      type: 'text',
      nullable: true
    })
    log: string;

    @ManyToOne(type => DiscordChannel, channel => channel.scheduledTasks,
      {
        nullable: false
        // onDelete: 'CASCADE',
        // cascade: true
      })
    @JoinColumn()
    channel: DiscordChannel;

    @OneToMany(type => Article, article => article.task, { nullable: false })
    articles: Article[];

    @UpdateDateColumn()
    readonly updatedAt?: Date;

    @CreateDateColumn()
    readonly createdAt?: Date;
}
