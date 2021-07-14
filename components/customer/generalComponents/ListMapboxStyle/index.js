import { List, Row, Card, Button, Form, Input, Col, message, Spin, Modal } from 'antd';
import { MAP_SOURCE } from 'lib/constants';
import styled from 'styled-components';
import SubTitle from '../SubTitle';
import { useState, useRef } from 'react';
import { getMethod, postMethod, getMapStyles } from '../../../../lib/api';
import nookies from "nookies";
import { DATASET } from '../../../../static/constant'
import MapStyleDialog from './MapStyleDialog';
const StyleWrapper = styled.div`
border: 1px solid #eeeeee;
 border-radius: 5px;
 &:hover{
  border:1px solid #5bc0de;
  cursor:pointer
 }
`;

const Image = styled.img`
border-radius: 5px;
margin-right:10px;
`;

const PopUpContainer = styled.div`
margin-left:7px;
`
const ListWrapper = styled(Row)`
  padding-left:35px;
  margin-top:10px;
`
const SourceCard = styled.div`
height: 60px; 
width: 100px; 
margin-left:10px;
justify-content:center;
display:flex;
align-items: center;
background-color:rgb(250,250,250);
 border-radius:5px;
 border:1px solid #aaa;
 &:hover{
 border:1px solid #666;
 cursor:pointer;
 }
`
const StyledMaps = ({ changeStyle, mapData }) => {
    const childRef = useRef();
    const { token } = nookies.get();
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState(mapData);
    const [formVisible, setFormVisible] = useState(false);
    const [mapSource, setMapSource] = useState(MAP_SOURCE);
    const [modalVisible, setModalVisible] = useState(false);
    const changeMapStyleSource = async (name) => {

        setMapSource(MAP_SOURCE.map((item) => {
            if (item.name === name) {
                return { ...item, isSelected: true };
            } else {
                return { ...item, isSelected: false };
            }
        }))

        if (name === "Base") {
            setLoading(true);
            const res = await getMapStyles({ type: 'default' }, token);
            if (res) {
                setFormVisible(false);
                setDataSource(res);
                console.log(res);
            }
            setLoading(false);
        } else if (name === "MapBox") {
            setLoading(true);
            const res = await getMapStyles({ type: 'custom' }, token);
            if (res) {
                setFormVisible(true);
                setDataSource(res);
                setLoading(false);
                setModalVisible(true)
            }

        }
    }

    const onModalClose = (res) => {
        setModalVisible(false);
        setDataSource([...dataSource, res]);
    }

    return (
        <Spin spinning={loading}>
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
                                dataSource={mapSource}
                                grid={{ gutter: 16, column: 2 }}
                                renderItem={item => (
                                    <SourceCard
                                        className={item.isSelected ? 'selectedBox' : ''}
                                        onClick={() => changeMapStyleSource(item.name)}
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
                    <Modal
                        width={800}
                        visible={modalVisible}
                        centered
                        title={DATASET.ADD_NEW_MAP_STYLE}
                        onOk={() => childRef.current.addNewStyle()}
                        destroyOnClose={true}
                        onCancel={() => setModalVisible(false)}
                    >
                        <MapStyleDialog ref={childRef} onModalClose={onModalClose} />
                    </Modal>
                    <ListWrapper>
                        <List
                            itemLayout='vertical'
                            grid={{ gutter: 10, column: 1 }}
                            dataSource={dataSource}
                            renderItem={(item) => (
                                < List.Item >
                                    <StyleWrapper onClick={() => { changeStyle(item) }} >
                                        {formVisible ?
                                            <span>
                                                <Image src={item.link} />
                                                {/* {item.name} */}
                                            </span>
                                            :
                                            <span>
                                                <Image src={item.link} />
                                                {/* {item.name} */}
                                            </span>

                                        }

                                    </StyleWrapper>
                                </List.Item>
                            )}
                        />
                    </ListWrapper>
                </Row>

            </Row>
        </Spin>
    );

};

export default StyledMaps;
