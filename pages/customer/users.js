import Layout from '../../components/customer/layout/Layout';
import withPrivateServerSideProps from '../../utils/withPrivateServerSideProps';
import { useEffect, useState } from 'react';
import { Button, Divider, Typography, Tabs, Modal, Spin, message, notification, Menu, Dropdown, Space, Tooltip } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { formatDate, fileSizeReadable } from "../../lib/general-functions";
import nookies from 'nookies';
import PublicUsers from 'components/customer/mapComponents/PublicUsers';
import PrivateUsers from 'components/customer/mapComponents/PrivateUsers';
import { DATASET } from 'static/constant';
import { getMethod, getMapAnalytics, getPublicUsers, getUsersByMap } from 'lib/api';

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
const Users = ({ authenticatedUser, collapsed, users, token }) => {
    const [dropDownName, setDropDownName] = useState("All");
    const [publicUsers, setPublicUsers] = useState();
    const [loading, setLoading] = useState(false);
    const [selectedMapId, setSelectedMapId] = useState('0');
    useEffect(() => {
        setPublicUsers(users);
    }, [users])
    let allUsers = [];
    publicUsers?.map((data) => {
        if (data?.public_users?.length > 0) {
            data?.public_users?.map((user) => {
                allUsers.push(user);
            })
        }
    })
    const unifiedUsers = Array.from(new Set(allUsers.map(s => s.id))).map(id => {
        return {
            id: allUsers.find(s => s.id === id).publicAddress,
            name: allUsers.find(s => s.id === id).name,
            maps: allUsers.find(s => s.id === id).maps?.length,
            trust_score: allUsers.find(s => s.id === id).trust_score,
            attributes: allUsers.find(s => s.id).map_attributes,
            updated_at: allUsers.find(s => s.id).updated_at,
            key: id,

        }
    });
    unifiedUsers.map((data) => {
        if (selectedMapId === '0') {
            let attLength = 0;
            data.attributes.map((att) => {
                attLength += att.attribute.length;
            })
            data.attributes = attLength;
        } else {
            data.attributes = publicUsers[0]?.auth_attributes?.length;
        }
        let Difference_In_Time = (new Date()).getTime() - (new Date(data.updated_at)).getTime()
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        if (Difference_In_Days < 1) {
            data.updated_at = 'Today'
        } else {
            data.updated_at = Difference_In_Days.toFixed(0) + ' Days Ago'
        }

    })

    function handleMenuClick(e) {
        setDropDownName(e.item.props.children[1]);
        getSpecificMapUsers(e.item.props.eventKey);
    }
    const getSpecificMapUsers = async (id) => {
        setSelectedMapId(id);
        try {
            let users = [];
            setLoading(true);
            if (id !== '0') {
                users = await getUsersByMap({ user: authenticatedUser.id, id: id }, token);
                if (users) {
                    setLoading(false);
                }
            } else if (id === '0') {
                users = await getUsersByMap({ user: authenticatedUser.id }, token);
                if (users) {
                    setLoading(false);
                }
            }
            setPublicUsers(users);

        } catch (e) {
            setLoading(false);
        }
    }
    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key='0' >
                All
            </Menu.Item>
            {users?.map((value) => (
                <Menu.Item key={value.id} >
                    {value.title}
                </Menu.Item>
            ))
            }
        </Menu>
    );
    return (
        <Layout collapsed={collapsed} user={authenticatedUser}>
            <Spin spinning={loading}>
                <MapsWrapper  >
                    <CardTitle level={4}>{DATASET.USERS}</CardTitle>
                    <DropWapper overlay={menu}>
                        <Button>
                            {dropDownName} <DownOutlined />
                        </Button>
                    </DropWapper>
                    {/* <AddNew type='primary' onClick={() => setVisible(true)}>{DATASET.ADD_USER}</AddNew> */}
                    <Divider />
                    {/* <Tabs defaultActiveKey="1">
                        <TabPane tab={<span>{DATASET.PUBLIC_USERS}</span>} key="1"> */}
                    <PublicUsers
                        user={authenticatedUser} publicUsers={unifiedUsers} mapId={selectedMapId} token={token} />

                    {/* </TabPane>
                        <TabPane tab={<span>{DATASET.PRIVATE_USERS}</span>} key="2">
                            <PrivateUsers />
                        </TabPane>
                    </Tabs> */}
                </MapsWrapper>
            </Spin>
        </Layout>
    )
}
export const getServerSideProps = withPrivateServerSideProps(
    async (ctx, verifyUser) => {
        try {

            const { token } = nookies.get(ctx);
            let mapData = await getMapAnalytics({ user: verifyUser.id }, token);
            let users = await getUsersByMap({ user: verifyUser.id }, token);
            const publicUsers = await getPublicUsers(null, token);
            return { props: { authenticatedUser: verifyUser, publicUsers: publicUsers, maps: mapData, users: users, token: token } }
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