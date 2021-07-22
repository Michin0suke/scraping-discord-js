import { Entity, Column, PrimaryColumn, UpdateDateColumn, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm'
import { DiscordServer } from './DiscordServer'
import { ScheduledTask } from './ScheduledTask'

@Entity()
export class DiscordChannel {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @ManyToOne(type => DiscordServer, server => server.channels,
      {
        nullable: false
        // onDelete: 'CASCADE',
        // cascade: true
      })
    @JoinColumn()
    server: DiscordServer;

    @OneToMany(type => ScheduledTask, task => task.channel)
    scheduledTasks: ScheduledTask[];

    @Column({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP'
    })
    lastFetchedAt: Date;

    @UpdateDateColumn()
    readonly updatedAt?: Date;

    @CreateDateColumn()
    readonly createdAt?: Date;
}
