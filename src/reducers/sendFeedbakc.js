import { FEEDBACK } from '../actions';

const INITIAL_STATE = {
  feedBack: {},
};

const sendFeedback = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case FEEDBACK:
    return {
      ...state,
      feedBack: action.feedback,
    };
  default:
    return state;
  }
};

export default sendFeedback;
