import React from 'react';
import PropTypes from 'prop-types';

class Ranking extends React.Component {
  constructor() {
    super();
    this.home = this.home.bind(this);
  }

  home() {
    const { history } = this.props;
    history.push('/');
  }

  render() {
    const ranking = JSON.parse(localStorage.getItem('ranking'));
    ranking.sort((a, b) => b.score - a.score);
    return (
      <div>
        <h1 data-testid="ranking-title">TELA DE RANKING</h1>
        {ranking.map((element, index) => (
          <div key={ index }>
            <p data-testid={ `player-name${index} ` }>{element.name}</p>
            <img src={ element.picture } alt={ element.name } />
            <p data-testid={ `player-score-${index}` }>{element.score}</p>
          </div>))}
        <button
          type="button"
          data-testid="btn-go-home"
          onClick={ this.home }
        >
          ir ao início
        </button>
      </div>
    );
  }
}
Ranking.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
}.isRequired;

export default Ranking;
