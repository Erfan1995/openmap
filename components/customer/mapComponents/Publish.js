
import { CopyOutlined, GlobalOutlined, LinkOutlined } from '@ant-design/icons';
import { Table, Dropdown, Menu, Modal, Spin, Button, Row, Col, Typography, Input, message } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import copy from 'copy-to-clipboard';


const Boxs = styled.div`
  background-color: #fff;
  min-height: 200px;
  text-align: center;
  padding:40px 20px;

`;


const IconWrapper = styled.span`
padding:10px 12px;
border:1px solid #efefef;
`;

const MainWrapper = styled.div`
min-height: 330px;
width: 100 %;
background-color: #f9f9f9;
padding: 50px;
`;

const basePath = process.env.NEXT_PUBLIC_BASEPATH_URL;
const Publish = ({ mapData }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [link, setLink] = useState('');
    const [embed, setEmbed] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (mapData) {
            setLink(`${basePath}/?mapToken=${mapData.mapId}&id=${mapData.id}`)
            setEmbed(`<iframe width="100%" height="520" frameborder="0" src="${basePath}/embed?mapToken=${mapData.mapId}&id=${mapData.id}" allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen></iframe>`)
        }
        else {
            message.error('someting is wrong please try again');
            setModalVisible(false);
        }
    }, [])

    const onModalClose = () => {
        setModalVisible(false)
    }
    return (
        <>
            <Modal
                title={mapData?.title}
                centered
                width={1000}
                visible={modalVisible}
                destroyOnClose={true}

                onCancel={onModalClose}
                footer={[]}
                style={{ padding: 0 }}
            >



                <MainWrapper>
                    <Row>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} className='padding-10'>

                            <Boxs >
                                <IconWrapper>
                                    <LinkOutlined />
                                </IconWrapper>
                                <Typography.Title level={5} className='margin-top-20'>Get the Link</Typography.Title>
                                <p>Send to your friends, coworkers, or post it in your social networks.</p>

                                <Input size='large' value={link} addonAfter={<CopyOutlined onClick={() => {
                                    if (copy(link)) {
                                        message.success('coppied to Clipboard!')
                                    }
                                }} />} defaultValue="mysite" />
                            </Boxs>

                        </Col>

                        <Col xs={24} sm={24} md={12} lg={12} xl={12} className='padding-10'>
                            <Boxs >
                                <IconWrapper >
                                    <GlobalOutlined />
                                </IconWrapper>
                                <Typography.Title level={5} className='margin-top-20'>Embed it</Typography.Title>
                                <p>Insert your map into your blog, website, or simple application.</p>
                                <Input value={embed} size='large' addonAfter={<CopyOutlined onClick={() => {
                                    if (copy(embed)) {
                                        message.success('coppied to Clipboard!')
                                    }
                                }} />} defaultValue="mysite" />

                            </Boxs>
                        </Col>

                    </Row>

                </MainWrapper>

            </Modal>
            <Button type={'primary'} onClick={() => { setModalVisible(true) }} className='margin-top-10' size='large'>Publish</Button>


        </>

    )
}

export default Publish;