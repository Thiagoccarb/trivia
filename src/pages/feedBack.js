import React from 'react';
import md5 from 'crypto-js/md5';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import '../App.css';

class Feedback extends React.Component {
  constructor() {
    super();
    this.state = {
      forcaRespondido: true,
    };
    this.setRanking = this.setRanking.bind(this);
  }

  componentDidMount() {
    this.setRanking();
  }

  setRanking() {
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    const { props: { user, emailUser, totalPoints } } = this;
    const info = {
      name: user,
      score: totalPoints,
      picture: `https://www.gravatar.com/avatar/${md5(emailUser).toString()}`,
    };
    const arrayInfo = [...ranking, info];
    localStorage.setItem('ranking', JSON.stringify(arrayInfo));
  }

  render() {
    const { totalPoints, correctAnswer } = this.props;
    const { forcaRespondido } = this.state;
    const ruim = 3;
    const resultadoBaixo = 'Podia ser melhor...';
    const resultadoBom = 'Mandou bem!';
    return (
      <main className="feedback-page">
        <Header
          score={ totalPoints }
          respondido={ forcaRespondido }
        />
        <div className="total-points-feedback">
          <h2 data-testid="feedback-total-question">
            {correctAnswer || 0 }
            {' corretas'}
          </h2>
          <h3 data-testid="feedback-total-score">
            {totalPoints}
            pts
          </h3>
        </div>
        <h1 data-testid="feedback-text" className="feedback-result">
          {correctAnswer < ruim ? resultadoBaixo : resultadoBom }
        </h1>
        <div className="feedback-buttons">
          <button
            type="button"
            data-testid="btn-ranking"
            className="ranking-button"
          >
            <Link to="/ranking">Ver Ranking</Link>
          </button>
          <button
            type="button"
            data-testid="btn-play-again"
            className="again-button"
          >
            <Link to="/">Jogar Novamente</Link>
          </button>
        </div>
      </main>
    );
  }
}

const mapStateToProps = (state) => ({
  totalPoints: state.sendFeedback.feedBack.total,
  correctAnswer: state.sendFeedback.feedBack.assertions,
  emailUser: state.login.email,
  user: state.login.login,
});

Feedback.propTypes = {
  emailUser: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  totalPoints: PropTypes.number.isRequired,
  correctAnswer: PropTypes.number.isRequired,
};

export default connect(mapStateToProps, null)(Feedback);
