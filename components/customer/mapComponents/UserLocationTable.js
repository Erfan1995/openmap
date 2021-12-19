import { Table, Tag, Space, Dropdown, Menu, message, Modal, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteMethod, putMethod, getPublicUsers, getIpLocation } from "../../../lib/api";
import UserLocationDetails from './UserLocationDetails';
import 'antd/dist/antd.css';
import { DATASET } from '../../../static/constant'
const { confirm } = Modal;
const UserLocationTable = () => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [userIp, setUserIp] = useState(null);
    const [userId, setUserId] = useState(0);
    const [visible,setVisible]=useState(false);

    useEffect(() => {
        async function fetchPublicUser() {
            setLoading(true);
            let response = await getPublicUsers(null);
            if (response) {
                setUsers(response);
            }
            setLoading(false);
        }
        fetchPublicUser();
    }, []);


    function showConfirm() {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <p>{DATASET.DELETE_CONFIRM}</p>,
            onOk() {
                deleteDataset()
            },
            onCancel() {
            },
        });
    }


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
            <Menu.Item key="0"><a onClick={() => setVisible(true)}>Location Details</a></Menu.Item>
            <Menu.Divider />
            <Menu.Item key="1"><a onClick={() => onGetUserLocation()}>Get User Location</a></Menu.Item>
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
            <Table dataSource={users} columns={columns} />
            <Modal
                centered
                width='700px'
                visible={visible}
                destroyOnClose={true}
                footer={[]}
                onCancel={() => setVisible(false)}>
                <UserLocationDetails id={userId}></UserLocationDetails>
            </Modal>
        </Spin>

    </>)
}

export default UserLocationTable