import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input, Button, Icon, message } from "antd";
import _ from "lodash";
import md5 from "md5";
import "antd/dist/antd.css";
import "./Authentication.scss";

import firebase from "../../firebase";

const Register = () => {

    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        password: "",
        passwordconfirm: ""
    });

    const [errors, setErrors] = useState({
        err: []
    });

    const [loader, setLoader] = useState({ loading: false });

    const handleInput = event => {
        setInputs({
            ...inputs,
            [event.target.name]: event.target.value
        })
    };

    const handleSubmit = event => {
        event.preventDefault();

        if (formIsValid(inputs)) {

            setLoader({
                ...loader,
                loading: true
            });

            setErrors({
                err: []
            });

            firebase.auth().createUserWithEmailAndPassword(inputs.email, inputs.password).then(createdUser => {
                setLoader({
                    ...loader,
                    loading: true
                });

                // success(`An e-mail has been sent to ${inputs.email}. Please verify it !`);
                // sendEmailVerification();

                createdUser.user.updateProfile({
                    displayName: inputs.name,
                    photoURL: `http://gravatar.com/avatar/${md5(
                        createdUser.user.email
                    )}?d=identicon`
                }).then(() => {
                    saveUser(createdUser);
                }).catch(error => {
                    console.log(error);
                    setLoader({
                        ...loader,
                        loading: false
                    });

                });
            }).catch(error => {
                console.log(error);
                setLoader({
                    ...loader,
                    loading: false
                });

            });

        }
    };

    const saveUser = (user) => {
        return firebase.database().ref("users").child(user.user.uid).set({
            user: user.user.displayName,
            avatar: user.user.photoURL,
            id: user.user.uid
        })
    };

    const formIsValid = (inputs) => {
        let error = "";
        let errors = [];

        if (emptyInputFields()) {
            error = "All fields are required";
            setErrors({
                ...errors,
                err: errors.concat(error)
            });
            return false
        } else if (!emailValid()) {
            error = "Please enter a valid e-mail address";
            setErrors({
                ...errors,
                err: errors.concat(error)
            });
            return false
        } else if (!passWordsLength()) {
            error = "Password should contain at least 6 character";
            setErrors({
                ...errors,
                err: errors.concat(error)
            });
            return false;
        } else if (!comparePasswords()) {
            error = "Passwords do not match";
            setErrors({
                ...errors,
                err: errors.concat(error)
            });
            return false;
        }

        else {
            return true
        }
    };

    const emptyInputFields = () => {
        return (
            !inputs.name.length || !inputs.email.length || !inputs.password.length || !inputs.passwordconfirm.length
        )
    };

    const emailValid = () => {
        if (inputs.email.match(/\S+@\S+\.\S+/)) {
            return true
        } else {
            return false
        }
    };

    const showErrors = () => {
        return _.map(errors.err, (err, index) => {
            return <p key={index}>{err}</p>
        })
    }

    const passWordsLength = () => {
        if ((inputs.password.length || inputs.passwordconfirm.length) < 6) {
            return false;
        } else {
            return true;
        }
    };

    const comparePasswords = () => {
        if (inputs.password !== inputs.passwordconfirm) {
            return false;
        } else {
            return true;
        }
    };


    const notValid = keyword => {
        return _.some(errors.err, error => error.includes(keyword)) ? "not-valid" : ""
    };

    return (
        <>
            <div className="brand">
                <h1> <Icon type="wechat" /> Dev<span>Chat</span></h1>
            </div>
            <div className="auth-wrapper">
                <form onSubmit={handleSubmit} noValidate>
                    <h2><Icon type="export" />Register</h2>
                    <div className="form-group">
                        <label>Enter your name:</label>
                        <Input
                            type="text"
                            name="name"
                            value={inputs.name}
                            onChange={handleInput}
                        />
                    </div>

                    <div className="form-group">
                        <label>Enter your email address:</label>
                        <Input
                            type="email"
                            name="email"
                            value={inputs.email}
                            onChange={handleInput}
                            className={notValid("e-mail")}
                        />
                    </div>

                    <div className="form-group">
                        <label>Enter your password:</label>
                        <Input
                            type="password"
                            name="password"
                            value={inputs.password}
                            onChange={handleInput}
                            className={notValid("password")}
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm password:</label>
                        <Input
                            type="password"
                            name="passwordconfirm"
                            value={inputs.passwordconfirm}
                            onChange={handleInput}
                            className={notValid("password")}
                        />
                    </div>

                    <div className="show-auth-errors">
                        {showErrors()}
                    </div>

                    <div className="form-group" style={{ textAlign: "center" }}>
                        <Button
                            htmlType="submit"
                            type="primary"
                            disabled={loader.loading}
                            loading={loader.loading}
                        >
                            Register</Button>
                    </div>

                    <div className="auth-switch">
                        <p>You already have an account, <Link to="/login">click here</Link></p>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Register;