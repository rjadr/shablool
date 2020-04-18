import { Meteor } from 'meteor/meteor';
import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Accounts } from 'meteor/accounts-base';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            passwordConfirmError: false,
            userNameUniqueError: false,
        };
    }

    render() {
        const updateUsernameUniqueState = (error) => {
            return error ?
                this.setState({ userNameUniqueError: true })
                : this.setState({ userNameUniqueError: false });
        };
        const updateConfirmPasswordState = (error) => {
            return error ?
                this.setState({ passwordConfirmError: true })
                : this.setState({ passwordConfirmError: false });
        };
        const registerAction = (isFormValid, username, password) => {
            return isFormValid ? Accounts.createUser({
                    username,
                    password,
                }, (e => {
                    updateUsernameUniqueState(e);
                })) : null;
        };
        const goHome = () => {
            return Meteor.userId() ? FlowRouter.go('Home') : null;
        };
        const register = (e) => {
            e.preventDefault();
            const password = e.target.password.value;
            const username = e.target.username.value;
            const passwordConfirmError = password === e.target.confirmPassword.value;
            updateConfirmPasswordState(!passwordConfirmError);
            const isFormValid = passwordConfirmError && password && username;
            registerAction(isFormValid, username, password);
            Meteor.setTimeout(goHome, 1000);
        };

        return (
        <div id="login">
            <div className="login-background" />
            <form onSubmit={register}>
                <h1>Join</h1>
                <div className={`form-group ${ this.state.userNameUniqueError ? 'has-error' : '' }`}>
                    <label htmlFor="username" className="sr-only">Username</label>
                    <input type="text" name="username" id="username" className="form-control" placeholder="username" required />
                    { this.state.userNameUniqueError ? <span className="help-block">The username already exists in the system</span> : '' }
                </div>
                <div className='form-group'>
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input type="password" name="password" id="password" className="form-control" placeholder="password" required />
                </div>
                <div className={`form-group ${ this.state.passwordConfirmError ? 'has-error' : '' }`}>
                    <label htmlFor="password" className="sr-only">Password verification</label>
                    <input type="password" name="confirmPassword" id="confirmPassword" className="form-control" placeholder="password confirmation" required />
                    { this.state.passwordConfirmError ? <span className="help-block">The passwords are not the same</span> : '' }
                </div>
                <input type="submit" id="btn-login" className="btn btn-custom btn-lg btn-block" value="הירשם!" />
            </form>
            <div className="link-message">Already have an account? <a href="/Login">Log in!</a></div>
        </div>
        );
    }
}

export default Register;
