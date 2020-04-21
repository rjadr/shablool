import React from 'react';
import GameNavbar from '/imports/ui/components/game-navbar';

const Instructions = () => (
  <div>
    <div className="game-background" />
    <GameNavbar text="" num="" />
    <div className="main-content">
      <div className="row">
        <div className="screen-main-instructions">
          <h1 className="instructions-h"> You have entered the game! </h1>
          <h2 className="instructions-subheader instructions-h"> Do your see your name on the screen? </h2>
        </div>
      </div>
    </div>
  </div>
);

export default Instructions;
