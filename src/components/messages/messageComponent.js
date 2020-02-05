import React, { useState, useEffect, useRef } from "react";
import IsTyping from "./isTyping";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import firebase from "../../firebase";
import _ from "lodash";

import MessageHeader from "./messageHeader";
import RenderMessages from "./renderMessages";
import MessageForm from "./messageForm";
import "./messageComponent.scss";

const MessageComponent = props => {

    const { channel } = props;
    const { user } = props;
    const { channelType } = props;


    // Use State
    const [messages, setMessages] = useState({ updatedMessages: [] });
    const [filteredMessages, setFilteredMessages] = useState({ messages: [] });
    const [searchTerm, setSearchTerm] = useState({ value: "" });
    const [searchLoader, setSearchLoader] = useState({ loading: false });

    useEffect(() => {

        if (channel) {
            let updatedMessages = [];
            const messagesRef = firebase.database().ref("messages").child(channel.id);
            const listener = messagesRef.on("child_added", snapshot => {
                let getMessages = snapshot.val();
                updatedMessages.push(getMessages);

                setMessages({
                    ...messages,
                    updatedMessages
                });
            });

            return () => messagesRef.off();

        }

    }, []);

    const [isTyping, setIsTyping] = useState({ typing: "" });

    const channelUsers = () => {
        const allMessages = messages !== undefined && messages.updatedMessages;

        const reducedMessages = _.reduce(allMessages, (acc, sum) => {
            return acc.concat(sum.sender);
        }, []);

        return _.uniqBy(reducedMessages).length;
    };

    const trackIsTyping = value => {
        setIsTyping({
            ...isTyping,
            typing: value
        })
    };

    const handleSearch = (event) => {
        setSearchTerm({
            ...searchTerm,
            value: event.target.value
        })
    };

    const filterMessages = () => {
        const searchRegex = new RegExp(searchTerm.value, "gi");
        const allMessages = [...messages.updatedMessages];

        if (searchTerm.value.length > 0) {
            setSearchLoader({
                ...searchLoader,
                loading: true
            })
        }

        const filteredMessages = _.reduce(allMessages, (acc, sum) => {

            if ((sum.content && sum.content.match(searchRegex)) || (sum.user.name && sum.user.name.match(searchRegex))) {
                acc.push(sum);
            }

            return acc;
        }, []);

        setTimeout(() => {
            setSearchLoader({
                ...searchLoader,
                loading: false
            })
        }, 1000)

        setFilteredMessages({
            ...filterMessages,
            messages: filteredMessages
        });
    };

    return (
        <div className="chat-wrapper__item">
            <MessageHeader
                channel={channel}
                channelUsers={channelUsers()}
                search={(event) => handleSearch(event)}
                messages={messages.updatedMessages}
                filtered={filterMessages}
                loader={searchLoader.loading}
                channelType={channelType}
                />
            <RenderMessages
                messages={searchTerm.value.length > 0 ? filteredMessages.messages : messages.updatedMessages}
                channel={channel}
            />

            <IsTyping
                channel={channel}
                user={user}
                sendTyping={isTyping.typing}
            />

            <MessageForm
                channel={channel}
                user={user}
                typing={(value) => trackIsTyping(value)}
            />
        </div>
    )
};

MessageComponent.propTypes = {
    user: PropTypes.object,
    channel: PropTypes.object,
    channelType: PropTypes.string
};

export default connect(null, null)(MessageComponent);