import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import Quiz from '/imports/api/quizes/quizes';
import Game from '/imports/api/games/games';
import { managementTabs, eventTypes } from '/imports/startup/both/constants.js';
import Loading from '/imports/ui/components/loading';
import Snackbar from '/imports/ui/components/snackbar';
import MyQuizes from './my-quizes';
import GamesManaged from './games-managed';
import GamesPlayed from './games-played';
import GameLog from '../../../api/gamelogs/gamelogs';

class Manage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: managementTabs.myQuizes,
      quizToDelete: null,
      showDeleteQuizAlert: false,
      snackbarNotification: false,
    };
  }

  render() {
    const { myQuizes, gamesManagedAndGameLogs, gamesPlayedAndGameLogs } = this.props;
    const { activeTab, showDeleteQuizAlert, quizToDelete, snackbarNotification } = this.state;

    const changeTab = tabName => () => this.setState({ activeTab: tabName });

    const showDeleteAlert = (quiz) => {
      this.setState({ quizToDelete: quiz, showDeleteQuizAlert: true });
    };

    const deleteQuiz = () => {
      quizToDelete.applyMethod('delete', []);

      const notifyUser = () => {
        this.setState({ snackbarNotification: 'השאלון נמחק בהצלחה' });
        setTimeout(() => this.setState({ snackbarNotification: false }), 3000);
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
        this.setState({ snackbarNotification: 'השאלון הועתק בהצלחה' });
        setTimeout(() => this.setState({ snackbarNotification: false }), 3000);
      };
      notifyUser();
    };

    const actions = {
      showDeleteAlert,
      forkQuiz,
    };

    return (
      <div id="management">
        <ManageTabs activeTab={activeTab} changeTab={changeTab} />
        <div className="tab-content">
          <MyQuizes activeTab={activeTab} myQuizes={myQuizes} actions={actions} />
          <GamesManaged activeTab={activeTab} gamesManagedAndGameLogs={gamesManagedAndGameLogs} />
          <GamesPlayed activeTab={activeTab} gamesPlayedAndGameLogs={gamesPlayedAndGameLogs} />
        </div>
        {snackbarNotification ? <Snackbar message={snackbarNotification} /> : ''}
        <SweetAlert
          show={showDeleteQuizAlert}
          title="מחיקת שאלון"
          type="warning"
          text={
            showDeleteQuizAlert
              ? `האם אתה בטוח שברצונך למחוק את השאלון: ${quizToDelete.title}?`
              : ''
          }
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

Manage.propTypes = {
  myQuizes: PropTypes.arrayOf(PropTypes.object).isRequired,
  gamesManagedAndGameLogs: PropTypes.arrayOf(PropTypes.object).isRequired,
  gamesPlayedAndGameLogs: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const ManageContainer =
({ loading, myQuizes, gamesPlayedAndGameLogs, gamesManagedAndGameLogs }) => {
  if (loading) return <Loading />;
  return (<Manage
    myQuizes={myQuizes}
    gamesPlayedAndGameLogs={gamesPlayedAndGameLogs}
    gamesManagedAndGameLogs={gamesManagedAndGameLogs}
  />);
};

ManageContainer.propTypes = {
  loading: PropTypes.bool.isRequired,
  myQuizes: PropTypes.arrayOf(PropTypes.object).isRequired,
  gamesManagedAndGameLogs: PropTypes.arrayOf(PropTypes.object).isRequired,
  gamesPlayedAndGameLogs: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default createContainer(() => {
  const myQuizesHandle = Meteor.subscribe('quizes.my-quizes');
  const gamesPlayedHandle = Meteor.subscribe('gamelogs.get-games-played');
  const gamesManagedHandle = Meteor.subscribe('games.games-managed');

  const loading =
    !myQuizesHandle.ready() || !gamesPlayedHandle.ready() || !gamesManagedHandle.ready();

  const myQuizes = Quiz.find().fetch(); // TODO: fix query
  const gamesManaged = Game.find({ 'quiz.owner': Meteor.userId() }).fetch().reverse();

  const gamesPlayedId = GameLog.find({
    $and: [
      { 'event.nameType': eventTypes.PlayerReg },
      { 'event.playerId': Meteor.userId() },
    ],
  }).map(o => o.gameId);
  const gamePlayedAndClosedId = GameLog.find({
    $and: [
      { gameId: { $in: gamesPlayedId } },
      { 'event.nameType': eventTypes.GameClose },
    ],
  }).map(o => o.gameId);
  const gamesPlayed = Game.find({ _id: { $in: gamePlayedAndClosedId } })
    .fetch()
    .reverse();
  const gamesPlayedAndGameLogs = gamesPlayed.map(g => ({
    game: g,
    gameLog: GameLog.find({ gameId: g._id }).map(o => o.event),
  }));
  const gamesManagedAndGameLogs = gamesManaged.map(g => ({
    game: g,
    gameLog: GameLog.find({ gameId: g._id }).map(o => o.event),
  }));
  return {
    loading,
    myQuizes,
    gamesPlayedAndGameLogs,
    gamesManagedAndGameLogs,
  };
}, ManageContainer);

const ManageTabs = ({ activeTab, changeTab }) => (
  <div
    className="tab-btns btn-pref btn-group btn-group-justified btn-group-lg"
    id="tabs-area"
    role="group"
  >
    <div className="btn-group" role="group">
      <button
        className={`btn ${activeTab === managementTabs.myQuizes ? 'btn-primary' : 'btn-default'}`}
        onClick={changeTab(managementTabs.myQuizes)}
      >
        <span className="glyphicon glyphicon-list-alt" aria-hidden="true" />
        <div className="hidden-xs">השאלונים שלי</div>
      </button>
    </div>
    <div className="btn-group" role="group">
      <button
        className={`btn ${activeTab === managementTabs.gamesManaged
            ? 'btn-primary'
            : 'btn-default'}`}
        onClick={changeTab(managementTabs.gamesManaged)}
      >
        <span className="glyphicon glyphicon-briefcase" aria-hidden="true" />
        <div className="hidden-xs">משחקים שניהלתי</div>
      </button>
    </div>
    <div className="btn-group" role="group">
      <button
        className={`btn ${activeTab === managementTabs.gamesPlayed
            ? 'btn-primary'
            : 'btn-default'}`}
        onClick={changeTab(managementTabs.gamesPlayed)}
      >
        <span className="glyphicon glyphicon-stats" aria-hidden="true" />
        <div className="hidden-xs">משחקים ששיחקתי</div>
      </button>
    </div>
  </div>
  );

ManageTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  changeTab: PropTypes.func.isRequired,
};
