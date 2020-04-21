import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

const GameClose = () => {
  const backToHome = () => {
    FlowRouter.go('Home');
  };
  return (
    <div id="game-close">
      <div className="game-background" />
      <div>
        <a
          href="javascript:void(0)"
          className="btn btn-primary show-leaders-btn"
          onClick={backToHome}
        >
          Home page
        </a>
      </div>
      <div className="row">
        <div id="title">
          <h1>The game is over</h1>
        </div>
      </div>
    </div>
  );
};

export default GameClose;
