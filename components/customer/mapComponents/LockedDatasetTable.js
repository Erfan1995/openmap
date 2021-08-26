import { Table, Tag, Space, Dropdown, Menu, message, Modal, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteMethod, putMethod } from "../../../lib/api";
import 'antd/dist/antd.css';
import { DATASET } from '../../../static/constant'
const { confirm } = Modal;
const LockedDatasetTable = ({ data, updateUnlockedData, updatedLockedData }) => {
    const [datasetId, setDatasetId] = useState();
    const [dataset, setDataset] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setDataset(data);
    }, [data])
    const deleteDataset = async () => {
        setLoading(true)
        const deletedDataset = await deleteMethod('datasetcontents/' + datasetId)
        if (deletedDataset) {
            const res = await deleteMethod('datasets/' + datasetId)
            if (res) {
                const dd = dataset.filter(dData => dData.id !== res.id);
                setDataset(dd);
                updatedLockedData(dd);
            }
            setLoading(false)
        }
    }

    const lockDataset = async () => {
        setLoading(true)
        const res = await putMethod('datasets/' + datasetId, { is_locked: false });
        if (res) {
            let dd = dataset.filter(dData => dData.id !== res.id)
            setDataset(dd)
            updateUnlockedData(dataset.filter(dData => dData.id === res.id), dd)
            setLoading(false)
        }
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
    function showLockConfirm() {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <p>{DATASET.UNLOCK_CONFIRM}</p>,
            onOk() {
                lockDataset()
            },
            onCancel() {
            },
        });
    }
    const menu = (
        <Menu >
            <Menu.Item key="0"><a onClick={() => showLockConfirm()}>{DATASET.Unlock}</a></Menu.Item>
            <Menu.Divider />
            <Menu.Item key="1"><a onClick={() => showConfirm()}>{DATASET.DELETE}</a></Menu.Item>
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
            dataIndex: 'title',
            key: '2'
        },
        {
            title: DATASET.DATE,
            dataIndex: 'updated_at',
            key: '3'

        },
        {
            title: DATASET.MAPS,
            dataIndex: "maps",
            key: '5'
        },
        {
            title: DATASET.ACTIONS,
            key: '6',
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
    return (<>
        <Spin spinning={loading}>
            <Table dataSource={dataset} columns={columns} />
        </Spin>
    </>)
}

export default LockedDatasetTable