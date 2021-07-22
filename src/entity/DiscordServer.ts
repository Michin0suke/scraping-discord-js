import { Entity, Column, PrimaryColumn, UpdateDateColumn, CreateDateColumn, OneToMany } from 'typeorm'
import { DiscordChannel } from './DiscordChannel'

@Entity()
export class DiscordServer {
    @PrimaryColumn()
    id: string;

    @OneToMany(type => DiscordChannel, channel => channel.server)
    channels?: DiscordChannel[];

    @Column({
      nullable: false
    })
    name: string;

    @UpdateDateColumn()
    readonly updatedAt?: Date;

    @CreateDateColumn()
    readonly createdAt?: Date;
}
