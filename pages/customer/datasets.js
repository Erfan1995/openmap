import Layout from '../../components/customer/layout/Layout';
import withPrivateServerSideProps from '../../utils/withPrivateServerSideProps';
import { useEffect, useState } from 'react';
import { Button, Divider, Typography, Tabs, Modal, Spin, message, notification, Card, Row, Avatar, Space } from 'antd';
import styled from 'styled-components';
const { Title } = Typography;
const { TabPane } = Tabs;
import { postMethod, getDatasets, getTags, deleteMethod } from "../../lib/api";
import { formatDate, fileSizeReadable } from "../../lib/general-functions";
// import FileUpload from '../../components/customer/mapComponents/FileUpload';
import nookies from 'nookies';
import UnlockedDataset from '../../components/customer/mapComponents/UnlockedDatasetTable';
import LockedDatasetTable from '../../components/customer/mapComponents/LockedDatasetTable';
import csv from 'csv';
import GeoJSON from 'geojson';
import { LAT, LONG, DATASET } from '../../static/constant'
import dynamic from 'next/dynamic';
import { SettingOutlined, PlusCircleFilled } from '@ant-design/icons';

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
    const FileUpload = dynamic(() => import('components/customer/mapComponents/FileUpload'), {
        ssr: false
    })
    const [dataset, setDataset] = useState(unlocked_data);
    const [lockedDataset, setLockedDataset] = useState(locked_data);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

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
                        <Row style={{ background: '#ececec', padding: 5 }}>
                            <Card bodyStyle={{ padding: 10 }} style={{ width: 200, margin: 10, borderRadius: 20 }}>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Row justify="end">
                                        <SettingOutlined></SettingOutlined>
                                    </Row>
                                    <Row justify="center">
                                        <Avatar
                                            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                                            style={{ background: '#ececec' }}
                                        >

                                        </Avatar>
                                    </Row>
                                    <Row justify="center">
                                        Card Content
                                    </Row>
                                </Space>
                            </Card>
                            <Card bodyStyle={{ padding: 10 }} style={{ width: 200, margin: 10, borderRadius: 20 }}>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Row justify="end">
                                        <PlusCircleFilled></PlusCircleFilled>
                                    </Row>
                                    <Row justify="center">
                                        <Avatar
                                            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                                            style={{ background: '#ececec' }}
                                        >

                                        </Avatar>
                                    </Row>
                                    <Row justify="center">
                                        Card Content
                                    </Row>
                                </Space>
                            </Card>
                            <Card bodyStyle={{ padding: 10 }} style={{ width: 200, margin: 10, borderRadius: 20 }}>
                                <Space direction='vertical' style={{ width: '100%' }}>
                                    <Row justify="end">
                                        <SettingOutlined></SettingOutlined>
                                    </Row>
                                    <Row justify="center">
                                        <Avatar
                                            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                                            style={{ background: '#ececec' }}
                                        >

                                        </Avatar>
                                    </Row>
                                    <Row justify="center">
                                        Card Content
                                    </Row>
                                </Space>
                            </Card>
                        </Row>
                    </TabPane>
                    <TabPane tab={<span>{DATASET.SHARED}</span>} key="4">
                        hhkhkh kh hkh h kh h k
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