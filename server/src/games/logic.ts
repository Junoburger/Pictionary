import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { Board, Symbol, Row } from './entities'

@ValidatorConstraint()
export class IsBoard implements ValidatorConstraintInterface {

  validate(board: Board) {
    const symbols = [ 'x', 'o', null ]
    return board.length === 3 &&
      board.every(row =>
        row.length === 3 &&
        row.every(symbol => symbols.includes(symbol))
      )
  }
}

export const isValidTransition = (playerSymbol: Symbol, from: Board, to: Board) => {
  const changes = from
    .map(
      (row, rowIndex) => row.map((symbol, columnIndex) => ({
        from: symbol, 
        to: to[rowIndex][columnIndex]
      }))
    )
    .reduce((a,b) => a.concat(b))
    .filter(change => change.from !== change.to)

  return changes.length === 1 && 
    changes[0].to === playerSymbol && 
    changes[0].from === null
}

export const calculateWinner = (board: Board): Symbol | null =>
  board
    .concat(
      // vertical winner
      [0, 1, 2].map(n => board.map(row => row[n])) as Row[]
    )
    .concat(
      [
        // diagonal winner ltr
        [0, 1, 2].map(n => board[n][n]),
        // diagonal winner rtl
        [0, 1, 2].map(n => board[2-n][n])
      ] as Row[]
    )
    .filter(row => row[0] && row.every(symbol => symbol === row[0]))
    .map(row => row[0])[0] || null

export const finished = (board: Board): boolean =>
  board
    .reduce((a,b) => a.concat(b) as Row)
    .every(symbol => symbol !== null)


    const words = ['alligator', 'anaconda', 'ant', 'anteater', 'antelope',
    'ape', 'armadillo', 'baboon', 'badger', 'bass', 'bat', 'bear', 'beaver', 'bee',
    'beetle', 'bird', 'bison', 'boar', 'bonobo', 'bug', 'butterfly', 'camel', 'caribou',
    'carp', 'cat', 'caterpillar', 'catfish', 'centipede', 'chameleon', 'cheetah', 'chicken',
    'chimpanzee', 'chipmunk', 'clownfish', 'cobra', 'cockroach', 'cow', 'crab', 'cricket',
    'crocodile', 'deer', 'dinosaur', 'dog', 'dolphin', 'donkey', 'dove', 'dragon', 'duck',
    'eagle', 'eel', 'elephant', 'emu', 'falcon', 'ferret', 'fish', 'flamingo', 'fly', 'fox',
    'frog', 'giraffe', 'goat', 'goldfish', 'goose', 'gorilla', 'hedgehog', 'hippo', 'horse',
    'kangaroo', 'koala', 'ladybug', 'lion', 'lizard', 'llama', 'lobster', 'monkey', 'mouse',
    'narwhal', 'octopus', 'ostrich', 'owl', 'panda', 'parrot', 'penguin', 'pig', 'pony',
    'rabbit', 'rhino', 'scorpion', 'shark', 'shrimp', 'snail', 'snake', 'starfish', 'tiger',
    'tortoise', 'turkey', 'turtle','chocolate', "science", 'safety', 'newspaper', 'complaint', 'engine', 'community',
    'presentation', 'revenue', 'student', 'customer', 'tea', 'pizza', 'technology', 'developer', 'employer', 'chest', 'construction',
    'woman', 'boat', 'recording', 'fridge', 'government', 'punk', 'freedom', 'uncle', 'power', 'worker', 'tradition',
    'tongue', 'airport', 'disk', 'cassette', 'car', 'airplane', 'paper', 'oven', 'frying pan', 'letter', 'basket', 'cell',
    'phone', 'death', 'magazine', 'knowledge', 'owner', 'breath', 'honey', 'idea', 'winner', 'king', 'success', 'soup',
    'bomb', 'farmer', 'dinner', 'heart', 'musician', 'signature', 'cigarette', 'flower', 'house', 'hotel', 'inspector',
    'food', 'painting', 'art', 'highway', 'city', 'virus', 'tennis', 'soccer', 'basketball', 'bicycle', 'circus',
    'elephant', 'lion', 'bunny', 'beer', 'wine']
    
    
    export const randomWord = () => words[Math.floor(Math.random() * words.length)];
