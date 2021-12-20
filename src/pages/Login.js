import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import setLogin, { fetchAPI, fetchQuestions } from '../actions';
import Buttons from '../components/Buttons';
import '../App.css';

class Login extends React.Component {
  constructor() {
    super();

    this.state = {
      login: '',
      email: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange({ target }) {
    const { name, value } = target;
    this.setState({ [name]: value });
  }

  async handleClick() {
    const { loginSet, fetchToken, history, fetchQuest } = this.props;
    await fetchToken();
    const { login, email } = this.state;
    loginSet(login, email);
    const { token } = this.props;
    await fetchQuest(token);
    // const { perguntas } = this.props;
    // localStorage.setItem('perguntas', JSON.stringify(perguntas));
    localStorage.setItem('token', JSON.stringify(token));
    history.push('/game');
  }

  render() {
    const { login, email } = this.state;
    const validadeButton = login && email; // retorna true caso os campos estejam preenchidos
    return (
      <main className="login-main">
        <h2>Trivia</h2>
        <label htmlFor="login">
          <i className="material-icons">
            perm_identity
          </i>
          <input
            data-testid="input-player-name"
            id="login"
            name="login"
            value={ login }
            onChange={ this.handleChange }
            placeholder=" Nome"
          />
        </label>
        <label htmlFor="email">
          <i className="material-icons">
            alternate_email
          </i>
          <input
            data-testid="input-gravatar-email"
            id="email"
            name="email"
            value={ email }
            onChange={ this.handleChange }
            placeholder=" Email"
            type="email"
          />
        </label>
        <br />
        <Buttons validadeButton={ validadeButton } handleClick={ this.handleClick } />
      </main>
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.fetchToken.token,
  perguntas: state.fetchQuestions.questions,
});

const mapDispatchToState = (dispatch) => ({
  loginSet: (login, email) => dispatch(setLogin(login, email)),
  fetchToken: () => dispatch(fetchAPI()),
  fetchQuest: (token) => dispatch(fetchQuestions(token)),
});

Login.propTypes = {
  fetchToken: PropTypes.func.isRequired,
  fetchQuest: PropTypes.func.isRequired,
  loginSet: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  // perguntas: PropTypes.objectOf({}).isRequired,
};

export default connect(mapStateToProps, mapDispatchToState)(Login);
