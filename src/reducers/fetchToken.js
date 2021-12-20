import { REQUEST_API, SUCCESS_API } from '../actions';

const INITIAL_STATE = {
  token: '',
};

const fetchToken = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case REQUEST_API:
    return { ...state };
  case SUCCESS_API:
    return {
      ...state,
      token: action.token,
    };
  default:
    return state;
  }
};

export default fetchToken;
