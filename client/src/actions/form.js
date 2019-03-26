export const SUBMIT_FORM = 'SUBMIT_FORM'

export const submitForm = (guess, id) => {
  console.log(guess)
  return {
    type: SUBMIT_FORM,
    payload: {guess,
              id
    }
  }
}
