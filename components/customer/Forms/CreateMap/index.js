import { PlusOutlined } from "@ant-design/icons";
import { Form, Input, Row, Select, Divider, Col, message, Spin } from "antd";
import { postMethod, putMethod } from "lib/api";
import { useImperativeHandle, useState, forwardRef } from "react";
import styled from 'styled-components';
import { DATASET } from '../../../../static/constant';
const  CryptoJS = require("crypto-js");
const { Option } = Select;
const StyledDivider = styled(Divider)`
  margin: 4px 0;
`;
const LinkWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
`;
const StyledLink = styled.a`
  flex: none;
  padding: 8px;
  display: block;
  cursor: pointer;
`;


const CreateMap = ({ serverSideTags, user, mapData, onModalClose }, ref) => {
    const [form] = Form.useForm();
    const [tagName, settagName] = useState('');
    const [tags, setTags] = useState(serverSideTags || []);
    const [loading, setLoading] = useState(false);
    const onNameChange = (event) => {
        settagName(event.target.value);
    };

    const addItem = async () => {
        if (tagName.length > 0) {
            const data = {
                name: tagName,
            };

            const res = await postMethod('tags', data);
            setTags([
                ...tags,
                {
                    name: res.name,
                    id: res.id
                }
            ]);
            settagName('');
        }
    };


    useImperativeHandle(ref, () => ({
        saveData(styleId, datasetIds) {
            form
                .validateFields()
                .then(async (values) => {
                    values.styleId = styleId;
                    values.datasets = datasetIds;
                    values.users = user.id;
                    let res = null;
                    setLoading(true);
                    if (mapData) {
                        if (localStorage.getItem('zoom')) {
                            values.zoomLevel = localStorage.getItem('zoom');
                        }
                        if (JSON.parse(localStorage.getItem('center'))) {
                            values.center = JSON.parse(localStorage.getItem('center'));
                        }
                        res = await putMethod(`maps/${mapData.id}`, values);
                    } else {
                        res = await postMethod('maps', values);
                    }
                    setLoading(false);
                    if (res) {
                        message.success(DATASET.CREATE_MAP_SUCCESS_MSG);
                        onModalClose(res);
                        localStorage.clear('zoom');
                    }
                })
                .catch((info) => {
                    message.log(info);
                });
        },
        createMap(datasetId = null) {
            form
                .validateFields()
                .then(async (values) => {
                    
                    values.datasets = datasetId;
                    values.styleId = process.env.NEXT_PUBLIC_MAPBOX_DEFAULT_MAP;                  
                    values.users = user.id;
                    values.mapId=CryptoJS.SHA1(new Date().toString()+user.id).toString();
                    values.zoomLevel=2;
                    values.center=[29.9635203,-10.1238717];
                    setLoading(true);
                    let res = await postMethod('maps', values)
                    setLoading(false);
                    if (res) {
                        message.success(DATASET.CREATE_MAP_SUCCESS_MSG);
                        onModalClose(res);
                    }
                })
                .catch((info) => {
                    message.error(info.message)
                })
        }
    }), [])




    return (
        <Spin spinning={loading}>
            <Form form={form} layout="vertical" initialValues={mapData} hideRequiredMark>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="title"
                            label={DATASET.TITLE}
                            rules={[{ required: true }]}
                        >
                            <Input placeholder={DATASET.PLACE_HOLDER_TITLE} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="type"
                            label={DATASET.TYPE}
                            rules={[{ required: true, message: DATASET.PLACE_HOLDER_TYPE }]}
                        >
                            <Select placeholder={DATASET.PLACE_HOLDER_TYPE}>
                                <Option value="private">{DATASET.PRIVATE}</Option>
                                <Option value="public">{DATASET.PUBLIC}</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            name="tags"
                            label={DATASET.TAGS}
                            rules={[{ required: true }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder={DATASET.PLACE_HOLDER_TAGS}
                                dropdownRender={(menu) => (
                                    <div>
                                        {menu}
                                        <StyledDivider />
                                        <LinkWrapper>
                                            <Input value={tagName} onChange={onNameChange} />
                                            <StyledLink onClick={addItem}>
                                                <PlusOutlined /> {DATASET.ADD_NEW_TAG}
                                            </StyledLink>
                                        </LinkWrapper>
                                    </div>
                                )}>
                                {Array.isArray(tags) &&
                                    tags.map((item) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="description"
                            label={DATASET.DESCRIPTION}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}>
                            <Input.TextArea rows={4} placeholder={DATASET.PLACE_HOLDER_DESCRIPTION} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Spin>
    );
};

export default forwardRef(CreateMap);
