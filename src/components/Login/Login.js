import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';

import classes from './Login.module.css';
import axios from 'axios';

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
        //console.log(this.state.userData);

        // check data is valid or not
        if (this.formValidationHandler()) {

            let userDataTemp = Object.assign({}, this.state.userData);

            let apiUrl = 'http://192.168.1.139:3000/v1/user/login';
            axios.post(apiUrl, userDataTemp)
                .then(res => {
                    //console.log(res);
                    //console.log(res.data);
                    if (res.data.success === true) {
                        this.setState({ openSuccessSnackbar: true });
                        this.props.login();
                        localStorage.setItem("currentUser", res.data.data.id);

                        setTimeout(() =>
                            this.setState({ redirect: "/" }),
                            1500
                        );

                        return 0;
                    }
                    else if (res.data.message === "User data not found.") {
                        this.setState({ openErrorSnackbar: true });
                        return 0;
                    }
                });
        }
    }

    render() {
        let isLogin = JSON.parse(localStorage.getItem('isLogin'));
        if (isLogin) {
            setTimeout(() =>
                this.setState({ redirect: "/" }),
                100
            );
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
        auth: state.auth.isLogin
    }
}

const mapDispatchToProps = dispatch => {
    return {
        login: () => {
            return dispatch({ type: 'LOGIN' })
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
