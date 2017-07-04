import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import Quiz from '/imports/api/quizes/quizes.js';
import QuizCard from '../../components/quiz-card.js';
import Loading from '../../components/loading';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quizDeleted: false,
      quizForked: false,
      showDeleteQuizAlert: false,
      quizToDelete: null,
    };
  }
  render() {
    const { results } = this.props;
    const showDeleteAlert = (quiz) => {
      this.setState({ quizToDelete: quiz, showDeleteQuizAlert: true });
    };
    const deleteQuiz = () => {
      this.state.quizToDelete.applyMethod('delete', []);
      const notifyUser = () => {
        this.setState({ quizDeleted: true });
        setTimeout(() => this.setState({ quizDeleted: false }), 3000);
      };
      notifyUser();
    };
    const forkQuiz = (quiz) => {
      const newQuiz = new Quiz({
        questions: quiz.questions,
        title: quiz.title,
        tags: quiz.tags,
        owner: Meteor.userId(),
      });
      newQuiz.applyMethod('create', []);
      const notifyUser = () => {
        this.setState({ quizForked: true });
        setTimeout(() => this.setState({ quizForked: false }), 3000);
      };
      notifyUser();
    };
    const actions = {
      showDeleteAlert,
      forkQuiz,
    };
    return (
      results.length === 0
      ? <div className="row">
        <img className="col-md-6" src="/img/no-search-results.png" alt="No Search Results" />
        <img className="col-md-6" src="/img/no-search-results-text.png" alt="No Search Results" />
      </div>
      : <div id="search">
        <ul>
          {results.map(quiz =>
            <div key={quiz._id}>
              <QuizCard quiz={quiz} actions={actions} />
            </div>,
          )}
        </ul>
        <div
          id="snackbar"
          className={
            this.state.quizDeleted || this.state.quizForked ? 'show' : ''
          }
        >
          {this.state.quizDeleted
            ? 'השאלון נמחק בהצלחה'
            : 'השאלון הועתק בהצלחה'}
        </div>
        <SweetAlert
          show={this.state.showDeleteQuizAlert}
          title="מחיקת שאלון"
          type="warning"
          text={this.state.showDeleteQuizAlert ? `האם אתה בטוח שברצונך למחוק את השאלון: ${this.state.quizToDelete.title}?` : ''}
          showCancelButton
          confirmButtonText="מחק!"
          cancelButtonText="בטל"
          onConfirm={() => {
            deleteQuiz();
            this.setState({ quizToDelete: null, showDeleteQuizAlert: false });
          }}
          onCancel={() => {
            this.setState({ quizToDelete: null, showDeleteQuizAlert: false });
          }}
          onEscapeKey={() => this.setState({ showDeleteQuizAlert: false })}
          onOutsideClick={() => this.setState({ showDeleteQuizAlert: false })}
        />
      </div>
    );
  }
}

Search.propTypes = {
  results: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const SearchContainer = ({ results, loading }) => {
  if (loading) return <Loading />;
  return <Search results={results} />;
};

SearchContainer.propTypes = {
  results: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default createContainer(({ query = '' }) => {
  Meteor.subscribe('tags.all');
  const searchHandle = Meteor.subscribe('quizes.search', query);
  const nameHandle = Meteor.subscribe('users.names');
  const loading = !searchHandle.ready() || !nameHandle.ready();
  const results = Quiz.find().fetch();
  return {
    loading,
    results,
  };
}, SearchContainer);
