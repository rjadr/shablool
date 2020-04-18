import { Meteor } from 'meteor/meteor';
import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            usernameError: false,
            passwordError: false,
        };
    }

    render() {
        const updateStateErrors = (e) => {
            switch(e.reason) {
                case 'User not found':
                    this.setState({ usernameError: true });
                    this.setState({ passwordError: false });
                    break;
                case 'Incorrect password':
                    this.setState({ usernameError: false });
                    this.setState({ passwordError: true });
                    break;
                default:
                    break;
            }
        };
        const loginAction = (isFormValid, username, password) => {
            return isFormValid ? Meteor.loginWithPassword
                (username, password, (e => {
                    e ? updateStateErrors(e) : null;
                })) : null;
        };
        const goHome = () => {
            return Meteor.userId() ? FlowRouter.go('Home') : null;
        };
        const login = (e) => {
            e.preventDefault();
            const password = e.target.password.value;
            const username = e.target.username.value;
            const isFormValid = username && password;
            loginAction(isFormValid, username, password);
            Meteor.setTimeout(goHome, 800);
        };

        return (
            <div id="login">
                <div className="login-background" />
                <form onSubmit={login}>
                    <h1>התחבר לשבלול</h1>
                    <div className={`form-group ${ this.state.usernameError ? 'has-error' : '' }`}>
                        <label htmlFor="username" className="sr-only">Username</label>
                        <input type="text" name="username" id="username" className="form-control" placeholder="username" required />
                        { this.state.usernameError ? <span className="help-block">This name does not exist in the system</span> : '' }
                    </div>
                    <div className={`form-group ${ this.state.passwordError ? 'has-error' : '' }`}>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input type="password" name="password" id="password" className="form-control" placeholder="password" required />
                        { this.state.passwordError ? <span className="help-block">Incorrect password</span> : '' }
                    </div>
                    <input type="submit" id="btn-login" className="btn btn-custom btn-lg btn-block" value="Connect!" />
                </form>
                <div className="link-message">Don't have an account yet? <a href="/Register">Register!</a></div>
            </div>
        );
    }
}

export default Login;
