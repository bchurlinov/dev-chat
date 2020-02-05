import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input, Button, Icon } from "antd";
import "antd/dist/antd.css";
import "./Authentication.scss";

import firebase from "../../firebase";

const Login = () => {

    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    });

    const [formErrors, setFormErrors] = useState({
            err: []
    });

    const [loader, setLoader] = useState({
        loading: false
    })

    const handleInput = event => {
        setInputs({
            ...inputs,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmit = event => {
        event.preventDefault();

        if (formIsValid(inputs)) {
            console.log("Success");
        }
    }

    const formIsValid = ({ email, password }) => {
        let error = "";
        let errors = [];

        if (!checkEmailValid(email)) {
            error = "Please enter a valid e-mail address";
            setFormErrors({
                ...formErrors,
                err: errors.concat(error)
            });
            return false;
        } else if (!checkPasswordValid(password)) {
            error = "Password should contain at least 6 character";
            setFormErrors({
                ...formErrors,
                err: errors.concat(error)
            });
            return false;
        } else {
            setLoader({
                ...loader,
                loading: true
            });
            firebase.auth().signInWithEmailAndPassword(email, password).then(user => {
                setLoader({
                    ...loader,
                    loading: false
                });
            }).catch(error => {

                setLoader({
                    ...loader,
                    loading: false
                });

                console.log(error);

                setFormErrors({
                    ...formErrors,
                    err: formErrors.err.concat(error.message)
                })
            })
        }
    }

    const checkEmailValid = email => {
        if (email.match(/\S+@\S+\.\S+/)) {
            return true
        } else {
            return false
        }
    }

    const checkPasswordValid = password => {
        if (password.length < 6) {
            return false;
        } else {
            return true;
        }
    }

    const showErrors = error => {
        return _.map(error, (err, index) => {
            return <p key={index}>{err}</p>
        });
    }

    return (
        <>
            <div className="brand">
                <h1><Icon type="wechat" /> Dev<span>Chat</span></h1>
            </div>
            <div className="auth-wrapper">
                <form onSubmit={handleSubmit} noValidate>
                    <h2><Icon type="export" />Login</h2>

                    <div className="form-group">
                        <label>Enter your email address:</label>
                        <Input
                            type="email"
                            name="email"
                            onChange={handleInput}
                        />
                    </div>

                    <div className="form-group">
                        <label>Enter your password:</label>
                        <Input
                            type="password"
                            name="password"
                            onChange={handleInput}
                        />
                    </div>

                    <div className="show-auth-errors">
                        {showErrors(formErrors.err)}
                    </div>

                    <div className="form-group" style={{ textAlign: "center" }}>
                        <Button
                            htmlType="submit"
                            type="primary"
                            disabled={loader.loading}
                            loading={loader.loading}
                        >
                            Log In</Button>
                    </div>

                    <div className="auth-switch">
                        <p>You don't have an account, <Link to="/register">click here</Link></p>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Login;
