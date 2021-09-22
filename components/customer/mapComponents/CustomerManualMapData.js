import { Table, Dropdown, Menu, Modal, Spin, Button, message, Typography } from 'antd';
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteMethod, putMethod } from "../../../lib/api";
import styled from 'styled-components';
import { DATASET } from '../../../static/constant'
import Dataset from 'pages/customer/datasets';
const { confirm } = Modal;
const { Title } = Typography;
const MapsWrapper = styled.div`
background:#ffffff;
padding:20px;
margin:10px;
`;
const CardTitle = styled(Title)`
  margin-bottom: 10px;
  float: left !important;
`;

const CustomerManualMapData = ({ data, mapFilterData, formElementsName, token ,setMapsDataToFilter}) => {
    const [loading, setLoading] = useState(false);
    const [dataset, setDataset] = useState();
    let selectedRow;
    const menu = (
        <Menu >
            <Menu.Item key="0"><a onClick={() => showChangeStateConfirm(selectedRow)} >
                {DATASET.CHANGE_STATE}</a></Menu.Item>
            <Menu.Divider />
            <Menu.Item key="1"><a onClick={() => showConfirm(selectedRow)}>{DATASET.DELETE}</a></Menu.Item>
        </Menu>
    );
    let columns = [
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
            title: "maps",
            dataIndex: 'maps',
            key: 'maps',
            filters: mapFilterData,
            onFilter: (value, record) => record.maps.includes(value),
        },
        {
            title: DATASET.ACTIONS,
            key: 'action',
            render: (record) => (
                <Dropdown size="big" overlay={menu} trigger={['click']} >
                    <a className="ant-dropdown-link"
                        onClick={(e) => {
                            selectedRow = record;
                        }} >
                        {DATASET.MORE_ACTIONs} <DownOutlined />
                    </a>
                </Dropdown>
            ),
        }
    ];
    let mmData = formElementsName.concat(columns);

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
    const showConfirm = (record) => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <p>{DATASET.DELETE_CONFIRM}</p>,
            onOk() {
                deleteDataset(record)
            },
            onCancel() {
            },
        });
    }
    const showChangeStateConfirm = (record) => {
        console.log(data);
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
      

    function onChange(pagination,filter,sorter,extra){
        setMapsDataToFilter(extra);
    }

    return (
        <MapsWrapper>
            <CardTitle level={4}>{DATASET.MANUAL_MAP_DATA}</CardTitle>
            <Spin spinning={loading}>
                <Table dataSource={dataset} onChange={onChange} columns={mmData} scroll={{ x: 1300 }} />
            </Spin>
        </MapsWrapper>
    )
}
export default CustomerManualMapData;