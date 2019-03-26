import React, { Component } from 'react'
import { submitForm } from '../../actions/form'
import { connect } from 'react-redux'


class Guesser extends Component {

  handleChange = (event) => {
    this.setState({ guesses: event.target.value})
  }

  submit = () => {
    this.props.submitForm(this.state.guesses, this.props.id)
  }


  render() {
      console.log(this.props)
      return (
      <div className="SignInContainer">
        <div className="input-row">
          <input className='input' onChange={this.handleChange} type="text" placeholder='guess'
          />
          <button onClick={this.submit}> make guess</button>
        </div>
        {console.log(this.props.word)}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    guesses: state.guesses,
    word: state.word,
    win: state.win
  };
};

export default connect(mapStateToProps, { submitForm })(Guesser)
