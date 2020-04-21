import React from 'react';

const NotFound = () => (
  <div id="not-found">
    <div className="game-background" />
    <div className="row">
      <img className="logo" src="/img/Logo.svg" alt="logo" />
    </div>
    <div className="row">
      <div className="not-found-title">
        <h1>Oops...</h1>
        <h3>Sorry, this page does not exist!</h3>
        <a href="/" className="gotohomepage">Return to home page</a>
      </div>
    </div>
  </div>
);

export default NotFound;
