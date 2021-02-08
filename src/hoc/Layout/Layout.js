import React, { Component } from 'react';

import Navigation from '../../components/Navigation/Navigation';
import Aux from '../Aux';
import classes from './Layout.module.css';

class Layout extends Component {

    render() {
        return (
            <Aux>
                <Navigation />
                <main className={classes.Layout}>
                    {this.props.children}
                </main>
            </Aux>
        );
    };
}

export default Layout;