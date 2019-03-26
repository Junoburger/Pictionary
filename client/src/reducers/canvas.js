import {TRACK_CANVAS} from '../actions/canvas'



export default (state = null, {type, payload}) => {
    switch (type) {

case TRACK_CANVAS:
// console.log(payload.id)
return {
  ...payload
}

default:
return state
}
}
