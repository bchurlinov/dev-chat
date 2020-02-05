import React, { Component } from "react";
import { connect } from "react-redux";
import UserPanel from "./userPanel";
import DirectMessages from "./directMessages";
import Channels from "./channels/channels";
import { Icon } from "antd";
import "./SidePanel.scss";

class SidePanel extends Component {

    state = {
        user: this.props.user
    };

    render() {
        return (
            <div className="chat-wrapper__item">
                <div className="side-panel-logo">
                    <h1>
                        <Icon type="wechat" /> Dev<span>Chat</span>
                    </h1>
                </div>

                <UserPanel
                    user={this.state.user}
                />

                <Channels
                    user={this.state.user}
                    currentChannel={this.props.currentChannel}
                />

                <DirectMessages
                    user={this.state.user}
                    channel={this.props.currentChannel}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        currentChannel: state.channel.currentChannel
    }
};

export default connect(mapStateToProps, null)(SidePanel);