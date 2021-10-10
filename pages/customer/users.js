import Layout from '../../components/customer/layout/Layout';
import withPrivateServerSideProps from '../../utils/withPrivateServerSideProps';
import { useEffect, useState } from 'react';
import { Button, Divider, Typography, Tabs, Modal, Spin, message, notification, Menu, Dropdown, Space, Tooltip } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { postMethod, getDatasets, getTags, deleteMethod } from "../../lib/api";
import { formatDate, fileSizeReadable } from "../../lib/general-functions";
import nookies from 'nookies';
import PublicUsers from 'components/customer/mapComponents/PublicUsers';
import PrivateUsers from 'components/customer/mapComponents/PrivateUsers';
import { DATASET } from 'static/constant';
import { getMethod, getMapAnalytics, getPublicUsers } from 'lib/api';

const { Title } = Typography;
const { TabPane } = Tabs;
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
const DropWapper = styled(Dropdown)`
margin-left:30px;
`
const Users = ({ authenticatedUser, collapsed }) => {
    const [dropDownName, setDropDownName] = useState("All");

    function handleMenuClick(e) {
        setDropDownName(e.item.props.children[1]);
    }

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="1" >
                All
            </Menu.Item>
            <Menu.Item key="2" >
                First Map
            </Menu.Item>
            <Menu.Item key="3" >
                Second Map
            </Menu.Item>
        </Menu>
    );


    return (
        <Layout collapsed={collapsed} user={authenticatedUser}>
            <MapsWrapper  >
                <CardTitle level={4}>{DATASET.USERS}</CardTitle>
                <DropWapper overlay={menu}>
                    <Button>
                        {dropDownName} <DownOutlined />
                    </Button>
                </DropWapper>
                <AddNew type='primary' onClick={() => setVisible(true)}>{DATASET.ADD_USER}</AddNew>
                <Divider />
                <Tabs defaultActiveKey="1">
                    <TabPane tab={<span>{DATASET.PUBLIC_USERS}</span>} key="1">
                        <PublicUsers
                            user={authenticatedUser} />
                        {/* <Modal
                        centered
                        width='100%'
                        visible={visible}
                        destroyOnClose={true}
                        footer={[]}
                        onCancel={() => setVisible(false)}>
                        <Spin spinning={loading}>
                            <FileUpload user={authenticatedUser} onModalClose={onModalClose} />
                        </Spin>
                    </Modal> */}
                    </TabPane>
                    <TabPane tab={<span>{DATASET.PRIVATE_USERS}</span>} key="2">
                        <PrivateUsers />
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
            let mapData = await getMapAnalytics({ user: verifyUser.id }, token);
            const publicUsers = await getPublicUsers(null, token);
            return { props: { authenticatedUser: verifyUser, publicUsers: publicUsers, maps: mapData } }
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
export default Users;