import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Table, Button, Space } from 'antd';
import styled from 'styled-components';
import { DATASET } from '../../../static/constant'
const TableWrapper = styled(Table)`
padding:10px 20px ;
`;
const SelectNewMapSurvey = ({ surveys, addSelectedSurvey }) => {
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
            title: DATASET.SELECT_SURVEY,
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => addSelectedSurvey(record)}>{DATASET.SELECT}</a>
                </Space>
            ),
        }
    ]
    return (
        <TableWrapper columns={columns} dataSource={surveys}
            scroll={{ x: 'max-content', y: 410 }} />
    )
}
export default SelectNewMapSurvey;