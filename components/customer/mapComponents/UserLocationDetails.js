import { Table, Tag, Space, Dropdown, Menu, message, Modal, Spin, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteMethod, putMethod, getPublicUsers, getIpLocation } from "../../../lib/api";
import 'antd/dist/antd.css';
const UserLocationDetails = ({ id }) => {
    const [loading, setLoading] = useState(false);
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




    return (<>
        <Spin spinning={loading}>
            <div>
                {users}
            </div>
        </Spin>

    </>)
}

export default UserLocationDetails