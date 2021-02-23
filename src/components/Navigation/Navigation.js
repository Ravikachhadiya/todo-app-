import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import classes from './Navigation.module.css';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';

class navigation extends Component {

    state = {
        redirect: null,
    }

    logoutHandler = () => {
        this.props.logoutFun();
    }


    render() {
        return (
            <div className={classes.Navigation}>
                <p className={classes.Logo}>TODO APP</p>
                <div className={classes.NavigationButton}>
                    {
                        this.props.auth === "true" || this.props.auth === true ?
                            <Link to="/login">
                                <Button
                                    variant="success" className={classes.btn}
                                    onClick={this.logoutHandler}>
                                    Logout
                                </Button>
                            </Link>
                            :
                            <>
                                <Link to="/login">
                                    <Button variant="success" className={classes.btn}>Login</Button>
                                </Link>
                                <Link to="/registration">
                                    <Button variant="success" className={classes.btn}>Sign Up</Button>
                                </Link>
                            </>
                    }
                </div>

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
        login: () => dispatch({ type: 'LOGIN' }),
        logoutFun: () => dispatch({ type: 'LOGOUT' }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(navigation);
