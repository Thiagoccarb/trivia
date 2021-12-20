import { combineReducers } from 'redux';
import login from './login';
import fetchToken from './fetchToken';
import fetchQuestions from './fetchQuestions';
import sendFeedback from './sendFeedbakc';

const rootReducer = combineReducers({ login,
  fetchToken,
  fetchQuestions,
  sendFeedback,
});

export default rootReducer;
