import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Index, OneToMany, ManyToOne } from 'typeorm'
import User from '../users/entity'
import {randomWord} from './logic'
import { IsString } from "class-validator";


type Status = 'pending' | 'started' | 'finished'


@Entity()
export class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @Column('text', {default: 'pending'})
  status: Status

  @IsString()
  @Column('text', {
    nullable: false,
    default: randomWord()})

  word: String
  
  @OneToMany(_ => Player, player => player.game, {eager:true})
  players: Player[]
}

@Entity()
@Index(['game', 'user', 'symbol'], {unique:true})
export class Player extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(_ => User, user => user.players)
  user: User

  @ManyToOne(_ => Game, game => game.players)
  game: Game

  @Column('char', {length: 1})
  symbol: Symbol

  @Column('integer', { name: 'user_id' })
  userId: number
}
