import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Table, Button, Space } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import styled from 'styled-components';
import { DATASET } from '../../../static/constant'
const TableWrapper = styled(Table)`
padding:10px 20px ;
`;

const SelectNewMapDataset = ({ datasets, addSelectedDataset }, ref) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
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
            title: DATASET.DATE,
            dataIndex: 'updated_at',
            key: 'updated_at'

        },
        {
            title: DATASET.SIZE,
            dataIndex: 'size',
            key: 'size'

        },
        {
            title: DATASET.SELECT_DATASET,
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => addSelectedDataset(record)}>{DATASET.SELECT}</a>
                </Space>
            ),
        },
    ]

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRows);
        },
        getCheckboxProps: (record) => {

        },

    };
    useImperativeHandle(ref, () => ({
        selectedRowKeys
    }))
    const hasSelected = selectedRowKeys.length > 0;
    return (
        <TableWrapper columns={columns} dataSource={datasets}
            scroll={{ x: 'max-content', y: 410 }} />
    );
}

export default forwardRef(SelectNewMapDataset);