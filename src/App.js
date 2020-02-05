import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentChannel } from "./store/actions/index";
import "./styles/main.scss";

import SidePanel from "./components/sidepanel/SidePanel";
import MessageComponent from "./components/messages/messageComponent";
import ChannelInfo from "./components/channelinfo/ChannelInfo";
import Loader from "./components/widgets/loader/Loader";

class App extends Component {

    state = {
        firstLoading: true
    };

    render() {
        return !this.props.currentUser ? <Loader /> : (
            <div className="chat-wrapper">
                <SidePanel
                    user={this.props.currentUser}
                    channel={this.props.currentChannel}
                    key={this.props.currentUser}
                />

                <MessageComponent
                    user={this.props.currentUser}
                    channel={this.props.currentChannel}
                    channelType={this.props.channelType}
                    key={Math.random()}
                />

                <ChannelInfo
                    user={this.props.currentUser}
                    channel={this.props.currentChannel}
                    channelType={this.props.channelType}
                    key={Math.random()}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        currentUser: state.user.currentUser,
        currentChannel: state.channel.currentChannel,
        channelType: state.channel.channelType
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setCurrentChannel: (user) => dispatch(setCurrentChannel(user))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);