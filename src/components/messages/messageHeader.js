import React from 'react';
import PropTypes from "prop-types";
import { Input, Icon } from "antd";
import _ from "lodash";
import "./messageHeader.scss";

const { Search } = Input;

const MessageHeader = props => {

    const { channel, loader, messages, channelType } = props;

    const getChannelUsers = () => {
        let users = [];

        const getUniqueMessages = _.map(messages, (message,index) => {
            users.push(message.user.name)
        });

        const getUniqueUsers = _.uniqBy(users);

        return getUniqueUsers.length
    };

    const setChannelTypeIcon = () => {
       let channelTypeIcon = null;

       if(channelType === "private") {
           channelTypeIcon = <Icon type="user" />
       } else if(channelType === "public") {
           channelTypeIcon = <Icon type="number" />
       }

       return channelTypeIcon;
    };

    return (
        <div className="message-header">
            <div className="message-header__item">
                <h3>
                    {setChannelTypeIcon()}
                    {channel && channel.name} <span>( {getChannelUsers()} users )</span>
                </h3>
            </div>

            <div className="message-header__item">
                <Search
                    placeholder="Search messages..."
                    onChange={value => props.search(value)}
                    onKeyUp={() => props.filtered()}
                    loading={loader}
                    style={{ width: 200 }}
                />
            </div>
        </div>
    );
};

MessageHeader.propTypes = {
    channel: PropTypes.object,
    loader: PropTypes.bool
}

export default MessageHeader;