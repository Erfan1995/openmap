import { Table, Dropdown, Menu, Modal, Spin, Select, message } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteMethod, putMethod } from "../../../lib/api";
import 'antd/dist/antd.css';
import { DATASET } from '../../../static/constant'
const { confirm } = Modal;

const PublicUserManualMapData = ({ data, mapFilterData }) => {
    const [loading, setLoading] = useState(false);
    const [dataset, setDataset] = useState([]);
    const [row, setRow] = useState({ is_approved: "no" });
    useEffect(() => {
        setDataset(data);
    }, [data])

    const deleteDataset = async () => {
        setLoading(true)
        try {
            const res = await deleteMethod('mmdpublicusers/' + row.id)
            if (res) setDataset(dataset.filter(dData => dData.id !== res.id));
        } catch (e) {
            message.error(e);
        }
        setLoading(false)
    }
    const updateState = async () => {
        let state;
        let stateText;
        if (row.is_approved === "no") {
            stateText = "yes";
            state = true;
        } else {
            stateText = "no";
            state = false;
        }
        setLoading(true);
        try {
            const res = await putMethod('mmdpublicusers/' + row.id, { is_approved: state });
            if (res) {
                setDataset(dataset.map(item => {
                    if (item.id === res.id) {
                        return { ...item, is_approved: stateText }
                    } else {
                        return item;
                    }
                }))

            }
        } catch (e) {
            message.error(e);
        }
        setLoading(false);

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
    function showChangeStateConfirm() {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <p>{DATASET.CHANGE_CONFIRM}</p>,
            onOk() {
                updateState()

            },
            onCancel() {
            },
        });
    }
    const menu = (
        <Menu >
            <Menu.Item key="0"><a onClick={() => showChangeStateConfirm()} >{DATASET.CHANGE_STATE}</a></Menu.Item>
            <Menu.Divider />
            <Menu.Item key="1"><a onClick={() => showConfirm()}>{DATASET.DELETE}</a></Menu.Item>
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
            title: DATASET.MAPS,
            dataIndex: 'maps',
            key: 'maps',
            filters: mapFilterData,
            onFilter: (value, record) => record.maps.includes(value),
        },
        {
            title: DATASET.APPROVED,
            dataIndex: 'is_approved',
            key: 'is_approved',
            filters: [
                { text: 'Approved', value: 'yes' },
                { text: 'Unapproved', value: 'no' },
            ],
            onFilter: (value, record) => record.is_approved.includes(value),
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
        <Spin spinning={loading}>
            <Table dataSource={dataset} columns={columns} />
        </Spin>
    )
}
export default PublicUserManualMapData;