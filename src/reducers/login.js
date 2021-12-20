import { LOGIN } from '../actions';

const INITIAL_STATE = {
  login: '',
  email: '',
};

const login = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case LOGIN:
    return {
      ...state,
      email: action.email,
      login: action.login,
    };
  default:
    return state;
  }
};

export default login;
