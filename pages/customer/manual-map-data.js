import Layout from '../../components/customer/layout/Layout';
import { Divider, Typography, Tabs, Spin, Menu, Modal, Button, Table, Dropdown } from 'antd';
import withPrivateServerSideProps from '../../utils/withPrivateServerSideProps';
const { Title } = Typography;
const { TabPane } = Tabs;
import { getSurveyForms } from "../../lib/api";
import nookies from 'nookies';
import styled from 'styled-components';
import { formatDate } from "../../lib/general-functions";
import { DATASET } from '../../static/constant'
import CustomerManualMapData from 'components/customer/mapComponents/CustomerManualMapData';
import PublicUserManualMapData from 'components/customer/mapComponents/PublicUserManualMapData';
import { useEffect, useState } from 'react';
import ManualMapDataDialog from 'components/customer/mapComponents/ManualMapDataDialog';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const MapsWrapper = styled.div`
background:#ffffff;
padding:20px;
margin:10px;
`;
const CardTitle = styled(Title)`
  margin-bottom: 10px;
  float: left !important;
`;

const ManualMapData = ({ authenticatedUser, collapsed, token, surveyForms }) => {
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [dataset, setDataset] = useState([]);
    const [row, setRow] = useState();
    const [formElementsName, setFormElementsName] = useState([]);
    surveyForms.map(data => {
        data.title = (JSON.parse(data.forms)).title;
        data.description = (JSON.parse(data.forms)).description;
        data.id = Number(data.id);

    })
    const showManualMapDataDetails = () => {
        let arr = [];
        let surveyFormElements = JSON.parse(row.forms);
        surveyFormElements.pages.map((data) => {
            data.elements.map((element) => {
                arr.push({ 'title': element.name, 'dataIndex': element.name, 'key': element.name })
            })
        })
        setFormElementsName(arr);
        setModalVisible(true);
    }
    const menu = (
        <Menu >
            <Menu.Item key="0"><a onClick={() => showManualMapDataDetails()}>{DATASET.DETAILS}</a></Menu.Item>
        </Menu>
    );
    const columns = [
        {
            title: DATASET.ID,
            dataIndex: 'id',
            key: 'id',

        },
        {
            title: DATASET.NAME,
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: DATASET.DESCRIPTION,
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: DATASET.MAPS,
            dataIndex: 'maps',
            key: 'maps',
        },
        {
            title: DATASET.DATE,
            dataIndex: 'updated_at',
            key: 'updated_at'

        },
        {
            title: DATASET.ACTIONS,
            key: 'action',
            render: (record) => (
                <Dropdown size="big" overlay={menu} trigger={['click']} >
                    <a className="ant-dropdown-link"
                        onClick={(e) => {
                            setRow(record);
                        }} >
                        {DATASET.MORE_ACTIONs} <DownOutlined />
                    </a>
                </Dropdown>
            ),
        },
    ];

    return (
        <Layout collapsed={collapsed} user={authenticatedUser}>
            <MapsWrapper  >
                <Spin spinning={loading}>
                    <Table dataSource={surveyForms} columns={columns} scroll={{ x: 1300 }} />
                </Spin>
                <Modal
                    centered
                    width={1500}
                    visible={modalVisible}
                    destroyOnClose={true}
                    footer={[
                        <Button key="close" onClick={() => { setModalVisible(false) }}> {DATASET.CLOSE}</Button>
                    ]}
                    destroyOnClose={true}
                >
                    <ManualMapDataDialog authenticatedUser={authenticatedUser} token={token} row={row}
                        formElementsName={formElementsName} />
                </Modal>
            </MapsWrapper>
        </Layout>
    )
}
export const getServerSideProps = withPrivateServerSideProps(
    async (ctx, verifyUser) => {
        try {
            const { token } = nookies.get(ctx);
            const surveyForms = await getSurveyForms({ user: verifyUser.id }, token);
            if (surveyForms) {
                surveyForms.map(data => {
                    data.id = Number(data.id);
                    data.key = data.id;
                })
            }
            return { props: { authenticatedUser: verifyUser, token: token, surveyForms: surveyForms } }
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
export default ManualMapData;