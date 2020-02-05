import React, { useState } from 'react';
import { Modal, Icon, Button, Input, message } from "antd";
import firebase from "../../firebase";
import "./editUser.scss";

const styles = {
    heading: {
        marginBottom: 0,
        fontSize: "18px",
        textAlign: "center"
    },

    icon: {
        marginRight: "5px",
        fontSize: "20px",
        position: "relative",
        top: "1px",
        display: "inline-block"
    }
};

const EditUser = ({user, isVisible, toggleModal}) => {

    const [inputs, setInputs] = useState({
        name: "",
        email: ""
    });

    const changeHandler = event => {
        setInputs({
            ...inputs,
            [event.target.name]: event.target.value
        })
    };

    const submitFormHandler = event => {
        event.preventDefault();

        if (checkIfValid()) {
            success();
            setTimeout(() => {
                toggleModal();
            }, 1750);

            user.updateProfile({
                displayName: inputs.name
            }).then(() => {
                user.updateEmail(inputs.email ? inputs.email : user.email)
            }).then(() => {
                firebase.database().ref("users").child(user.uid).update({
                    user: user.displayName,
                    avatar: user.photoURL,
                    id: user.uid
                })
            })
        }
    };

    const success = () => {
        message.success('Channel created successfully', 2);
    };

    const checkIfValid = () => {
        if (!checkNameValid()) {
            console.log("name invalid");
            return false
        } else if (!checkEmailValid()) {
            console.log("email invalid");
            return false
        } else {
            return true
        }
    };

    const checkEmailValid = () => {
        if (inputs.email.match(/\S+@\S+\.\S+/) || inputs.email === "") {
            return true
        } else {
            return false
        }
    };

    const checkNameValid = () => {
        if (inputs.name === "" || inputs.name.length < 2) {
            return false
        } else {
            return true
        }
    };

    console.log(user);

    return (
        <div>
            <Modal
                title={
                    <h3 style={styles.heading}>
                        <Icon type="user" data-type="channel" style={styles.icon}/> Edit user
                    </h3>
                }
                visible={isVisible}
                footer={null}
                onCancel={toggleModal}
            >
                <div className="editUserCard">
                    <div className="editUserCard__photo">
                        <img src={user.photoURL} alt="Dev Chat User Image"/>
                    </div>
                    <div className="editUserCard__user">
                        <form onSubmit={submitFormHandler} noValidate>
                            <div className="form-group">
                                <label>Name:</label>
                                <Input
                                    name="name"
                                    type="text"
                                    onChange={changeHandler}
                                    placeholder={user && user.displayName}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <Input
                                    name="email"
                                    type="email"
                                    onChange={changeHandler}
                                    placeholder={user && user.email}
                                />
                            </div>
                            <div style={{textAlign: "center"}}>
                                <Button type="primary" htmlType="submit">Submit changes</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default EditUser;