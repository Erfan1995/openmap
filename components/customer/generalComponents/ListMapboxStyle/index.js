import { List, Row, Card } from 'antd';
import { MAP_SOURCE } from 'lib/constants';
import styled from 'styled-components';
import SubTitle from '../SubTitle';
import { Scrollbars } from 'react-custom-scrollbars';

const StyleWrapper = styled.div`
border: 1px solid #eeeeee;
 border-radius: 5px;
width:74px;
 &:hover{
  border:2px solid #5bc0de;
  cursor:pointer
 }
`;
const Image = styled.img`
border-radius: 5px;
`;

const PopUpContainer = styled.div`
margin-left:7px;
`
const ListWrapper = styled(Row)`
  padding-left:35px;
  margin-top:10px;
`
const SourceCard = styled(Card)`
height: 75px; 
width: 100px; 
margin-left: 10px;
 border-radius:5px;
 border:1px solid #aaa;
 &:hover{
 border:1px solid #666;
 }
`
const StyledMaps = ({ changeStyle, mapData }) => {

    return (
        <Row>
            <Row>
                <SubTitle
                    title={'source'}
                    number={1}
                />
                <PopUpContainer>
                    {/* <Scrollbars style={{ width: 300, height: 100 }} className='track-horizontal'> */}
                    <ListWrapper>
                        <List
                            dataSource={MAP_SOURCE}
                            grid={{ gutter: 16, column: 2 }}
                            renderItem={item => (
                                <SourceCard

                                >
                                    {item.name}
                                </SourceCard>

                            )}
                        />
                    </ListWrapper>
                    {/* </Scrollbars> */}
                </PopUpContainer>
            </Row>
            <Row className="margin-top-10" style={{ border: '1px' }}>
                <SubTitle
                    title={'item'}
                    number={2}
                />
                <ListWrapper>
                    <List
                        itemLayout='vertical'
                        grid={{ gutter: 10, column: 3 }}
                        dataSource={mapData}
                        renderItem={(item) => (
                            <List.Item>
                                <StyleWrapper onClick={() => { changeStyle(item) }} >
                                    <Image src={`${process.env.NEXT_PUBLIC_MAPBOX_API_URL}/styles/v1/mbshaban/${item.id}/static/-87.0186,32.4055,10/70x60?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`} alt={item.name} />

                                </StyleWrapper>
                            </List.Item>
                        )}
                    />
                </ListWrapper>
            </Row>

        </Row>
    );

};

export default StyledMaps;
