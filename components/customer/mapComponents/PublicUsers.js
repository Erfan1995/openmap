import { Table, Dropdown, Menu, Modal, Spin, Button, message, Input, Form, Row, Col, Divider } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { DownOutlined, CheckCircleFilled } from '@ant-design/icons';
import { putMethod, getMapAttributes } from "../../../lib/api";
import 'antd/dist/antd.css';
import styled from 'styled-components';
import { DATASET } from '../../../static/constant'
const { confirm } = Modal;
const CreateMapWrapper = styled.div`
background:#ffffff;
padding:20px;
margin:10px;
`;
const FormWrapper = styled.div`
  padding:20px;
`
const PublicUsers = ({ user, publicUsers, mapId, token }) => {
    const [loading, setLoading] = useState(false);
    const [recordMeta, setRecordMeta] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [pubUsers, setPubUsers] = useState();
    const [form] = Form.useForm();
    const [attributeClicked, setAttributeClicked] = useState(false);
    const [trustScoreClicked, setTrustScoreClicked] = useState(false);
    const [attributesList, setAttributesList] = useState([]);
    const [states, setStates] = useState([]);
    const [attributeRecordId, setAttributeRecordId] = useState();
    useEffect(() => {
        setPubUsers(publicUsers)
    }, [publicUsers])
    const menu = (
        <Menu >
            <Menu.Item key="0"><a onClick={() => openDialog('attribute')} >{DATASET.VERIFY_ATTRIBUTES}</a></Menu.Item>
            <Menu.Divider />
            <Menu.Item key="1"><a onClick={() => openDialog('trustScore')}>{DATASET.ADD_TRUST_SCORE}</a></Menu.Item>

        </Menu>
    );
    const openDialog = async (type) => {
        if (type === 'trustScore') {
            setModalVisible(true)
            setAttributeClicked(false);
            setTrustScoreClicked(true);
        } else if (type === 'attribute') {
            if (mapId !== '0') {
                let tempState = [];
                let i = 0;
                setModalVisible(true)
                setLoading(true);
                try {
                    const attributes = await getMapAttributes({ map: mapId, public_user: recordMeta.pubId }, token);
                    if (attributes) {
                        setAttributesList(attributes[0]?.attribute);
                        setAttributeRecordId(attributes[0]?.id);
                        attributes[0]?.attribute?.map((att) => {
                            if (att.isVarified === false) tempState.push({ isVarified: false, index: i })
                            else tempState.push({ isVarified: true, index: i });
                            i++;
                        })
                        setStates(tempState);
                        setLoading(false);
                    } else { setLoading(false); }
                } catch (e) {
                    message.error(e.message);
                    setLoading(false);
                }
            } else {
                message.warn('Please selecte specifice Map')
            }
            setAttributeClicked(true);
            setTrustScoreClicked(false);
        }
    }
    const UnverifyAttribute = async (index) => {
        attributesList[index].isVarified = false;
        setLoading(true);
        try {
            const updatedAttributes = await putMethod('map-attributes/' + attributeRecordId, { attribute: JSON.stringify(attributesList) });
            if (updatedAttributes) {
                setStates(states.map((obj) => {
                    if (obj.index === index) {
                        return { ...obj, isVarified: false }
                    } else {
                        return { ...obj, isVarified: obj?.isVarified }
                    }
                }))
                setAttributesList(updatedAttributes?.attribute);
                setLoading(false);
            }
        } catch (e) {
            message.error(e.message);
        }

    }
    const verfiyAttribute = async (index) => {
        attributesList[index].isVarified = true;
        setLoading(true);
        try {
            const updatedAttributes = await putMethod('map-attributes/' + attributeRecordId, { attribute: JSON.stringify(attributesList) });
            if (updatedAttributes) {
                setStates(states.map((obj) => {
                    if (obj?.index === index) {
                        return { ...obj, isVarified: true }
                    } else {
                        return { ...obj, isVarified: obj?.isVarified }
                    }
                }))
                setAttributesList(updatedAttributes?.attribute);
                setLoading(false);
            }
        } catch (e) {
            message.error(e.message);
        }
    }
    const addTrustScore = () => {
        form
            .validateFields()
            .then(async (values) => {
                setLoading(true);
                try {
                    const res = await putMethod('public-users/' + recordMeta?.pubId, { trust_score: values?.trust_score });
                    if (res) {
                        setPubUsers(pubUsers.map((obj) => {
                            if (Number(obj.key) === res.id) {
                                return { ...obj, trust_score: res?.trust_score }
                            }
                        }))
                        setLoading(false);
                        setModalVisible(false);
                    }
                } catch (e) {
                    message.error(e.message);
                    setLoading(false);
                    setModalVisible(false);
                }
            })
        setAttributeClicked(false);
        setTrustScoreClicked(false);
    }
    const columns = [
        {
            title: DATASET.ID,
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: DATASET.NAME,
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: DATASET.TRUST_SCORE,
            dataIndex: 'trust_score',
            key: 'trust_score'
        },
        {
            title: DATASET.DATE,
            dataIndex: 'updated_at',
            key: 'updated_at'
        },
        {
            title: DATASET.ATTRIBUTES,
            dataIndex: 'attributes',
            key: 'attributes'

        },
        {
            title: DATASET.MAPS,
            dataIndex: "maps",
            key: 'maps'
        },
        {
            title: DATASET.ACTIONS,
            key: 'action',
            render: (record) => (
                <Dropdown size="big" overlay={menu} trigger={['click']} >
                    <a className="ant-dropdown-link"
                        onClick={(e) => {
                            setRecordMeta({ pubAddress: record.id, trust_score: record.trust_score, pubId: record.key })
                        }} >
                        {DATASET.MORE_ACTIONs} <DownOutlined />
                    </a>
                </Dropdown>
            ),
        },
    ];

    return (
        <div>
            <Modal
                centered
                width='30%'
                visible={modalVisible}
                destroyOnClose={true}
                footer={[]}
                onCancel={() => setModalVisible(false)}>
                <Spin spinning={loading}>
                    <FormWrapper>
                        {
                            trustScoreClicked ?
                                <Form form={form} style={{ paddingTop: '40px' }} initialValues={recordMeta}>
                                    <Form.Item
                                        label='Trust Score' name='trust_score'
                                    >
                                        <Input type='number' />
                                    </Form.Item>
                                    <Button type='primary' style={{ float: 'right' }} onClick={() => addTrustScore()} >{DATASET.SAVE}</Button>
                                </Form> : <div></div>
                        }
                        <div style={{ paddingTop: '40px' }}>

                            {
                                attributeClicked && attributesList?.map((value, i) => (
                                    <Row key={i} >
                                        <Col span={6}>
                                            <div>
                                                {value.attribute}:
                                            </div>
                                        </Col>

                                        <Col span={10}>
                                            <Form.Item >
                                                <div>{value.value}</div>
                                            </Form.Item>
                                        </Col>


                                        <Col span={4}>
                                            {
                                                states[i]?.isVarified ? <Button shape='round' onClick={() => UnverifyAttribute(i)}>
                                                    {DATASET.UNVARIFY}
                                                </Button> :
                                                    <Button onClick={() => verfiyAttribute(i)} >{DATASET.VARIFY}</Button>
                                            }
                                        </Col>
                                        <Col span={2} />
                                        <Col span={2}>
                                            {<CheckCircleFilled style={{ color: states[i]?.isVarified ? '#1589FF' : '#3D3635', fontSize: '25px' }} />}
                                        </Col>
                                    </Row>
                                ))}
                        </div>
                    </FormWrapper>
                </Spin>
            </Modal>
            <Spin spinning={loading}>
                <Table dataSource={pubUsers} columns={columns} />
            </Spin>
        </div>
    )
}
export default PublicUsers;