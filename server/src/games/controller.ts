import {
  JsonController,
  Authorized,
  CurrentUser,
  Post,
  Param,
  BadRequestError,
  HttpCode,
  NotFoundError,
  ForbiddenError,
  Get,
  Patch,
  BodyParam,
  Body
} from "routing-controllers";
import User from "../users/entity";
import { Game, Player } from "./entities";
import { io } from "../index";

interface UpdateCanvas{
  color: string
  endX:number
  endY: number 
  size: number
  startX: number
  startY: number
}

@JsonController()
export default class GameController {

  @Authorized()
  @Post('/games')
  @HttpCode(201)
  async createGame(
    @CurrentUser() user: User
  ) {
    const entity = await Game.create().save()

    await Player.create({
      game: entity, 
      user,
      symbol: 'x'
    }).save()

    const game = await Game.findOneById(entity.id)

    io.emit('action', {
      type: 'ADD_GAME',
      payload: game
    })

    return game
  }

  @Authorized()
  @Post('/games/:id([0-9]+)/players')
  @HttpCode(201)
  async joinGame(
    @CurrentUser() user: User,
    @Param('id') gameId: number
  ) {
    const game = await Game.findOneById(gameId)
    if (!game) throw new BadRequestError(`Game does not exist`)
    if (game.status !== 'pending') throw new BadRequestError(`Game is already started`)

    game.status = 'started'
    await game.save()

    const player = await Player.create({
      game, 
      user,
      symbol: 'o'
    }).save()

    io.emit('action', {
      type: 'UPDATE_GAME',
      payload: await Game.findOneById(game.id)
    })

    return player
  }

  @Authorized()
  // the reason that we're using patch here is because this request is not idempotent
  // http://restcookbook.com/HTTP%20Methods/idempotency/
  // try to fire the same requests twice, see what happens
  @Patch("/games/:id([0-9]+)")
  async updateGame(
    @CurrentUser() user: User,
    @Param("id") gameId: number,
    @BodyParam("update") update: UpdateCanvas
  ) {
    const game = await Game.findOneById(gameId);
    if (!game) throw new NotFoundError(`Game does not exist`);

    const player = await Player.findOne({ user, game });

    if (!player) throw new ForbiddenError(`You are not part of this game`);
    if (game.status !== "started")
      throw new BadRequestError(`The game is not started yet`);

      await game.save()

  
    io.emit("action", {
      type: "TRACK_CANVAS",
      payload: [update]
    });

    return [update];
  }

  @Get('/games/:id([0-9]+)/randomword')
  async getWord(
    @Param('id') gameId: number,
   
  ) {
    const game = await Game.findOneById(gameId)
    if (!game) throw new NotFoundError(`Game does not exist`)
     await game.save()

    io.emit('action', {
      type: 'GET_WORD',
      payload: game
    })

    return game.word
  }


  @Authorized()
  @Get("/games/:id([0-9]+)")
  getGame(@Param("id") id: number) {
    return Game.findOneById(id);
  }

  @Authorized()
  @Get("/games")
  getGames() {
    return Game.find();
  }
}
