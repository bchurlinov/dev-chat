import React, { useState } from 'react';
import PropTypes from "prop-types";
import { Icon, Modal, Input, Button, message } from "antd";
import _ from "lodash";
import "./channels.scss";

const AddChannel = ({ modalVisibility, clicked, addChannel }) => {

    const [inputs, setInputs] = useState({
        name: "",
        description: ""
    });

    const [errors, setErrors] = useState({
        errMessage: []
    });

    const styles = {
        heading: {
            marginBottom: 0,
            fontSize: "18px",
            textAlign: "center"
        },

        icon: {
            marginRight: "10px",
            fontSize: "20px",
            position: "relative",
            top: "1px",
            display: "inline-block"
        }
    };

    const handleInputChange = event => {
        setInputs({
            ...inputs,
            [event.target.name]: event.target.value
        })
    };

    const handleSubmit = event => {
        event.preventDefault();

        if (formIsValid()) {
            addChannel(inputs);

            setInputs({
                ...inputs,
                name: "",
                description: ""
            });

            setTimeout(() => {
                clicked();
            }, 1750);
        }
    };

    const success = () => {
        message.success('Channel created successfully', 2);
    };

    const formIsValid = () => {
        if (!validChannelName()) {
            return false;
        } else if (!validChannelDescription()) {
            return false;
        } else {
            setErrors({
                ...errors,
                errMessage: []
            });
            return true;
        }
    };

    const validChannelName = () => {
        let error = "";
        let err = [];

        if (inputs.name.length === 0) {
            error = "Channel name field can't be empty";
            setErrors({
                ...errors,
                errMessage: err.concat(error)
            });
            return false;
        } else if (inputs.name.length < 2) {
            error = "Channel name field should contain at least 2 letters";
            setErrors({
                ...errors,
                errMessage: err.concat(error)
            });
            return false;
        } else if (!inputs.name.match(/^[a-zA-Z]+$/)) {
            error = "Channel name field shouldn't contain numbers or special characters";
            setErrors({
                ...errors,
                errMessage: err.concat(error)
            });
            return false;
        } else {
            return true
        }
    };

    const validChannelDescription = () => {
        let error = "";
        let err = [];

        if (inputs.description.length === 0) {
            error = "Channel description field can't be empty";
            setErrors({
                ...errors,
                errMessage: err.concat(error)
            });
            return false;
        } else if (inputs.description.length < 10) {
            error = "Channel description should contain at least 10 letters"
            setErrors({
                ...errors,
                errMessage: err.concat(error)
            });
            return false;
        } else {
            return true;
        }
    };

    const renderErrorMessages = () => {
        return _.map(errors.errMessage, (error, index) => {
            return <p key={index}>{error}</p>
        })
    };

    const checkErrorClass = name => {
        return _.some(errors.errMessage, message => {
            return message.toLowerCase().includes(name)
        }) ? "not-valid" : "valid";
    };

    return (
        <div>
            <Modal
                title={
                    <h3 style={styles.heading}>
                        <Icon type="interaction" data-type="channel" style={styles.icon} /> Add a channel
                    </h3>
                }
                visible={modalVisibility}
                onOk={addChannel}
                onCancel={clicked}
                footer={null}
            >
                <div className="channel-modal">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Add channel name: </label>
                            <Input
                                onChange={handleInputChange}
                                className={checkErrorClass("name")}
                                value={inputs.name}
                                name="name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Add channel description: </label>
                            <Input.TextArea
                                onChange={handleInputChange}
                                className={checkErrorClass("description")}
                                value={inputs.description}
                                name="description"
                                rows={4}
                            />
                        </div>

                        <div className="render-channel-errors">
                            {renderErrorMessages()}
                        </div>

                        <div className="form-group" style={{ textAlign: "center" }}>
                            <Button type="primary" htmlType="submit">
                                <Icon type="plus-circle" />Add Channel
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

AddChannel.propTypes = {
    modalVisibility: PropTypes.bool,
    addChannel: PropTypes.func,
    clicked: PropTypes.func
};

export default AddChannel;