import { Table, Dropdown, Menu, Modal, Spin, Select, message } from 'antd';
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteMethod, putMethod } from "../../../lib/api";
import 'antd/dist/antd.css';
import { DATASET } from '../../../static/constant'
const { confirm } = Modal;
const CustomerManualMapData = ({ data, mapFilterData, formElementsName }, ref) => {
    const [loading, setLoading] = useState(false);
    const [dataset, setDataset] = useState(data);
    const [row, setRow] = useState({ is_approved: "no" });
    useEffect(() => {
        setDataset(data);
    }, [data])
    const deleteDataset = async (record) => {
        setLoading(true)
        try {
            const res = await deleteMethod('mmdcustomers/' + record.id)
            if (res) setDataset(dataset.filter(dData => dData.id !== res.id));
        } catch (e) {
            message.error(e);
        }
        setLoading(false)
    }
    const updateState = async (record) => {
        let state;
        let stateText;
        if (record.is_approved === "no") {
            stateText = "yes";
            state = true;
        } else {
            stateText = "no";
            state = false;
        }
        setLoading(true);
        try {
            const res = await putMethod('mmdcustomers/' + record.id, { is_approved: state });
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
    useImperativeHandle(ref, () => ({
        showConfirm(record) {
            confirm({
                icon: <ExclamationCircleOutlined />,
                content: <p>{DATASET.DELETE_CONFIRM}</p>,
                onOk() {
                    deleteDataset(record)
                },
                onCancel() {
                },
            });
        },
        showChangeStateConfirm(record) {
            confirm({
                icon: <ExclamationCircleOutlined />,
                content: <p>{DATASET.CHANGE_CONFIRM}</p>,
                onOk() {
                    updateState(record)
                },
                onCancel() {
                },
            });
        }

    }), [])

    return (
        <>
            <Spin spinning={loading}>
                <Table dataSource={dataset} columns={formElementsName} scroll={{ x: 1300 }} />
            </Spin>
        </>
    )


}
export default forwardRef(CustomerManualMapData);