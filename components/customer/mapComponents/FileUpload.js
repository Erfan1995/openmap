import { List, Divider, Upload, message, Button, Typography, Row, Col, Spin, Modal } from 'antd';
import styled from 'styled-components';
import { useState, useRef } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { DATASET } from '../../../static/constant'
import { gapi } from 'gapi-script';
import ListDocuments from './ListDocuments';

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID;
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY;

// Array of API discovery doc URLs for APIs
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive';
const { Title } = Typography;
const { Dragger } = Upload;
const SelectType = styled(Button)`
  margin-bottom: 10px;
  width:100px;
  height:80px;
`;
const DataTypeLayout = styled.div`
    padding:20px;
`;
const data = [
    {
        title: 'csv',
        type: ['application/vnd.ms-excel', 'text/csv'],
        key: 1
    },
    {
        title: 'geojson',
        type: ['application/json'],
        key: 2
    },
    {
        title: 'google drive',
        type: ['googleDrive'],
        key: 3
    }

];
const FileUpload = ({ onChangeEvent, googleDriveFile }) => {
    const [fileType, setFileType] = useState([]);
    const [fileTypes, setFileTypes] = useState(data);
    const [uploadVisible, setUploadVisible] = useState(false);
    const [listDocumentsVisible, setListDocumentsVisibility] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [isLoadingGoogleDriveApi, setIsLoadingGoogleDriveApi] = useState(false);
    const [signedInUser, setSignedInUser] = useState();

    //google drive part..............................................................
    const listFiles = (searchTerm = null) => {
        setIsLoadingGoogleDriveApi(true);
        try {
            gapi.client.drive.files
                .list({
                    pageSize: 1000,
                    fields: 'nextPageToken, files(id, name, mimeType, modifiedTime, size)',
                    // q: searchTerm,
                    q: "mimeType='text/csv' or mimeType='application/json' or mimeType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' or mimeType='application/vnd.ms-excel'",

                })
                .then(function (response) {
                    const res = JSON.parse(response.body);
                    if (res) {
                        console.log(res);
                        setDocuments(res.files);
                        setIsLoadingGoogleDriveApi(false);
                        setListDocumentsVisibility(true);
                    } 
                });
        } catch (e) {
            setIsLoadingGoogleDriveApi(false);
        }
    };

    /**
     *  Sign in the user upon button click.
     */
    const handleAuthClick = (event) => {
        gapi.auth2.getAuthInstance().signIn();
    };

    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    const updateSigninStatus = (isSignedIn) => {
        if (isSignedIn) {
            console.log(isSignedIn, 'signed in')
            // Set the signed in user
            setSignedInUser(gapi.auth2.getAuthInstance().currentUser.le.wt);
            setIsLoadingGoogleDriveApi(false);
            // list files if user is authenticated
            listFiles();
        } else {
            // prompt user to sign in
            console.log('not signed in')
            handleAuthClick();
        }
    };

    /**
     *  Sign out the user upon button click.
     */
    const handleSignOutClick = (event) => {
        setListDocumentsVisibility(false);
        let auth2 = gapi.auth2.getAuthInstance();
        console.log(auth2);
        auth2.signOut().then(() => {
            gapi.signin2.render({
                prompt: 'select_account'
            })
        });
        console.log('check logged user', gapi.auth2.getAuthInstance().signIn());

    };

    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    const initClient = () => {
        setIsLoadingGoogleDriveApi(true);
        gapi.client
            .init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES,
            })
            .then(
                function () {
                    // Listen for sign-in state changes.
                    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

                    // Handle the initial sign-in state.
                    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                },
                function (error) { }
            );
    };

    const handleClientLoad = () => {
        gapi.load('client:auth2', initClient);
    };

    const showDocuments = () => {
        setListDocumentsVisibility(true);
    };

    const onModalClose = (data, metaData) => {
        setListDocumentsVisibility(false);
        googleDriveFile(metaData, data)
    };


    //Local part......................................................................
    const changeType = (type) => {
        setFileType(type);
        setFileTypes(data.map((obj) => {
            if (type === obj.type) {
                return { ...obj, isSelected: true }
            } else {
                return { ...obj, isSelected: false }
            }
        }));
        if (type[0] === "googleDrive") {
            setUploadVisible(false);
            handleClientLoad();

        } else {
            setUploadVisible(true);
        }
    }


    const compareFileType = (type) => {
        return fileType.find((item) => item === type);
    }

    const props = {
        beforeUpload: file => {
            if (!compareFileType(file.type)) {
                message.error(`${file.type} is not a valid file`);
            }
            return compareFileType(file.type) ? true : Upload.LIST_IGNORE;
        },
        onChange: info => {
            onChangeEvent(info);
        },
    };

    return (
        <Spin spinning={isLoadingGoogleDriveApi}>
            <DataTypeLayout>
                <Modal
                    width={800}
                    title={DATASET.ADD_DATASET}
                    centered
                    visible={listDocumentsVisible}
                    destroyOnClose={true}
                    onCancel={() => {
                        setListDocumentsVisibility(false)
                    }}
                    footer={[
                        <Button key="close" onClick={() => { setListDocumentsVisibility(false) }}> {DATASET.CLOSE}</Button>
                    ]} >
                    <Spin spinning={isLoadingGoogleDriveApi}>
                        <ListDocuments
                            documents={documents}
                            onSearch={listFiles}
                            signedInUser={signedInUser}
                            onSignOut={handleSignOutClick}
                            onModalClose={onModalClose}
                        />
                    </Spin>
                </Modal>
                <List
                    grid={{
                        gutter: [16, 16],
                        xs: 1,
                        sm: 2,
                        md: 3,
                        lg: 4,
                        xl: 5,
                        xxl: 6
                    }}
                    dataSource={fileTypes}
                    renderItem={item => (
                        <List.Item key={item.key}>
                            <SelectType className={item.isSelected ? 'selectedBox' : ''} onClick={() => changeType(item.type)} >{item.title}</SelectType>
                        </List.Item>
                    )}
                />
                {
                    uploadVisible === true ? (
                        <div>
                            <Divider />
                            <Title level={5}>{compareFileType('application/vnd.ms-excel') ? DATASET.UPLOAD_CSV : DATASET.UPLOAD_JSON}</Title>
                            <Dragger  {...props} name="file" maxCount={1} multiple={false} >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">{compareFileType('application/vnd.ms-excel') ? DATASET.CLICK_OR_DRAG_CSV : DATASET.CLICK_OR_DRAG_JSON}</p>
                            </Dragger>

                        </div>
                    ) : (
                        <div> </div>
                    )
                }
            </DataTypeLayout >
        </Spin>
    )
}

export default FileUpload