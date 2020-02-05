import React, {useEffect, useState} from 'react';
import { connect } from "react-redux";
import {setCurrentChannel, setChannelType} from "../../../store/actions";
import { Icon, message } from "antd";
import AddChannel from "./addChannel";
import firebase from "../../../firebase";
import RenderChannels from "./renderChannels";
import "./channels.scss";

const Channels = ({ user, currentChannel, setCurrentChannel, setChannelType }) => {

    const [modal, setModal] = useState({ isVisible: false });

    const addChannel = inputs => {
        const { name, description } = inputs;
        const channelsRef = firebase.database().ref("channels");
        const key = channelsRef.push().key;

        const channelInformation = {
            name: name,
            details: description,
            id: key,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        };

        success();

        setTimeout(() => {
            setModal({
                ...modal,
                isVisible: false
            });
        }, 1750);

        channelsRef.child(key).update(channelInformation).then( snap => {
            console.log("Channel Added");
        })
    };

    const success = () => {
        message.success('Channel successfully created', 2);
    };


    const toggleModal = () => {
        setModal({
            ...modal,
            isVisible: !modal.isVisible
        })
    };

    const [allChannels, setAllChannels] = useState({
        updatedChannels: []
    });

    useEffect(() => {
        let updatedChannels = [];

        const channelsRef = firebase.database().ref("channels");
        channelsRef.on("child_added", snapshot => {
            let channels = snapshot.val();
            updatedChannels.push(channels);

            setAllChannels({
                ...allChannels,
                updatedChannels
            });

            setFirstChannel(updatedChannels)
        });

        return () => channelsRef.off();

    }, []);

    const setFirstChannel = getChannels => {
        const firstChannel = getChannels[0];

        if(firstChannel !== undefined) {
            setCurrentChannel(firstChannel);
            setChannelType("public");
        }
    };


    return (
        <div className="channels">
            <h3>
                <Icon type="interaction" data-type="channel" /> Channels
                <span onClick={toggleModal}><Icon type="plus-circle" /></span>
            </h3>

            <AddChannel
                modalVisibility={modal.isVisible}
                addChannel={(inputs) => addChannel(inputs)}
                clicked={toggleModal}
            />

            <RenderChannels
                sendChannels={allChannels}
                currentChannel={currentChannel}
                key={allChannels}
            />
        </div>
    );
};

const mapDispatchToProps = dispatch => {
  return {
      setCurrentChannel: (currentChannel) => dispatch(setCurrentChannel(currentChannel)),
      setChannelType: (type) => dispatch(setChannelType(type))
  }
};

export default connect(null, mapDispatchToProps)(Channels);