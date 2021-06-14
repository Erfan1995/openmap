import { Card, Skeleton, Tag, Typography,List } from 'antd';
import {  CalendarOutlined, LockOutlined, TagsOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import React from 'react';
// import Image from '../../general-components/Image';
const { Paragraph, Title } = Typography;
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



const MapStyleItem = ({ item, loading }) => {
  
    return (
        <>
            <Card
                cover={
                    !loading ? (
                        // <img src='/street.png' style={{ height: '140px' }} />
                        <img src="https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-87.0186,32.4055,14/500x300?access_token=pk.eyJ1IjoibWJzaGFiYW4iLCJhIjoiY2tubXBlOHN4MDZzMzJubGFlNXYzemphbSJ9.03KzYzfwzZnWULV-WphldQ" alt="Map of the Edmund Pettus Bridge in Selma, Alabama, with a black 'L' marker positioned in the middle of the bridge."></img>
                    ) : (
                        <StyledSkeleton loading={loading} avatar active />
                    )
                }
                size="small">
                {!loading && (
                    <div>
                        <Title level={5}>{item.name}</Title>

                        <StyledParagraph ellipsis={{ rows: 2, expandable: false }}>
                            {'No description '}
                        </StyledParagraph>
                        <ActionButtonWrapper>
                           <div><LockOutlined/>  Private</div>
                           <div><CalendarOutlined/>  updated 3 months ago</div>
                           <div><TagsOutlined/>  No tags</div>
                        </ActionButtonWrapper>
                    </div>
                )}
            </Card>
        </>
    );
};

export default MapStyleItem;
