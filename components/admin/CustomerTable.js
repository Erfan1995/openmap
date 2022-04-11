import { Table, Dropdown, Menu, Modal, Spin, Button } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { deleteMethod } from "../../lib/api";
import { DATASET, CUSTOMERS } from '../../static/constant';
const { confirm } = Modal;

const CustomerTable = ({ customers, updatedData }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [customerId, setCustomerId] = useState();
    useEffect(() => {
        setData(customers);
    }, [customers])
    const deleteDataset = async () => {
        setLoading(true)
        const res = await deleteMethod('users/' + customerId)
        if (res) {
            const dd = data.filter(dData => dData.id !== res.id)
            setData(dd);
            updatedData(dd);
        }

        setLoading(false)
    }
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
    const menu = (
        <Menu >
            <Menu.Item key="3"><a onClick={() => showConfirm()}>{DATASET.DELETE}</a></Menu.Item>
        </Menu>
    );
    const columns = [
        {
            title: DATASET.ID,
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: CUSTOMERS.NAME,
            dataIndex: 'username',
            key: 'username'
        },
        {
            title: CUSTOMERS.EMAIL,
            dataIndex: 'email',
            key: 'email'

        },
        {
            title: DATASET.DATE,
            dataIndex: "updated_at",
            key: 'updated_at'
        },
        {
            title: DATASET.ACTIONS,
            key: 'action',
            render: (record) => (
                <Dropdown size="big" overlay={menu} trigger={['click']} >
                    <a className="ant-dropdown-link"
                        onClick={(e) => {
                            setCustomerId(record.id)
                        }} >
                        {DATASET.MORE_ACTIONs} <DownOutlined />
                    </a>
                </Dropdown>
            ),
        },
    ];

    return (
        <Spin spinning={loading}>
            <Table dataSource={data} columns={columns} />
        </Spin>
    )
}

export default CustomerTable