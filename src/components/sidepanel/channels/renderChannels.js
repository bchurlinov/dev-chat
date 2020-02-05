import React from "react";
import {connect} from "react-redux";
import {setCurrentChannel, setChannelType} from "../../../store/actions";
import _ from "lodash";
import "./channels.scss";

const RenderChannels = ({sendChannels, setCurrentChannel, setChannelType, currentChannel}) => {

    const displayChannels = () => {
       return sendChannels && _.map(sendChannels.updatedChannels, (channel,index) => {
           return (
               <li key={index} onClick={() => setActiveChannel(channel)} className={addCurrentChannelClass(channel)}>
                   <span>#</span> {channel.name}
               </li>
           )
       })
    };

    const addCurrentChannelClass = (channel) => {
        if(currentChannel) {
            if(currentChannel.id === channel.id) {
                return "active-channel"
            }
        }
    };

    const setActiveChannel = currentChannel => {
        setCurrentChannel(currentChannel);
        setChannelType("public")
    };

    return(
        <div className="display-channels">
            <ul>
                {displayChannels()}
            </ul>
        </div>
    )
};

const mapDispatchToProps = dispatch => {
    return {
        setCurrentChannel: (setChannel) => dispatch(setCurrentChannel(setChannel)),
        setChannelType: (type) => dispatch(setChannelType(type))
    }
};

export default connect(null, mapDispatchToProps)(RenderChannels);
