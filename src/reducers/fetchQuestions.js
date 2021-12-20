import { REQUEST_API, SUCCESS_QUEST } from '../actions';

const INITIAL_STATE = {
  questions: '',
};

const fetchQuestions = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case REQUEST_API:
    return { ...state };
  case SUCCESS_QUEST:
    return {
      ...state,
      questions: action.questions.results,
    };
  default:
    return state;
  }
};

export default fetchQuestions;
