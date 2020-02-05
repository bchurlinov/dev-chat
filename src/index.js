import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, Redirect, withRouter } from "react-router-dom";

import App from "./App";
import Login from "./components/authentication/Login";
import Register from "./components/authentication/Register";

import firebase from "./firebase";

import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./store/reducers";

import { setUser } from "./store/actions";

const store = createStore(rootReducer, composeWithDevTools());

class Root extends Component {

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            // console.log(user);
            if (user) {
                this.props.setUser(user);
                this.props.history.push("/");
            } else {
                this.props.history.push("/login")
            }
        });
    }

    render() {
        return (
            <>
                <Switch>
                    <Route exact path="/" component={App} />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <Redirect to="/" />
                </Switch>
            </>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setUser: (user) => dispatch(setUser(user))
    }
}

const mapStateToProps = state => {
    return {
        isLoading: state.isLoading
    }
}


const RootWithStore = withRouter(connect(mapStateToProps, mapDispatchToProps)(Root));


ReactDOM.render(<Provider store={store}>
    <BrowserRouter>
        <RootWithStore />
    </BrowserRouter>
</Provider>, document.getElementById('root'));