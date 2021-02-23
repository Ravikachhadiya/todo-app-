import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import classes from './Registration.module.css';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

// import { makeStyles } from '@material-ui/core/styles';

class Registration extends Component {

    state = {
        userData: {},
        error: {},
        openErrorSnackbar: false,
        openSuccessSnackbar: false,
        redirect: null,
        isLogin: localStorage.getItem('isLogin')
    };

    componentWillUnmount = () => {
        this.setState = {
            userData: {},
            error: {},
            openErrorSnackbar: false,
            openSuccessSnackbar: false,
            redirect: null,
            isLogin: false
        };
    }
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

        // First Name not be empty
        if (!this.state.userData["first_name"]) {
            isFormValid = false;

            let errorTemp = this.state.error;
            errorTemp["first_name"] = "first name can not be empty!";

            this.setState({ error: errorTemp });
        }

        // First Name should be in character only
        if (typeof this.state.userData["first_name"] !== "undefined") {
            if (!this.state.userData["first_name"].match(/^[a-zA-Z]+$/)) {
                isFormValid = false;

                let errorTemp = this.state.error;
                errorTemp["first_name"] = "Please use only characters!";

                this.setState({ error: errorTemp });
            }
        }

        // Last Name not be empty
        if (!this.state.userData["last_name"]) {
            isFormValid = false;

            let errorTemp = this.state.error;
            errorTemp["last_name"] = "last name can not be empty!";

            this.setState({ error: errorTemp });
        }

        // Last Name should be in character only
        if (typeof this.state.userData["last_name"] !== "undefined") {
            if (!this.state.userData["last_name"].match(/^[a-zA-Z]+$/)) {
                isFormValid = false;

                let errorTemp = this.state.error;
                errorTemp["last_name"] = "Please use only characters!";

                this.setState({ error: errorTemp });
            }
        }

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

        // Password contain at least one lower case, one upper case, one number, and length 6 - 16. 
        if (typeof this.state.userData["password"] !== "undefined") {
            if (!this.state.userData["password"].match(/[a-z]/g)) {
                isFormValid = false;

                let errorTemp = this.state.error;
                errorTemp["password"] = "Enter at least one lower case character!";

                this.setState({ error: errorTemp });
            }
            else if (!this.state.userData["password"].match(/[A-Z]/g)) {
                isFormValid = false;

                let errorTemp = this.state.error;
                errorTemp["password"] = "Enter at least one upper case character!";

                this.setState({ error: errorTemp });
            }
            // else if (!this.state.userData["password"].match(/^[!@#\$%\^\&*\)\(+=._-]+$/g)) {
            //     isFormValid = false;

            //     let errorTemp = this.state.error;
            //     errorTemp["password"] = "Enter at least one special character from ! @ # $ % ^ ( ) & - _ = +";

            //     this.setState({ error: errorTemp });
            // }
            else if (!this.state.userData["password"].match(/[0-9]/g)) {
                isFormValid = false;

                let errorTemp = this.state.error;
                errorTemp["password"] = "Enter one number from 0 - 9!";

                this.setState({ error: errorTemp });
            }
            else if ((this.state.userData["password"].length < 6 || this.state.userData["password"].length > 16)) {
                isFormValid = false;

                if ((this.state.userData["password"].length < 6 || this.state.userData["password"].length > 16)) {
                    //console.log("len :" + true);
                }
                //console.log("password len : " + this.state.userData["password"].length);

                let errorTemp = this.state.error;
                errorTemp["password"] = "Password length should be in between 6 to 16!";

                this.setState({ error: errorTemp });
            }
        }

        // Confirm password not be empty
        if (!this.state.userData["confirmPassword"]) {
            isFormValid = false;

            let errorTemp = this.state.error;
            errorTemp["confirmPassword"] = "Please enter confirm password!";

            this.setState({ error: errorTemp });
        }

        // Confirm password same as password. 
        if (typeof this.state.userData["confirmPassword"] !== "undefined") {
            if (!this.state.userData["confirmPassword"] === this.state.userData["password"]) {
                isFormValid = false;

                let errorTemp = this.state.error;
                errorTemp["confirmPassword"] = "confirm password are not match with password!";

                this.setState({ error: errorTemp });
            }
        }

        return isFormValid;
    }

    onSubmit = (event) => {
        event.preventDefault();
        //console.log(this.state.userData);
        if (this.formValidationHandler()) {

            let userDataTemp = Object.assign({}, this.state.userData);
            delete userDataTemp.confirmPassword;

            userDataTemp.profile_photo = "https://image.freepik.com/free-vector/businessman-profile-cartoon_18591-58479.jpg";

            const apiUrl = 'http://192.168.1.139:3000/v1/user/registerUser';

            axios.post(apiUrl, userDataTemp).then(res => {
                //console.log(res);
                if (res.data.success === true) {
                    //console.log("done");
                    this.setState({ openSuccessSnackbar: true });
                    this.setState({ redirect: "/login" });
                    return 0;
                }
                else if (res.data.message === "User already register with this email.") {
                    //console.log("not");
                    this.setState({ openErrorSnackbar: true });
                    return 0;
                }
            })

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
            <div className={classes.Registration}>
                <h4 className={classes.Title}>Registration</h4>
                <Form onSubmit={this.onSubmit}>
                    <Form.Group>
                        <Form.Control
                            name="email"
                            type="email"
                            placeholder="Enter email"
                            onChange={this.handleChange} />
                        <Form.Text className="text-muted">
                            {this.state.error["email"]}
                        </Form.Text>
                    </Form.Group>

                    <Form.Group >
                        <Form.Control
                            name="first_name"
                            type="text"
                            placeholder="First name"
                            onChange={this.handleChange}
                        />
                        <Form.Text className="text-muted">
                            {this.state.error["first_name"]}
                        </Form.Text>
                    </Form.Group>

                    <Form.Group >
                        <Form.Control
                            name="last_name"
                            type="text"
                            placeholder="Last name"
                            onChange={this.handleChange}
                        />
                        <Form.Text className="text-muted">
                            {this.state.error["last_name"]}
                        </Form.Text>
                    </Form.Group>

                    <Form.Group >
                        <Form.Control
                            name="password"
                            type="password"
                            placeholder="Password"
                            onChange={this.handleChange}
                        />
                        <Form.Text className="text-muted">
                            {this.state.error["password"]}
                        </Form.Text>
                    </Form.Group>

                    <Form.Group >
                        <Form.Control
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            onChange={this.handleChange}
                        />
                        <Form.Text className="text-muted">
                            {this.state.error["confirmPassword"]}
                        </Form.Text>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                </Button>
                </Form>
                <Snackbar open={this.state.openSuccessSnackbar} autoHideDuration={6000} onClose={this.successHandleClose}>
                    <Alert onClose={this.successHandleClose} severity="success">Registered  Successfully!</Alert>
                </Snackbar>
                <Snackbar open={this.state.openErrorSnackbar} autoHideDuration={6000} onClose={this.errorHandleClose}>
                    <Alert onClose={this.errorHandleClose} severity="error">Email address already registered!</Alert>
                </Snackbar>

            </div>
        );
    }

}

export default Registration;