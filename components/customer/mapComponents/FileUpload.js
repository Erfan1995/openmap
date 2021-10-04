import { List, Divider, Upload, message, Button, Typography, Row, Col, Spin, Modal, Card, notification } from 'antd';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { LAT, LONG, DATASET } from '../../../static/constant'
import { gapi } from 'gapi-script';
import ListDocuments from './ListDocuments';
import { fileSizeReadable } from 'lib/general-functions';
import { ArrowLeftOutlined } from '@ant-design/icons';
import csv from 'csv';
import GeoJSON from 'geojson';
import { postMethod } from 'lib/api';
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID;
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY;

// Array of API discovery doc URLs for APIs
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive';
const { Title } = Typography;
const { Dragger } = Upload;
const DataCard = styled(Card)`
border:1px solid lightgray;
:hover{
    opacity:0.8;
    cursor:pointer;
    box-shadow: 5px 5px 3px lightgray;
}
`;
const FileUploadDive = styled.div`
width: '50%';
 margin: 'auto';
  paddingTop: '40px';
`
const Photo = styled.img`
  width:50%;
  height:50%;
  
`
const DataTypeLayout = styled.div`
    padding:20px;
    height:100%;
`;
const data = [
    {
        title: 'csv',
        type: ['application/vnd.ms-excel', 'text/csv'],
        key: 1,
        src: '/csv.png'
    },
    {
        title: 'geojson',
        type: ['application/json'],
        key: 2,
        src: '/json-file.png'
    },
    {
        title: 'gdrive',
        type: ['googleDrive'],
        key: 3,
        src: '/google-drive.png'
    }

];
const FileUpload = ({ onChangeEvent, googleDriveFile, user, onModalClose }) => {
    const [fileType, setFileType] = useState([]);
    const [fileTypes, setFileTypes] = useState(data);
    const [uploadVisible, setUploadVisible] = useState(false);
    const [listDocumentsVisible, setListDocumentsVisibility] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [isLoadingGoogleDriveApi, setIsLoadingGoogleDriveApi] = useState(false);
    const [signedInUser, setSignedInUser] = useState();
    const [fileName, setFileName] = useState("file");
    const [cardClicked, setCardClicked] = useState(false);
    const [googleDriveVisible, setGoogleDriveVisible] = useState(false);
    const [datasetContent, setDatasetContent] = useState(null);
    const [hasCoordinate, setHasCoordinate] = useState(true);
    const [metaData, setMetaData] = useState(null);
    const [invalidFileSize, setInvalidFileSize] = useState(false);
    const [loading, setLoading] = useState(false);

    let fileReader;

    let fName = "";
    const openNotificationWithIcon = (type, message, description = null) => {
        notification[type]({
            message: message,
            description:
                description,
        });
    };
    //google drive part..............................................................
    const listFiles = (searchTerm = null) => {
        let query = "";
        //"or mimeType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'"
        if (searchTerm === null) {
            query = "mimeType='text/csv' or mimeType='application/json'  or mimeType='application/vnd.ms-excel'"

        } else {
            query = searchTerm;
        }
        setIsLoadingGoogleDriveApi(true);
        try {
            gapi.client.drive.files
                .list({
                    pageSize: 1000,
                    fields: 'nextPageToken, files(id, name, mimeType, modifiedTime, size)',
                    q: query

                })
                .then(function (response) {
                    const res = JSON.parse(response.body);
                    if (res) {
                        res.files.map((data) => {
                            data.size = fileSizeReadable(data.size);
                        });
                        setDocuments(res.files);
                        setIsLoadingGoogleDriveApi(false);
                        setListDocumentsVisibility(true);
                    } else {
                        setIsLoadingGoogleDriveApi(false);
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
            // Set the signed in user
            setSignedInUser(gapi.auth2.getAuthInstance().currentUser.le.wt);
            setIsLoadingGoogleDriveApi(false);
            // list files if user is authenticated
            listFiles();
        } else {
            // prompt user to sign in
            handleAuthClick();
        }
    };

    /**
     *  Sign out the user upon button click.
     */
    const handleSignOutClick = (event) => {
        setListDocumentsVisibility(false);
        let auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut();
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
            .then(() => {
                // Listen for sign-in state changes.
                gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
                // Handle the initial sign-in state.
                updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            },
                function (err) {
                    setIsLoadingGoogleDriveApi(false);
                    console.log("error initiating client", err);
                }
            )

    };

    const handleClientLoad = () => {
        gapi.load('client:auth2', initClient);
    };

    const onDataSeletected = (data, metaData) => {
        setListDocumentsVisibility(false);
        googleDriveData(metaData, data)
    };

    //Local part......................................................................
    const changeType = (type) => {
        setDatasetContent(null);
        setMetaData(null);
        setCardClicked(true);
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
            setGoogleDriveVisible(true);
            handleClientLoad();

        } else {
            setUploadVisible(true);
            setGoogleDriveVisible(false);
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
            setFileName(info.file.originFileObj.name + " file naem")
            if (info.file.status === "done") {
                onChangeFile(info);
                setFileName(info.file.originFileObj);
                setUploadVisible(true);
            }
        },
    };
    // File Data customization =======================================================================================

    const onChangeFile = ({ file }) => {
        setMetaData(
            {
                title: file.originFileObj.name,
                is_locked: false,
                user: user.id,
                size: file.originFileObj.size
            }
        )
        // if (file.originFileObj.size < 1e6) {
        setInvalidFileSize(false);
        fileReader = new FileReader();
        if (["application/vnd.ms-excel", 'text/csv'].find((item) => item === file.originFileObj.type)) {
            fileReader.onloadend = () => {
                csvToGeojson(fileReader.result)
            }
            fileReader.readAsText(file.originFileObj);

        } else {
            console.log(file.originFileObj);
            fileReader.onloadend = () => {
                handleFileRead(fileReader.result);
            }
            fileReader.readAsText(file.originFileObj, "UTF-8");

        }
        // setDataFile(file);
        // } else {
        //     setInvalidFileSize(true);
        // }

    }
    const googleDriveData = (metaData, data) => {
        setMetaData(
            {
                title: metaData.name,
                is_locked: false,
                user: user.id,
                size: metaData.size
            }
        )
        if (["application/vnd.ms-excel", 'text/csv',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].find((item) => item === metaData.mimeType)) {
            csvToGeojson(data.body)
        } else if (metaData.mimeType === 'application/json') {
            handleFileRead(data.result);
        }

    }
    const csvToGeojson = (file) => {
        csv.parse(file, (err, data) => {
            if (data) {
                let latitude;
                let longitude;
                const columns = data[0];
                columns.map((col) => {
                    for (let i = 0; i < LAT.length; i++) {
                        if (col === LAT[i]) {
                            latitude = col;
                        }
                    }
                    for (let i = 0; i < LONG.length; i++) {
                        if (col === LONG[i]) {
                            longitude = col;
                        }
                    }
                })
                if (latitude) {
                    setHasCoordinate(true)
                } else {
                    setHasCoordinate(false)
                }
                let arr = [];
                for (let j = 1; j < data.length; j++) {
                    let obj = {}
                    for (let i = 0; i < columns.length; i++) {
                        obj[columns[i]] = data[j][i]
                    }
                    arr[j] = obj;
                }
                arr.splice(0, 1)
                try {
                    let gJson = GeoJSON.parse(arr, { Point: [latitude, longitude] });
                    setDatasetContent(gJson);
                } catch (e) {
                    openNotificationWithIcon('error', DATASET.INVALID_FILE_CONTENT, DATASET.INVALID_FILE_CONTENT_DESC);
                    setHasCoordinate(false);
                }
            }
        })
    }
    const handleFileRead = (data) => {
        let jsData;
        try {
            jsData = JSON.parse(data);
            if (jsData.features) {
                if (jsData.features[0].geometry || jsData.features[0].properties || jsData.features[0].type) {
                    setHasCoordinate(true)
                } else {
                    openNotificationWithIcon('error', DATASET.INVALID_FILE_CONTENT, DATASET.INVALID_FILE_CONTENT_DESC);
                    setHasCoordinate(false);
                }
            }
            else {
                openNotificationWithIcon('error', DATASET.INVALID_FILE_CONTENT, DATASET.INVALID_FILE_CONTENT_DESC);
                setHasCoordinate(false);
            }
            setDatasetContent(jsData)
        } catch (e) {
            openNotificationWithIcon('error', DATASET.INVALID_FILE_CONTENT, DATASET.INVALID_FILE_CONTENT_DESC);
            setHasCoordinate(false);
        }

    };
    const storeData = async (datasetContent, metaData) => {
        if (hasCoordinate) {
            //     if (invalidFileSize === false) {
            console.log(datasetContent, 'datasetcontent')
            if (datasetContent && metaData) {
                setIsLoadingGoogleDriveApi(true);
                try {
                    if (datasetContent) {
                        const res = await postMethod('datasets', metaData)
                        res.title = res.title.split(".")[0];
                        res.updated_at = formatDate(res.updated_at);
                        res.maps = res.maps.length;
                        res.size = fileSizeReadable(res.size);
                        if (res) {

                            const resdataset = await postMethod('datasetcontents', { dataset: datasetContent.features, id: res.id });
                            // setDataset([...dataset, res]);
                            onModalClose(res);
                        }
                    }

                } catch (execption) {
                    setIsLoadingGoogleDriveApi(false);
                    message.error(DATASET.SERVER_SIDE_PROB);
                }
                finally {
                    setIsLoadingGoogleDriveApi(false);
                }
                setIsLoadingGoogleDriveApi(false)
            } else {
                message.error(DATASET.SELECTED_FILE_ERROR)
            }
            //     } else {
            //         openNotificationWithIcon('error', DATASET.INVALID_FILE_SIZE);
            //     }
        } else {
            openNotificationWithIcon('error', DATASET.INVALID_FILE_CONTENT, DATASET.INVALID_FILE_CONTENT_DESC);
        }
    }
    const checkAndStoreData = () => {
        storeData(datasetContent, metaData)
    }
    return (
        <Spin spinning={isLoadingGoogleDriveApi}>
            <DataTypeLayout style={{ height: '650px', }} >
                <div>
                    {
                        cardClicked ? <div>
                            {googleDriveVisible ?
                                <div>
                                    <div >
                                        <Button style={{ marginLeft: -10, marginTop: -30 }} icon={<ArrowLeftOutlined />} onClick={() => {
                                            setCardClicked(false);
                                        }} type='link'>back</Button>
                                    </div>
                                    <ListDocuments
                                        documents={documents}
                                        onSearch={listFiles}
                                        signedInUser={signedInUser}
                                        onSignOut={handleSignOutClick}
                                        onDataSeletected={onDataSeletected}
                                        setFileName={setFileName}
                                    />
                                    <Divider />
                                    <p>{metaData?.name}</p>
                                    <Button type="primary" style={{ float: 'right' }} onClick={() => checkAndStoreData()}>{DATASET.CONNECT_DATASET}</Button>
                                </div> : <div></div>

                            }</div> : <div></div>
                    }
                </div>
                <div>
                    {
                        cardClicked ? <div >
                            {
                                uploadVisible === true ? (

                                    <div style={{ width: '50%', margin: 'auto', paddingTop: '40px' }}>
                                        <div style={{ textAlign: 'center' }} >
                                            <img style={{ height: '5%', width: '5%' }} src={'/server.png'} />
                                            <h2 style={{ paddingTop: '3px' }} >{DATASET.ADD_NEW_DATASET}</h2>
                                            <Divider />
                                        </div>
                                        <Button style={{ marginLeft: -10, marginTop: -30 }} icon={<ArrowLeftOutlined />} onClick={() => {
                                            setCardClicked(false);
                                        }} type='link'>{DATASET.BACK}</Button>
                                        <p>{DATASET.DATASET_FILE_UPLOAD_DESC}</p>
                                        <Divider />
                                        <Title level={5}>{compareFileType('application/vnd.ms-excel') ? DATASET.UPLOAD_CSV : DATASET.UPLOAD_JSON}</Title>
                                        <Dragger  {...props} name="file" maxCount={1} multiple={false} >
                                            <p className="ant-upload-drag-icon">
                                                <InboxOutlined />
                                            </p>
                                            <p className="ant-upload-text">{compareFileType('application/vnd.ms-excel') ? DATASET.CLICK_OR_DRAG_CSV : DATASET.CLICK_OR_DRAG_JSON}</p>
                                        </Dragger>
                                        <Divider />
                                        <Button type="primary" style={{ float: 'right' }} onClick={() => checkAndStoreData()}>{DATASET.CONNECT_DATASET}</Button>
                                    </div>
                                ) : (
                                    <div> </div>
                                )
                            }
                        </div> :
                            <div style={{ width: '50%', margin: 'auto', paddingTop: '40px' }}>
                                <div style={{ textAlign: 'center' }} >
                                    <img style={{ height: '5%', width: '5%' }} src={'/server.png'} />
                                    <h2 style={{ paddingTop: '3px' }} >Add New Dataset</h2>
                                    <Divider />
                                </div>
                                <List
                                    grid={{
                                        gutter: 10,
                                        column: 4
                                    }}
                                    dataSource={fileTypes}
                                    renderItem={item => (
                                        <List.Item key={item.key}>
                                            <DataCard onClick={() => changeType(item.type)} style={{ textAlign: "center" }} >
                                                <Photo src={item.src} />
                                                <h4 >{item.title}</h4>
                                            </DataCard>
                                        </List.Item>
                                    )}
                                />
                            </div>

                    }
                </div>
            </DataTypeLayout >
        </Spin>
    )
}

export default FileUpload