import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import '../App.css';
import Header from '../components/Header';
import NextButton from '../components/nextButton';
import { feedBack } from '../actions';

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      assertions: 0,
      index: 0, // lógica para aparecer cada pergunta
      // score: 0,
      // point: 0,
      respondido: false,
      timer: 30,
      shuffleredQuestions: [], // criei esse array vazio para armazenar as questões ja embaralhadas
      total: 0,
    };
    this.checkClick = this.checkClick.bind(this);
    this.passarTime = this.passarTime.bind(this);
    this.calculateScore = this.calculateScore.bind(this);
    this.setLocalStorage = this.setLocalStorage.bind(this);
    this.nextQuestionBtn = this.nextQuestionBtn.bind(this);
    this.shuffeQuestions = this.shuffeQuestions.bind(this);
    this.shuffleToState = this.shuffleToState.bind(this);
    this.decode = this.decode.bind(this);
  }

  componentDidMount() {
    this.shuffleToState(); // a qestão é chamada aqui para já atualizar a chave shuffleredQuestions logo que o com é criado
    this.setLocalStorage(); // chamando a função assim que o componente é montado
    const number = 1000;
    this.cronometro = setInterval(this.passarTime, number);
  }

  componentDidUpdate() {
    const { state: { timer, respondido } } = this;
    if (timer === 0 || respondido) {
      clearInterval(this.cronometro);
    }
  }

  setLocalStorage() {
    const { props: { user, emailUser },
      state: { assertions, total: score } } = this;

    const obj = {
      player: {
        name: user,
        assertions,
        score,
        gravatarEmail: emailUser,
      },
    };
    localStorage.state = JSON.stringify(obj);
  }

  passarTime() {
    this.setState((prev) => ({ timer: prev.timer - 1 }));
  }

  async checkAnswer(e) {
    this.setState({ respondido: true });

    const { timer } = this.state;
    let points = 0;
    const elementId = e.target.id;

    if (elementId === 'correct') {
      points = timer === 0 ? 0 : this.calculateScore();
      await this.setState((prevState) => ({
        assertions: prevState.assertions + 1,
        // score: points,
        total: prevState.total + points,
      }));
    }
  }

  async checkClick(e) { // a função precisa ser assincrona para a linha 78 ocorrer antes da 79 (setState é assincrono)
    clearInterval(this.cronometro);
    await this.checkAnswer(e);
    // Retiravel awai da funcao abaixo
    await this.setLocalStorage();
  }

  handleDificulty() {
    const { state: { index }, props: { questions } } = this;
    const question = questions[index];
    const { difficulty } = question;

    const hard = 3;
    const medium = 2;
    const easy = 1;

    switch (difficulty) {
    case 'hard':
      return hard;
    case 'medium':
      return medium;
    case 'easy':
      return easy;
    default:
      return 0;
    }
  }

  calculateScore() {
    const { timer } = this.state;
    const number = 10;
    let score = 0;
    const dif = this.handleDificulty();
    score = (timer * dif) + number;
    return score;
  }

  async nextQuestionBtn() {
    const { index } = this.state;
    // Gustavo Jezini : Aqui estou preparando terreno para pagina de feedBack
    const lastQuest = 4;
    const { history, feedback } = this.props;
    const { total, assertions } = this.state;
    if (index === lastQuest) {
      feedback({ total, assertions });
      history.push('/feedback');
    }
    // até aqui......  O codigo abaixo foi desenvolvido por voces
    const number = 1000;
    this.cronometro = setInterval(this.passarTime, number);
    await this.setState((prev) => ({ // o setState precisa de um await para atualizar o index antesa da linha 137
      index: prev.index + 1,
      timer: 30,
      respondido: false,
      // score: 0,
    }));
    this.shuffleToState(); // atualiza o estado com a proxima questão embaralhada
  }

  shuffeQuestions() { // essa função retorna um array com as questoes atuais já embaralhadas
    const { state: { index }, props: { questions } } = this;
    const currentQuestion = questions[index];

    const {
      correct_answer: correctAnswer,
      incorrect_answers: incorrectAnswers, // destructuring das respostas corretas e incorretas
    } = currentQuestion;

    const magicNumber = 0.5;
    const arrayNumbers = [];
    const answers = [...incorrectAnswers, correctAnswer]; // cria um array com todas as respostas

    answers.forEach((el, i) => arrayNumbers.push(i)); // popula o arrayNumbers com length do array de respostas (ex: [ 0,1,2,3 ])
    const shuffedArray = arrayNumbers.sort(() => Math.random() - magicNumber); // embaralha o arrayNumbers ( ex: [2, 3, 1, 0])

    const shuffedAnswers = []; // cria a variável para armazenar as respostas

    shuffedArray.forEach((number) => {
      shuffedAnswers.push(answers[number]); // popula shuffedAnswers com as respostas aleatorias
    });
    return shuffedAnswers;
  }

  shuffleToState() { // o estado é atualizado com as questões
    const questions = this.shuffeQuestions();
    this.setState({
      shuffleredQuestions: questions,
    });
  }

  // lógica para o texto das perguntas aparecer corretamente
  decode(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  render() {
    const { state: { index, respondido, timer, total, shuffleredQuestions },
      props: { questions } } = this;
    const currentQuestion = questions[index];
    const { category, question,
      correct_answer: correctAnswer,
    } = currentQuestion;
    return (
      <main className="main-game">
        <Header score={ total } respondido={ respondido } />
        <div className="div-timer-category">
          <h2 className="timer">{ timer }</h2>
          <h2 data-testid="question-category" className="category-game">
            {category}
          </h2>
        </div>
        <h3
          type="text"
          data-testid="question-text"
          className="question-game"
        >
          {/* aqui implementamos a lógica do texto */}
          {this.decode(question)}
        </h3>
        <div className="answers-buttons">
          {shuffleredQuestions.map((answer, i) => (
            <button
              id={ answer === correctAnswer ? 'correct' : null }
              type="button"
              key={ i }
              onClick={ (e) => this.checkClick(e) }
              className={ respondido && (answer === correctAnswer ? 'correct' : 'wrong') }
              disabled={ timer === 0 || respondido }
              data-testid={ answer === correctAnswer
                ? 'correct-answer' : `wrong-answer-${i}` }
            >
              {answer}
            </button>
          ))}
        </div>
        {(respondido || timer === 0)
          ? <NextButton nextQuestionBtn={ this.nextQuestionBtn } /> : null}
      </main>
    );
  }
}

Game.propTypes = {
  questions: PropTypes.arrayOf({}).isRequired,
  user: PropTypes.string.isRequired,
  emailUser: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  feedback: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  questions: state.fetchQuestions.questions,
  emailUser: state.login.email,
  user: state.login.login,
});

const mapDispatchToState = (dispatch) => ({
  feedback: (payload) => dispatch(feedBack(payload)),
});

export default connect(mapStateToProps, mapDispatchToState)(Game);
