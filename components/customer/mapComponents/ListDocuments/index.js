import React, { useCallback, useState } from 'react';
import moment from 'moment';
import { debounce } from 'lodash';
import { gapi } from 'gapi-script';
import { Col, Drawer, Row, Button, Input, Table, Tooltip, Spin, Card } from 'antd';
import styled from 'styled-components';
const { Search } = Input;
const DocumentList = styled.div`
  padding:2px 20px;
`

const ListDocuments = ({ documents = [], onSearch, signedInUser, onSignOut, onDataSeletected, setFileName }) => {
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'mimeType',
      key: 'mimeType',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Last Modified Date',
      dataIndex: 'modifiedTime',
      key: 'modifiedTime',
      render: (text) => <span>{moment(text).format('Do MMM YYYY HH:mm A')}</span>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <span>
          <Tooltip title="View Document">
            <Button type="primary" ghost onClick={(e) => getSelectedData(record)}>
              Select
            </Button>
          </Tooltip>
        </span>
      ),
    },
  ];
  const getSelectedData = (record) => {
    setLoading(true);
    gapi.client.drive.files.get({
      fileId: record.id,
      alt: 'media'
    }).then(function (response) {
      const res = response;
      if (res) {
        setLoading(false);
        onDataSeletected(res, record);
      }
    })

  }


  const search = (value) => {
    delayedQuery(`name contains '${value}'`);
  };
  documents.map(data => {
    data.key = data.id;
  })
  const delayedQuery = useCallback(
    debounce((q) => onSearch(q), 500),
    []
  );

  return (
    <Spin spinning={loading}>
      <DocumentList style={{ paddingBottom: '10px' }}>
        <div style={{ marginBottom: 20 }}>
          <p>Signed In as: {`${signedInUser?.Ad} (${signedInUser?.cu})`}</p>
          {/* <Button type="primary" onClick={onSignOut}>
                Sign Out
              </Button> */}
        </div>

        <div className="table-card-actions-container">
          <div className="table-search-container">
            <Search
              placeholder="Search Google Drive"
              onChange={(e) => search(e.target.value)}
              onSearch={(value) => search(value)}
              className="table-search-input"
              size="large"
              enterButton
            />
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={documents}
          pagination={{ pageSize: 20 }}
          scroll={{ y: 300 }}
        />
        
      </DocumentList>
    </Spin>
  );
};

export default ListDocuments;
