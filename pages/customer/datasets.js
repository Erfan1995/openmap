import Layout from '../../components/customer/layout/Layout';
import withPrivateServerSideProps from '../../utils/withPrivateServerSideProps';
import { useEffect, useState } from 'react';
import { Button, Divider, Typography, Tabs, Modal, Spin, message, notification } from 'antd';
import styled from 'styled-components';
const { Title } = Typography;
const { TabPane } = Tabs;
import { postMethod, getDatasets, getTags } from "../../lib/api";
import { formatDate, fileSizeReadable } from "../../lib/general-functions";
import FileUpload from '../../components/customer/mapComponents/FileUpload';
import nookies from 'nookies';
import UnlockedDataset from '../../components/customer/mapComponents/UnlockedDatasetTable';
import LockedDatasetTable from '../../components/customer/mapComponents/LockedDatasetTable';
import csv from 'csv';
import GeoJSON from 'geojson';
import { LAT, LONG, DATASET } from '../../static/constant'
const MapsWrapper = styled.div`
background:#ffffff;
padding:20px;
margin:10px;
`;
const AddNew = styled(Button)`
  margin-bottom: 10px;
  float: right !important;
`;
const CardTitle = styled(Title)`
  margin-bottom: 10px;
  float: left !important;
`;

const Dataset = ({ authenticatedUser, collapsed, locked_data, unlocked_data, tags }) => {
    const [dataset, setDataset] = useState(unlocked_data);
    const [lockedDataset, setLockedDataset] = useState(locked_data);
    const [visible, setVisible] = useState(false);
    const [file, setDataFile] = useState();
    const [loading, setLoading] = useState(false);
    const [datasetContent, setDatasetContent] = useState();
    const [hasCoordinate, setHasCoordinate] = useState(true);
    const [invalidFileSize, setInvalidFileSize] = useState(false);
    let fileReader;
    const openNotificationWithIcon = (type, message, description = null) => {
        notification[type]({
            message: message,
            description:
                description,
        });
    };
    const onChangeFile = ({ file }) => {

        if (file.originFileObj.size < 1e6) {
            setInvalidFileSize(false);
            fileReader = new FileReader();
            if (file.originFileObj.type === "application/vnd.ms-excel") {
                fileReader.onloadend = () => {
                    csv.parse(fileReader.result, (err, data) => {
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
                            setHasCoordinate(false);
                        }
                    })
                }
                fileReader.readAsText(file.originFileObj);

            } else {
                fileReader.onloadend = handleFileRead;
                fileReader.readAsText(file.originFileObj, "UTF-8");

            }
            setDataFile(file);
        } else {
            setInvalidFileSize(true);
        }

    }
    const handleFileRead = (e) => {
        const content = fileReader.result;
        let jsData;
        try {
            jsData = JSON.parse(content);
            if (jsData.features) {
                if (jsData.features[0].geometry || jsData.features[0].properties || jsData.features[0].type) {
                    setHasCoordinate(true)
                } else {
                    setHasCoordinate(false);
                }
            }
            else {
                setHasCoordinate(false);
            }
            setDatasetContent(jsData)
        } catch (e) {
            setHasCoordinate(false);
        }

    };
    const storeData = async () => {
        if (hasCoordinate) {
            if (invalidFileSize === false) {
                setLoading(true);
                try {
                    const res = await postMethod('datasets', { title: file.originFileObj.name, is_locked: false, user: authenticatedUser.id, size: file.originFileObj.size })
                    res.title = res.title.split(".")[0];
                    res.updated_at = formatDate(res.updated_at);
                    res.maps = res.maps.length;
                    res.size = fileSizeReadable(res.size);
                    setDataset([...dataset, res]);
                    if (res) {
                        const resdataset = await postMethod('datasetcontents', { dataset: datasetContent.features, id: res.id });
                    }

                } catch (execption) {
                    setLoading(false);
                    message.error(DATASET.SERVER_SIDE_PROB);
                }
                finally {
                    setLoading(false);
                    setVisible(false);
                }
                setLoading(false)
            } else {
                openNotificationWithIcon('error', DATASET.INVALID_FILE_SIZE);
            }
        } else {
            openNotificationWithIcon('error', DATASET.INVALID_FILE_CONTENT, DATASET.INVALID_FILE_CONTENT_DESC);
        }
    }
    const updateUnlockedData = (unlockedData, lockedData) => {
        setDataset([...dataset, unlockedData[0]]);
        setLockedDataset(lockedData);
    }
    const updateLockedData = (lockedData, unlockedData) => {
        setLockedDataset([...lockedDataset, lockedData[0]])
        setDataset(unlockedData);
    }
    const updatedData = (data) => {
        setDataset(data);
    }
    const updatedLockedData = (data) => {
        setLockedDataset(data);
    }
    return (
        <Layout collapsed={collapsed} user={authenticatedUser}>
            <MapsWrapper  >

                <CardTitle level={4}>{DATASET.DATASETS}</CardTitle>
                <AddNew type='primary' onClick={() => setVisible(true)}>{DATASET.ADD_DATASET}</AddNew>
                <Divider />


                <Tabs defaultActiveKey="1">
                    <TabPane tab={<span>{DATASET.UNLOCKED_DATASETS}</span>} key="1">
                        <UnlockedDataset data={dataset} updateLockedData={updateLockedData} updatedData={updatedData}
                            user={authenticatedUser} tags={tags} />
                        <Modal
                            title={DATASET.ADD_DATASET}
                            centered
                            visible={visible}
                            destroyOnClose={true}
                            onOk={() => storeData()}
                            onCancel={() => setVisible(false)}>
                            <Spin spinning={loading}>
                                <FileUpload onChangeEvent={onChangeFile} />
                            </Spin>
                        </Modal>
                    </TabPane>
                    <TabPane tab={<span>{DATASET.LOCKED_DATASETS}</span>} key="2">
                        <LockedDatasetTable data={lockedDataset} updateUnlockedData={updateUnlockedData}
                            updatedLockedData={updatedLockedData} />
                    </TabPane>
                </Tabs>
            </MapsWrapper>
        </Layout>
    )
}
export const getServerSideProps = withPrivateServerSideProps(
    async (ctx, verifyUser) => {
        try {
            const { token } = nookies.get(ctx);
            let tags = await getTags(token);
            let res = await getDatasets({ user: verifyUser.id }, token);
            let lockedData = [];
            let unlockedData = [];
            let index1 = 0;
            let index2 = 0;
            res.forEach(element => {
                element.id = Number(element.id);
                element.title = element.title.split(".")[0];
                element.maps = element.maps.length;
                element.updated_at = formatDate(element.updated_at);
                element.size = fileSizeReadable(element.size);
                element.key = element.id;
                if (element.is_locked === true) {
                    lockedData[index1] = element
                    index1++;
                } else {
                    unlockedData[index2] = element
                    index2++;
                }
            });
            return { props: { authenticatedUser: verifyUser, locked_data: lockedData, unlocked_data: unlockedData, tags: tags } }
        } catch (error) {
            return {
                redirect: {
                    destination: '/server-error',
                    permanent: false,
                },
            }
        }
    },
);
export default Dataset;