import React, {useState} from "react";
import PropTypes from "prop-types";
import { Dropdown, Icon, Menu } from "antd";
import EditUser from "./editUser";
import firebase from "../../firebase";
import "./userPanel.scss";

const UserPanel = props => {

    const { user } = props;

    const [userModal, setUserModal] = useState({isVisible: false});

    const toggleEditUserModal = () => {
        setUserModal({
            ...userModal,
            isVisible: !userModal.isVisible
        })
    };

    const logOut = () => {
        firebase.auth().signOut().then(() => {
            firebase.database().ref("presence").child(user.uid).remove();
        });
    };

    const menu = (
        <Menu>
            <Menu.Item className="user-panel-menu-item">
                <a onClick={toggleEditUserModal} href="# ">
                    <Icon type="edit" /> Edit User
                </a>
            </Menu.Item>
            <Menu.Item className="user-panel-menu-item">
                <a onClick={logOut} href="# ">
                    <Icon type="import" /> Log Out
            </a>
            </Menu.Item>
        </Menu>
    );

    return (
        <div className="user-panel">
            <Dropdown overlay={menu}>
                <a className="ant-dropdown-link" href="# ">
                    <img src={user && user.photoURL} alt="Dev Chat Image" /> Welcome, <span>{user && user.displayName}</span> <Icon type="down" />
                </a>
            </Dropdown>

            <EditUser
                user={user}
                isVisible={userModal.isVisible}
                toggleModal={() => toggleEditUserModal()}
            />
        </div>
    )
};

UserPanel.propTypes = {
    photoURL: PropTypes.string,
    displayName: PropTypes.string
};

UserPanel.defaultProps = {
    displayName: "User"
};

export default UserPanel;