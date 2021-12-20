import React from 'react';
import PropTypes from 'prop-types';
import '../App.css';

class nextButton extends React.Component {
  render() {
    const { nextQuestionBtn } = this.props;
    return (
      <div className="next-button">
        <button
          onClick={ nextQuestionBtn }
          data-testid="btn-next"
          type="button"
        >
          Próxima pergunta
        </button>
      </div>
    );
  }
}

nextButton.propTypes = {
  nextQuestionBtn: PropTypes.func,
}.isRequired;

export default nextButton;
