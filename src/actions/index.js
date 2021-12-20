export const LOGIN = 'LOGIN';
export const REQUEST_API = 'REQUEST_API';
export const SUCCESS_API = 'SUCCESS_API';
export const SUCCESS_QUEST = 'SUCCESS_QUEST';
export const FEEDBACK = 'FEEDBACK';

const setLogin = (login, email) => ({
  type: LOGIN, login, email,
});

export default setLogin;

export const requestApi = () => ({ type: REQUEST_API });

export const finishAPI = (token) => ({
  type: SUCCESS_API,
  token,
});

export function fetchAPI() { // thunk para puxar o token de sessão
  return (dispatch) => { // func anonima
    dispatch(requestApi); // faz o dispatch de actions de forma assíncrona
    // retorna uma promise, nesse caso sem condição de erro
    return fetch('https://opentdb.com/api_token.php?command=request')
      .then((response) => response.json())
      .then((data) => data.token)
      .then((token) => dispatch(finishAPI(token)));
  };
}

export const questAPI = (questions) => ({
  type: SUCCESS_QUEST,
  questions,
});

export function fetchQuestions(token) { // thunk das perguntas
  return (dispatch) => {
    dispatch(requestApi);
    return fetch(`https://opentdb.com/api.php?amount=5&token=${token}`)
      .then((info) => info.json())
      .then((questions) => dispatch(questAPI(questions)));
  };
}

// Aqui é a parte nova, Envia informacoes para a pagina de feedBack

export const feedBack = (feedback) => ({
  type: FEEDBACK,
  feedback,
});
