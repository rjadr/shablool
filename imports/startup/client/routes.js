import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import layouts
import '../../ui/layouts/body/body.js';
import '../../ui/layouts/game/game.js';
import '../../ui/layouts/manage/manage.js';

// Import pages
import '../../ui/pages/home/home.js';
import '../../ui/pages/not-found/not-found.js';
import '../../ui/pages/createQuiz/createQuiz.js';

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'App_home' });
  },
});

FlowRouter.route('/createQuiz', {
  name: 'App.createQuiz',
  action() {
    BlazeLayout.render('App_body', { main: 'App_createQuiz' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};
