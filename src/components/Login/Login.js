import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';

import classes from './Login.module.css';

class Login extends Component {
    state = {
        userData: {},
        error: {},
        openErrorSnackbar: false,
        openSuccessSnackbar: false,
        redirect: null,
    };

    handleChange = (event) => {
        let userDataTemp = this.state.userData;
        userDataTemp[event.target.name] = event.target.value;
        this.setState({ userData: userDataTemp });
    };

    errorHandleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ openErrorSnackbar: false });

    };

    successHandleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ openSuccessSnackbar: false });
    };

    formValidationHandler = () => {
        let isFormValid = true;
        this.setState({ error: {} });

        // email not be empty
        if (!this.state.userData["email"]) {
            isFormValid = false;

            let errorTemp = this.state.error;
            errorTemp["email"] = "email can not be empty!";

            this.setState({ error: errorTemp });
        }

        // email should be in correct form
        if (typeof this.state.userData["email"] !== "undefined") {
            if (!this.state.userData["email"].match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
                isFormValid = false;

                let errorTemp = this.state.error;
                errorTemp["email"] = "Please enter valid email address!";

                this.setState({ error: errorTemp });
            }
        }

        // Password not be empty
        if (!this.state.userData["password"]) {
            isFormValid = false;

            let errorTemp = this.state.error;
            errorTemp["password"] = "Please enter password!";

            this.setState({ error: errorTemp });
        }

        return isFormValid;
    }

    onSubmit = (event) => {
        event.preventDefault();
        console.log(this.state.userData);

        // check data is valid or not
        if (this.formValidationHandler()) {

            // get user data from local storage
            let userData = JSON.parse(localStorage.getItem('userData'));
            console.log(userData);

            // get data from state
            let userDataTemp = Object.assign({}, this.state.userData);

            // local storage is empty ?
            if (userData == null) {
                this.setState({ openErrorSnackbar: true });
                return 0;
            }
            else {

                let isUserValid = userData.find((element) => {
                    if (element.email === userDataTemp.email
                        && element.password === userDataTemp.password) {
                        JSON.stringify(localStorage.setItem("currentUser", element.email));
                        return true;
                    }
                    return false;
                });

                if (isUserValid) {
                    this.setState({ openSuccessSnackbar: true });
                    localStorage.setItem('isLogin', JSON.stringify(true));
                    this.props.login();
                    this.setState({ redirect: "/" });
                    return 0;
                }
                else {
                    this.setState({ openErrorSnackbar: true });
                    return 0;
                }
            }

        }
    }

    render() {
        let isLogin = JSON.parse(localStorage.getItem('isLogin'));
        if (isLogin) {
            this.setState({ redirect: "/" });
        }

        if (this.state.redirect) {
            return <Redirect to={{
                pathname: this.state.redirect,
                state: { login: true }
            }} />
        }
        return (
            <div className={classes.Login}>
                <h4 className={classes.Title}>Login</h4>
                <Form onSubmit={this.onSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control name="email" type="email" placeholder="Enter email" onChange={this.handleChange} />
                        <Form.Text className="text-muted">
                            {this.state.error.email}
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Control name="password" type="password" placeholder="Password" onChange={this.handleChange} />
                        <Form.Text className="text-muted">
                            {this.state.error.password}
                        </Form.Text>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
                <Snackbar open={this.state.openSuccessSnackbar} autoHideDuration={6000} onClose={this.successHandleClose}>
                    <Alert onClose={this.successHandleClose} severity="success">Login Successfully!</Alert>
                </Snackbar>
                <Snackbar open={this.state.openErrorSnackbar} autoHideDuration={6000} onClose={this.errorHandleClose}>
                    <Alert onClose={this.errorHandleClose} severity="error">Invalid email or password!</Alert>
                </Snackbar>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.authenticate.isLogin
    }
}

const mapDispatchToProps = dispatch => {
    return {
        login: () => {
            console.log("login");
            return dispatch({ type: 'LOGIN' })
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
