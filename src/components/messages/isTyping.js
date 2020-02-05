import React, { useState, useEffect } from "react";
import firebase from "../../firebase";
import _ from "lodash";
import "./isTyping.scss";

const IsTyping = ({ channel, user, sendTyping }) => {

    const [usersTyping, setUsersTyping] = useState({ typing: [] })

    useEffect(() => {

        if (channel) {

            let typingUsers = [];
            const isTypingRef = firebase.database().ref("isTyping").child(channel.id);
            isTypingRef.on("child_added", snapshot => {
                if (snapshot.key !== user.uid) {
                    typingUsers = typingUsers.concat({
                        id: snapshot.key,
                        name: snapshot.val()
                    });

                    setUsersTyping({
                        ...usersTyping,
                        typing: typingUsers
                    })
                }
            });

            isTypingRef.on("child_removed", snapshot => {
                const user_not = _.includes(typingUsers, (user.id === snapshot.key));

                if (!user_not) {
                    typingUsers = _.filter(typingUsers, (user) => {
                        return user.id !== snapshot.key
                    });

                    setUsersTyping({
                        ...usersTyping,
                        typing: typingUsers
                    })
                }
            });

            firebase.database().ref(".info/connected").on("value", snap => {
                if (snap.val() === true) {
                    firebase.database().ref("isTyping").child(channel.id).child(user.uid).onDisconnect().remove()
                }
            });

            return () => isTypingRef.off();
        }

    }, [sendTyping.length]);

    const renderDots = () => {
        return (
            <>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
            </>
        )
    }

    const showTypingUsers = () => {
        if (usersTyping.typing) {
            return _.map(usersTyping.typing, (item, index) => {
                return <p key={index}><b>{item.name}</b> <span>is typing</span> {renderDots()}</p>
            })
        }
    }



    return (
        <div className="isTyping-container">
            {showTypingUsers()}
        </div>
    )
}

export default IsTyping;