import * as request from 'superagent'
import {baseUrl} from '../constants'
import {logout} from './users'
import {isExpired} from '../jwt'
export const TRACK_CANVAS = 'TRACK_CANVAS'


const trackCanvas = linesArray => ({
  type: TRACK_CANVAS,
  payload: {linesArray: linesArray}
})

export const updateCanvas = (gameId, linesArray) => (dispatch, getState) => {
    const state = getState()
    const jwt = state.currentUser.jwt
  
    if (isExpired(jwt)) return dispatch(logout())

    request
      .patch(`${baseUrl}/games/${gameId}`)
      .set('Authorization', `Bearer ${jwt}`)
      .send({ update: linesArray })
      .then(_ => dispatch(trackCanvas(linesArray)))
      .catch(err => console.error(err))
  }
