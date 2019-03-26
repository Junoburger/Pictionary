import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {getGames, joinGame, updateGame} from '../../actions/games'
import {updateCanvas} from '../../actions/canvas'
import {getUsers} from '../../actions/users'
import {userId} from '../../jwt'
import Paper from '@material-ui/core/Paper';
import Canvas from './Canvas'
import './GameDetails.css'
import Guesser from './Guesser'

class GameDetails extends PureComponent {



  componentWillMount() {
    if (this.props.authenticated) {
      if (this.props.game === null) this.props.getGames()
      if (this.props.users === null) this.props.getUsers()
    }
  }

  getWord = (event) => {
    this.setState({ word: event.target.value })
  }

  randomWord = () => {
    return this.props.generateWord
  }

  joinGame = () => this.props.joinGame(this.props.game.id)

  // makeMove = (toRow, toCell) => {
  //   const {game, updateGame} = this.props

  //   const board = game.board.map(
  //     (row, rowIndex) => row.map((cell, cellIndex) => {
  //       if (rowIndex === toRow && cellIndex === toCell) return game.turn
  //       else return cell
  //     })
  //   )
  //   updateGame(game.id, board)
  // }



  render() 
{
    const {game, users, authenticated, userId} = this.props

    if (!authenticated) return (
			<Redirect to="/login" />
		)

    if (game === null || users === null) return 'Loading...'
    if (!game) return 'Not found'

    const player = game.players.find(p => p.userId === userId)

    const winner = game.players
      .filter(p => p.symbol === game.winner)
      .map(p => p.userId)[0]

    return (<Paper className="outer-paper">
      <h1>Game #{game.id}</h1>

      <p>Status: {game.status}</p>
      <h1>{
        game.status === 'started' &&
        player && player.symbol === 'o' && 'draw this word: ' +  game.word 
      }</h1>
      {
        game.status === 'started' &&
        player && player.symbol === 'x' &&
        <div><Guesser id={game.id}/>Guess the word</div>
      } 

      {
        game.status === 'pending' &&
        game.players.map(p => p.userId).indexOf(userId) === -1 &&
        <button onClick={this.joinGame}>Join Game</button>

      }

      {
        winner &&
        <p>Winner: {users[winner].firstName}</p>
      }

      <hr />

      {
        game.status !== 'pending' &&
        <div>
          
 

  {player.symbol === 'o' && <Canvas trackCanvas={this.props.updateCanvas.bind(null, game.id)}  />}
  {player.symbol === 'x' && <Canvas lines={this.props.canvas}  disabled={true}/>}
      {/* {console.log(player)} */}
 
        </div>
      }
    </Paper>)
  }
}

const mapStateToProps = (state, props) => ({
  authenticated: state.currentUser !== null,
  userId: state.currentUser && userId(state.currentUser.jwt),
  game: state.games && state.games[props.match.params.id],
  users: state.users,
  canvas: state.canvas,
  word: state.word,
  guess: state.guess,
  winner: state.winner
})

const mapDispatchToProps = {
  getGames, getUsers, joinGame, updateGame, updateCanvas
}

export default connect(mapStateToProps, mapDispatchToProps)(GameDetails)
