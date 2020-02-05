import React, {useState, useEffect} from 'react';
import {Icon, Collapse} from "antd";
import firebase from "../../firebase";
import _ from "lodash";
import "./ChannelInfo.scss";

const {Panel} = Collapse;

const ChannelInfo = ({user, channel, channelType}) => {

    const [posters, setPosters] = useState([]);

    useEffect(() => {
        if(channel) {
            let usersMessages = [];
            const messagesRef = firebase.database().ref("messages").child(channel.id);
            messagesRef.on("child_added", snapshot => {
                usersMessages.push(snapshot.val());

                const getMessages = _.reduce(usersMessages, (acc,sum) => {
                    return acc.concat(sum.user.name)
                }, []);

                const result = _.values(_.groupBy(getMessages)).map(d => ({
                    name: d[0], count: d.length
                }));

                const sorted = _.orderBy(result, ['count'], ['desc'] );

                setPosters({
                    ...posters,
                    sorted
                });

            });
        }

    }, [channel]);


    const postsCount = poster => {
      return poster.count > 1 ? `${poster.count} posts` : `${poster.count} post`
    };

    const setTopPosters = () => {
        if(posters.length !== 0) {
            return _.map(posters.sorted, (poster, index) => {
                return (
                    <li key={index}>
                        {poster.name} <b>{postsCount(poster)}</b>
                    </li>
                )
            })
        }
    };

    const renderChannel = () => {

        let channelInfo = null;

        if(channel && channelType === "public") {
            channelInfo = (
                <div className="channel-info-wrap">
                    <div>
                        <h3>{renderChannelIcon(channelType)} {channel.name}</h3>
                    </div>
                    <div>
                        <Collapse>
                            <Panel header={<span><Icon type="info-circle" /> Channel Details</span>} key="1">
                                <p>{channel.details}</p>
                            </Panel>
                            <Panel header={<span><Icon type="user" /> Top Posters</span>} key="2">
                                <ul>
                                    {setTopPosters()}
                                </ul>
                            </Panel>
                            <Panel header={<span><Icon type="pushpin" /> Created by</span>} key="3">
                                <div>
                                    <p><img src={channel.createdBy.avatar} alt="Dev Chat Image" /> <b>{channel.createdBy.name}</b> </p>
                                </div>
                            </Panel>
                        </Collapse>
                    </div>
                </div>
            )
        }

        return channelInfo;
    };

    const renderChannelIcon = channelType => {
        let channelTypeIcon = null;

        if(channelType === "private") {
            channelTypeIcon = <Icon type="user" />
        } else if(channelType === "public") {
            channelTypeIcon = <Icon type="number" />
        }

        return channelTypeIcon;
    };


    return (
        <div className="chat-wrapper__item">
            {renderChannel()}
        </div>
    );
};

export default ChannelInfo;
