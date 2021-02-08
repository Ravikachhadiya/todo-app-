import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import classes from './Navigation.module.css';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
// import { Redirect } from 'react-router-dom';
// import Layout from '../../hoc/Layout/Layout';

class navigation extends Component {

    state = {
        redirect: null,
    }

    logoutHandler = () => {
        this.props.logoutFun();
    }

    // componentDidMount = () => {
    //     if (this.props.auth == "false" || this.props.auth == false) {
    //         this.setState({ redirect: "/" });
    //     }
    // }

    render() {

        // console.log("2 logout : " + this.props.auth);
        // console.log("2 redirect : " + this.state.redirect);

        // if (this.state.redirect) {
        //     return <Layout>
        //         <Redirect to={{
        //             pathname: this.state.redirect,
        //         }} />
        //     </Layout>
        // }
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
        auth: state.authenticate.isLogin
    }
}

const mapDispatchToProps = dispatch => {
    return {
        login: () => dispatch({ type: 'LOGIN' }),
        logoutFun: () => dispatch({ type: 'LOGOUT' }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(navigation);
// export default navigation;
