import { Card, Skeleton, Tag, Typography, Menu, Dropdown, Modal, Spin } from 'antd';
import { CalendarOutlined, LockOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { deleteMethod, putMethod } from "../../../lib/api";
import { DATASET } from '../../../static/constant'
const { Paragraph, Title } = Typography;
const { confirm } = Modal;
const ActionLink = styled.a`
  text-decoration: none;
  color: #8c8c8c;
`;
const StyledTag = styled(Tag)`
  float: left;
`;
const StyledSkeleton = styled(Skeleton)`
  padding: 10px;
`;
const StyledParagraph = styled(Paragraph)`
  clear: both;
`;


const ActionButtonWrapper = styled.div`
  float: left !important;
  margin-top: 5px;
`;
const Price = styled.span`
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0em;
  text-align: left;
`;

const ActionButton = ({ handleMenuClick }) => {

    return (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="edit" >
                {DATASET.EDIT}
            </Menu.Item>
            <Menu.Item key="delete">
                {DATASET.DELETE}
            </Menu.Item>
            <Menu.Item key="link">
                {DATASET.CREATE_LINK}
            </Menu.Item>
        </Menu>
    );
};

const MapItem = ({ item, filterDeletedMap }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const deleteDataset = async (id) => {
        setLoading(true);
        const res = await deleteMethod('maps/' + id)
        if (res) {
            filterDeletedMap(id);
        }
        setLoading(false);
    }
    function showConfirm(id) {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <p>{DATASET.DELETE_CONFIRM}</p>,
            onOk() {
                deleteDataset(id)
            },
            onCancel() {
            },
        });
    }

    function showGeneratedLink(item) {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <p>{'ok to redirect to public map'}</p>,
            onOk() {
                router.push({
                    pathname: '/',
                    query: { mapToken: item.mapId, id: item.id }
                });
            },

            onCancel() {
            },
        });
    }



    const handleMenuClick = (e) => {
        if (e.key === "edit") {
            localStorage.clear('zoom');
            router.push({
                pathname: 'create-map',
                query: { id: item.id }
            });
        } else if (e.key === "delete") {
            showConfirm(item.id)
        } else {
            showGeneratedLink(item);
        }

    };
    return (
        <>
            <Spin spinning={loading}>
                <Card
                    key={`map${item.id}`}
                    cover={
                        <img src={`${process.env.NEXT_PUBLIC_MAPBOX_API_URL}/styles/v1/mbshaban/${item.styleId}/static/-77.0368707,38.9071923,10/280x250?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`} alt={item.name} />
                    }
                    title={<Title level={5}>{item.title}</Title>}
                    extra={<Dropdown overlay={<ActionButton handleMenuClick={handleMenuClick} />}>
                        <DownOutlined />
                    </Dropdown>}
                    size="small">
                    <div>
                        <StyledParagraph ellipsis={{ rows: 2, expandable: false }}>
                            {item.description}
                        </StyledParagraph>
                        <ActionButtonWrapper>
                            <div><LockOutlined />  {item.type}</div>
                            <div><CalendarOutlined />  {new Date(item.updated_at).toLocaleDateString()}</div>
                            <div >
                                {
                                    item.tags.map((tag) => (
                                        <Tag color='cyan' key={`tag${tag.id}`} className='margin-top-5'>
                                            {tag.name}
                                        </Tag>
                                    ))
                                }
                            </div>

                        </ActionButtonWrapper>
                    </div>
                </Card>
            </Spin>

        </>
    );
};

export default MapItem;
