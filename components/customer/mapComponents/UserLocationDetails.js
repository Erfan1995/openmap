import { Table, Tag, Space, Dropdown, Menu, message, Modal, Spin, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteMethod, putMethod, getPublicUsers, getIpLocation } from "../../../lib/api";
import 'antd/dist/antd.css';
import { DATASET } from '../../../static/constant'
const { confirm } = Modal;
const UserLocationDetails = ({ id }) => {
    const [loading, setLoading] = useState(false);
    const [userIp, setUserIp] = useState(null);
    const [userId, setUserId] = useState(0);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchPublicUser() {
            setLoading(true);
            let response = await getPublicUsers({ id: id });
                setUsers(response);
            setLoading(false);
        }
        fetchPublicUser();

    }, []);




    const onGetUserLocation = async () => {
        setLoading(true);
        if (userIp !== null) {
            const response = await getIpLocation(userIp);
            const data = await putMethod(`public-users/${userId}`, { location_data: response });
            if (data) {
                message.success(DATASET.GET_LOCATION_DATA_SUCCESSFUL);
            }
            setLoading(false);
        }
        else {
            setLoading(false);
            message.error(DATASET.ERROR_IP);
        }
    }

    const menu = (
        <Menu >
            <Menu.Item key="0"><a onClick={() => setVisible(true)}>{DATASET.Unlock}</a></Menu.Item>
            <Menu.Divider />
            <Menu.Item key="1"><a onClick={() => onGetUserLocation()}>get user location</a></Menu.Item>
        </Menu>
    );

    const columns = [
        {
            title: DATASET.ID,
            dataIndex: 'id',
            key: '1'
        },
        {
            title: DATASET.NAME,
            dataIndex: 'name',
            key: '2'
        },
        {
            title: DATASET.LAST_NAME,
            dataIndex: 'lastname',
            key: '3'

        },
        {
            title: DATASET.IP,
            dataIndex: "ip",
            key: '5'
        },
        {
            title: DATASET.ACTIONS,
            key: '6',
            render: (record) => (
                // <a onClick={() => onGetUserLocation(record.id, record.ip)}>get location data</a>
                <Dropdown size="big" overlay={menu} trigger={['click']} >
                    <a className="ant-dropdown-link"
                        onClick={(e) => {
                            setUserId(record.id);
                            setUserIp(record.ip);
                        }} >
                        {DATASET.MORE_ACTIONs} <DownOutlined />
                    </a>
                </Dropdown>
            ),
        },
    ];
    return (<>
        <Spin spinning={loading}>
            <div>
                {users}
            </div>
        </Spin>

    </>)
}

export default UserLocationDetails