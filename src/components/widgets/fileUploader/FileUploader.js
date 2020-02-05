import React, { Component } from 'react';
import { Progress } from 'antd';
import FileUploader from "react-firebase-file-uploader";
import firebase from "../../../firebase";

class ImageUploader extends Component {

    state = {
        isUploading: false,
        progress: 0,
        imageUrl: ""
    };

    handleUploadStart = () => {
        this.setState({
            isUploading: true,
            progress: 0
        })
    };

    handleProgress = progress => {
        this.setState({
            progress
        })
    };

    handleUploadError = error => {
        this.setState({
            isUploading: false
        })
    };

    handleUploadSuccess = filename => {
        this.setState({
            progress: 100,
            isUploading: false
        });


        firebase.storage().ref("images").child(filename).getDownloadURL()
            .then((url) => {
                this.props.imageData(url);
            })
    };

    render() {
        return (
            <div className="file-uploader">
                <FileUploader
                    accept="image/*"
                    name="chat-image"
                    randomizeFilename
                    storageRef={firebase.storage().ref("images")}
                    onUploadStart={this.handleUploadStart}
                    onUploadError={this.handleUploadError}
                    onUploadSuccess={this.handleUploadSuccess}
                    onProgress={this.handleProgress}
                />
                <div style={{ marginTop: "15px" }}>
                    {this.state.isUploading ?
                        <div>Progress:  <Progress percent={this.state.isUploading && this.state.progress} /> </div> : null
                    }
                </div>


            </div>
        );
    }
}

export default ImageUploader;