import React, { useState } from 'react';
import { Input, Button, Modal, Icon, message } from "antd";
import firebase from "../../firebase";
import { Picker } from "emoji-mart";
import 'emoji-mart/css/emoji-mart.css'
import ImageUploader from "../widgets/fileUploader/FileUploader";
import _ from "lodash";
import "./messageForm.scss";

const MessageForm = ({ channel, user, typing }) => {

    const [inputs, setInputs] = useState({ message: "" });
    const [modal, setModal] = useState({ isVisible: false });
    const [emojiPicker, setEmojiPicker] = useState({ isVisible: false });

    const toggleModal = () => {
        setModal({
            ...modal,
            isVisible: !modal.isVisible
        });
    };

    const handleInput = event => {
        setInputs({
            ...inputs,
            [event.target.name]: event.target.value
        });
    };

    const submitHandler = event => {
        event.preventDefault();

        const senderMessage = {
            content: inputs.message,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                avatar: user.photoURL,
                name: user.displayName,
                id: user.uid
            }
        };

        if (inputValid()) {
            firebase.database().ref("messages").child(channel.id).push().set(senderMessage);
            firebase.database().ref("notifications").child(channel.id).update({
                user: {
                    name: user.displayName,
                    id: user.uid
                }
            });

            setInputs({
                ...inputs,
                message: ""
            });
        }
    };

    const inputValid = () => {
        if (inputs.message.length > 0) {
            return true;
        } else {
            error();
            return false;
        }
    };

    const error = () => {
        message.error("New message can't be empty");
    };

    const isTyping = event => {
        typing(event.target.value);

        if (inputs.message) {
            firebase.database().ref("isTyping").child(channel.id).child(user.uid).set(user.displayName)
        } else {
            firebase.database().ref("isTyping").child(channel.id).child(user.uid).remove();
        }
    };

    const getImageData = imageUrl => {
        const senderMessage = {
            image: imageUrl,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                avatar: user.photoURL,
                name: user.displayName,
                id: user.uid
            }
        };

        firebase.database().ref("messages").child(channel.id).push().set(senderMessage);
    };

    const toggleEmojiPicker = event => {
        event.preventDefault();

        setEmojiPicker({
            ...emojiPicker,
            isVisible: !emojiPicker.isVisible
        })
    };

    const renderEmojiPicker = () => {
        return emojiPicker.isVisible ? <Picker
            set="apple"
            style={{ position: 'absolute', bottom: '115px', left: '25px', zIndex: "999" }}
            title="Pick your emoji"
            emoji="point_up"
            onSelect={handleAddEmoji}
        /> : null
    };

    const handleAddEmoji = emoji => {
        setInputs({
            ...inputs,
            message: inputs.message.concat(emoji.native)
        });

        setEmojiPicker({
            ...emojiPicker,
            isVisible: !emojiPicker.isVisible
        })
    };

    const keyDownHandler = event => {
        if (event.keyCode === 13) {
            submitHandler(event);
        }
    };

    const emojiButtonClicked = () => {
        return emojiPicker.isVisible ? "emoji-button-clicked" : ""
    };

    return (
        <div className="message-form">
            <form onSubmit={submitHandler}>
                <div className="message-form__item">
                    <div className="send-message-wrap">
                        <button onClick={(event) => toggleEmojiPicker(event)} className={emojiButtonClicked()}>
                            <Icon type="plus" />
                        </button>
                        <Input
                            placeholder="Enter new message"
                            autoComplete="off"
                            name="message"
                            type="text"
                            value={inputs.message}
                            onChange={handleInput}
                            onKeyDown={keyDownHandler}
                            onKeyUp={isTyping}
                        />
                    </div>
                </div>

                <div className="message-form__item">
                    <Button type="primary" htmlType="submit">
                        <Icon type="mail" /> Send Message
                    </Button>
                    <Button type="primary" onClick={toggleModal}>
                        <Icon type="file-image" /> Upload an Image
                    </Button>
                </div>

                {renderEmojiPicker()}
            </form>

            <Modal
                title="Upload an image"
                visible={modal.isVisible}
                onOk={() => toggleModal()}
                okText="Done Uploading"
                onCancel={() => toggleModal()}
            >
                <ImageUploader
                    imageData={(data) => getImageData(data)}
                />
            </Modal>
        </div>
    );
};

export default MessageForm;