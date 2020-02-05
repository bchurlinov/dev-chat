import React, { useLayoutEffect } from 'react';
import moment from "moment";
import _ from "lodash";
import "./renderMessages.scss";

const RenderMessages = props => {

    const { messages } = props;
    const { channel } = props;

    useLayoutEffect(() => {
        const container = document.getElementById("render-messages-container");
        container.scrollTo(0, container.scrollHeight)
    }, [messages.length]);

    const checkTextImage = message => {
        let text = "";
        let image = "";

        if (message.hasOwnProperty("content")) {
            return text = <p>{message.content}</p>
        } else if (message.hasOwnProperty("image")) {
            return image = <img src={message.image} style={{ width: "100%", height: "350px", objectFit: "cover" }} alt="Dev Chat Image"/>
        }
    };

    const showMessages = allMessages => {
        return allMessages && _.map(allMessages, (message, index) => {

            return (
                <div className="render-messages-wrapper__item" key={index}>
                    <div>
                        <img src={message.user.avatar}  alt="Dev Chat Image"/>
                    </div>
                    <div>
                        <p>
                            <b>{message.user.name}</b>
                            <span>( {moment(message.timestamp).fromNow()} )</span>
                        </p>
                        {checkTextImage(message)}
                    </div>
                </div>
            )
        })
    };

    return (
        <div className="render-messages" id="render-messages-container">
            <div className="render-messages-wrapper">
                {showMessages(messages)}
            </div>
        </div>
    );
};

export default RenderMessages;