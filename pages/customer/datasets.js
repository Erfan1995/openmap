import Layout from '../../components/customer/layout/Layout';
import withPrivateServerSideProps from '../../utils/withPrivateServerSideProps';
import { useEffect, useState } from 'react';
import { Button, Divider, Typography, Tabs, Modal, Spin, message, notification, Card, Row, Avatar, Space, Image } from 'antd';
import styled from 'styled-components';
const { Title } = Typography;
const { TabPane } = Tabs;
import { postMethod, getDatasets, getTags, deleteMethod, getIpLocation } from "../../lib/api";
import { formatDate, fileSizeReadable } from "../../lib/general-functions";
// import FileUpload from '../../components/customer/mapComponents/FileUpload';
import nookies from 'nookies';
import UnlockedDataset from '../../components/customer/mapComponents/UnlockedDatasetTable';
import LockedDatasetTable from '../../components/customer/mapComponents/LockedDatasetTable';
import UserLocationTable from 'components/customer/mapComponents/UserLocationTable';
import csv from 'csv';
import GeoJSON from 'geojson';
import { LAT, LONG, DATASET } from '../../static/constant'
import dynamic from 'next/dynamic';
import { SettingOutlined, PlusCircleFilled, TwitterOutlined } from '@ant-design/icons';

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

const ApiTitle = styled.div`
    font-size: 15px;
    color:#929292;    
`

const CardWrapper = styled(Row)`
    background: #ececec;
    padding: 5px; 
`


const CardAvatar = styled(Avatar)`
    background: #ececec;
`

const CardAPI = styled(Card)`
    width: 200px; 
    margin: 10px; 
    border-radius: 20px
`
const CardSpace = styled(Space)`
    width: 100%
`

const Dataset = ({ authenticatedUser, collapsed, locked_data, unlocked_data, tags }) => {
    const FileUpload = dynamic(() => import('components/customer/mapComponents/FileUpload'), {
        ssr: false
    })
    const [dataset, setDataset] = useState(unlocked_data);
    const [lockedDataset, setLockedDataset] = useState(locked_data);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [locationVisible, setLocationVisible] = useState(false);

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
    const onModalClose = (res) => {
        setVisible(false);
        setDataset([...dataset, res]);
    }

    const onClick = async () => {
        // const res = await getIpLocation();
        // console.log('response ' + JSON.stringify(res));
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
                            centered
                            width='100%'
                            visible={visible}
                            destroyOnClose={true}
                            footer={[]}
                            onCancel={() => setVisible(false)}>
                            <Spin spinning={loading}>
                                <FileUpload user={authenticatedUser} onModalClose={onModalClose} />
                            </Spin>
                        </Modal>
                    </TabPane>
                    <TabPane tab={<span>{DATASET.LOCKED_DATASETS}</span>} key="2">
                        <LockedDatasetTable data={lockedDataset} updateUnlockedData={updateUnlockedData}
                            updatedLockedData={updatedLockedData} />
                    </TabPane>
                    <TabPane tab={<span>{DATASET.API}</span>} key="3">
                        <CardWrapper>
                            <CardAPI bodyStyle={{ padding: 10 }}>
                                <CardSpace direction="vertical">
                                    <Row justify="end">
                                        <SettingOutlined onClick={() => setLocationVisible(true)} style={{ color: '#878787' }}></SettingOutlined>
                                    </Row>
                                    <Row justify="center">
                                        <CardAvatar
                                            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                                        >
                                            <img src='/placeholder.png' height="40"></img>
                                        </CardAvatar>
                                    </Row>
                                    <Row justify="center">
                                        <ApiTitle>{DATASET.USER_API}</ApiTitle>
                                    </Row>
                                </CardSpace>
                            </CardAPI>
                            <CardAPI bodyStyle={{ padding: 10 }} >
                                <CardSpace direction="vertical">
                                    <Row justify="end">
                                        <PlusCircleFilled style={{ color: "#46a5c6" }}></PlusCircleFilled>
                                    </Row>
                                    <Row justify="center">
                                        <CardAvatar
                                            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                                            icon={<TwitterOutlined style={{ color: '#41a9ea' }}></TwitterOutlined>}
                                        >
                                        </CardAvatar>
                                    </Row>
                                    <Row justify="center">
                                        <ApiTitle>{DATASET.TWITTER_API}</ApiTitle>
                                    </Row>
                                </CardSpace>
                            </CardAPI>
                            <CardAPI bodyStyle={{ padding: 10 }} >
                                <CardSpace direction='vertical'>
                                    <Row justify="end">
                                        <SettingOutlined style={{ color: '#878787' }}></SettingOutlined>
                                    </Row>
                                    <Row justify="center">
                                        <CardAvatar
                                            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                                        >
                                        </CardAvatar>
                                    </Row>
                                    <Row justify="center">
                                        <ApiTitle>New API</ApiTitle>
                                    </Row>
                                </CardSpace>
                            </CardAPI>
                        </CardWrapper>
                        <Modal
                            centered
                            width='100%'
                            visible={locationVisible}
                            destroyOnClose={true}
                            footer={[]}
                            onCancel={() => setLocationVisible(false)}>

                            <UserLocationTable />
                            {/* <Spin spinning={loading}> */}

                            {/* <FileUpload user={authenticatedUser} onModalClose={onModalClose} /> */}
                            {/* </Spin> */}
                        </Modal>
                    </TabPane>
                    <TabPane tab={<span>{DATASET.SHARED}</span>} key="4">
                        SHARE TAB
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
            res?.forEach(element => {
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
                    destination: '/errors/500',
                    permanent: false,
                },
            }
        }
    },
);
export default Dataset;