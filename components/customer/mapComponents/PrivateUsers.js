import { Table, Dropdown, Menu, Modal, Spin, Button, message } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteMethod, putMethod, getMaps, postMethod } from "../../../lib/api";
import 'antd/dist/antd.css';
import styled from 'styled-components';
import { DATASET } from '../../../static/constant'
const { confirm } = Modal;
const CreateMapWrapper = styled.div`
background:#ffffff;
padding:20px;
margin:10px;
`;
const PrivateUsers = () => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    const menu = (
        <Menu >
            <Menu.Item key="0"><a >{DATASET.VERIFY_ATTRIBUTES}</a></Menu.Item>
            <Menu.Divider />
            <Menu.Item key="1"><a onClick>{DATASET.CREATE_MAP}</a></Menu.Item>

        </Menu>
    );
    const columns = [
        {
            title: DATASET.ID,
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: DATASET.NAME,
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: DATASET.TRUST_SCORE,
            dataIndex: 'trust_score',
            key: 'trust_score'
        },
        {
            title: DATASET.DATE,
            dataIndex: 'updated_at',
            key: 'updated_at'
        },
        {
            title: DATASET.ATTRIBUTES,
            dataIndex: 'attributes',
            key: 'attributes'

        },
        {
            title: DATASET.MAPS,
            dataIndex: "maps",
            key: 'maps'
        },
        {
            title: DATASET.VISITS,
            dataIndex: "visits",
            key: 'visits'
        },
        {
            title: DATASET.ACTIONS,
            key: 'action',
            render: (record) => (
                <Dropdown size="big" overlay={menu} trigger={['click']} >
                    <a className="ant-dropdown-link"
                        onClick={(e) => {
                            setDatasetId(record.id)
                        }} >
                        {DATASET.MORE_ACTIONs} <DownOutlined />
                    </a>
                </Dropdown>
            ),
        },
    ];

    return (
        <div>
            <Spin spinning={loading}>
                <Table dataSource={users} columns={columns} />
            </Spin>
        </div>
    )
}
export default PrivateUsers;