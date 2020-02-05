import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { setCurrentChannel, setChannelType } from "../../store/actions/index";
import PropTypes from "prop-types";
import { Icon } from "antd";
import firebase from "../../firebase";
import _ from "lodash";
import "./directMessages.scss";

const DirectMessages = (props) => {

    const { user } = props;
    const { channel } = props;
    const [users, setUsers] = useState({ users: [] });

    useEffect(() => {

        let allUsers = [];
        let usersRef = firebase.database().ref("users");
        const listener = usersRef.on("child_added", snapshot => {
            if (snapshot) {
                if (user.uid !== snapshot.val().id) {
                    const userObject = {
                        avatar: snapshot.val().avatar,
                        id: snapshot.val().id,
                        user: snapshot.val().user,
                        status: "offline"
                    };

                    allUsers.push(userObject);

                    setUsers({
                        ...users,
                        users: allUsers
                    })
                }
            }
        });

        firebase.database().ref(".info/connected").on("value", snapshot => {
            if (snapshot.val() === true) {
                const ref = firebase.database().ref("presence").child(user.uid);
                ref.set(true);
                ref.onDisconnect().remove()
            }
        });

        firebase.database().ref("presence").on("child_added", snapshot => {
            if (snapshot.key !== user.uid) {
                getStatus(snapshot.key, true, allUsers);
            }
        });

        firebase.database().ref("presence").on("child_removed", snapshot => {
            if (snapshot.key !== user.uid) {
                getStatus(snapshot.key, false, allUsers)
            }
        });

        return () => usersRef.off();

    }, []);

    const getStatus = (userId, status, allUsers) => {

        const updatedUsers = _.reduce(allUsers, (acc, user) => {
            if (user.id === userId) {
                user["status"] = `${status ? "online" : "offline"}`;
            }
            return acc.concat(user);
        }, []);

        setUsers({
            ...users,
            users: updatedUsers
        })
    };

    const totalUsers = () => {
        if (users && users.users.length !== 0) {
            return users.users.length
        }
    };

    const statusIndicator = user => {
        let indicator = null;

        if (user.status === "online") {
            indicator = <span style={{ background: "#66ff66" }}></span>
        } else if (user.status === "offline") {
            indicator = <span style={{ background: "#ff3232" }}></span>
        }

        return indicator;
    };


    const renderUsersList = users => {
        if (users) {
            return _.map(users, (user, index) => {
                return (
                    <li key={index}
                        onClick={() => getUserData(user)}
                        className={setActiveUserClass(user)}
                    >
                        {statusIndicator(user)} {user.user}
                    </li>
                )
            })
        }
    };

    const setActiveUserClass = user => {
        if(channel){
            return  _.includes(channel.id, user.id) ? "active-user" : "";
        }
    };

    const getUserData = clickedUser => {

        const setUserChannel = {
            avatar: clickedUser.avatar,
            name: clickedUser.user,
            id: clickedUser.id < user.uid ? `${clickedUser.id}-${user.uid}` : `${user.uid}-${clickedUser.id}`
        };

        props.setCurrentChannel(setUserChannel);
        props.setChannelType("private")
    };

    return (
        <div className="direct-messages">
            <h3><Icon type="mail" />Direct Messages {" "}( <b> {totalUsers()} </b> )</h3>
            <ul>
                {renderUsersList(users.users)}
            </ul>
        </div>
    )
};

DirectMessages.propTypes = {
    user: PropTypes.object
};

const mapDispatchToProps = dispatch => {
    return {
        setCurrentChannel: (currentChannel) => dispatch(setCurrentChannel(currentChannel)),
        setChannelType: (type) => dispatch(setChannelType(type))
    }
};

export default connect(null, mapDispatchToProps)(DirectMessages);