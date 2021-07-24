import { PlusOutlined } from "@ant-design/icons";
import { Form, Input, Row, Select, Divider, Col, message, Upload, Spin, Button } from "antd";
import { postMethod, putMethod, postFileMethod, putFileMethod } from "lib/api";
import { useImperativeHandle, useState, forwardRef } from "react";
import styled from 'styled-components';
import { DATASET } from '../../../../static/constant';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import nookies from 'nookies';
const CryptoJS = require("crypto-js");
const { Option } = Select;
const { Dragger } = Upload;
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


const CreateMap = ({ serverSideTags, user, mapData, onModalClose, addImageFile }, ref) => {
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
        saveData(styleId, image) {
            form
                .validateFields()
                .then(async (values) => {
                    const fData = new FormData();
                    values.styleId = styleId;
                    values.user = user.id;
                    let res = null;
                    setLoading(true);
                    if (mapData) {
                        if (localStorage.getItem('zoom')) {
                            values.zoomLevel = localStorage.getItem('zoom');
                        }
                        if (JSON.parse(localStorage.getItem('center'))) {
                            values.center = JSON.parse(localStorage.getItem('center'));
                        }
                        fData.append('data', JSON.stringify(values))
                        if (image) {
                            fData.append('files.logo', image.file.originFileObj, image.file.originFileObj.name);
                        }
                        res = await putFileMethod(`maps/${mapData.id}`, fData);
                    } else {
                        res = await postMethod('maps', values);
                    }
                    setLoading(false);
                    if (res) {
                        message.success(DATASET.CREATE_MAP_SUCCESS_MSG);
                        // onModalClose(res);
                        localStorage.clear('zoom');
                    }
                })
                .catch((info) => {
                    message.error(info.message)
                });
        },
        createMap(datasetId = null, image) {
            form
                .validateFields()
                .then(async (values) => {
                    const fData = new FormData();
                    values.datasets = datasetId;
                    // values.styleId = process.env.NEXT_PUBLIC_MAPBOX_DEFAULT_MAP;
                    values.user = user.id;
                    values.mapId = CryptoJS.SHA1(new Date().toString() + user.id).toString();
                    values.zoomLevel = 2;
                    values.center = [29.9635203, -10.1238717];
                    fData.append('data', JSON.stringify(values));
                    setLoading(true);
                    if (image) {
                        fData.append('files.logo', image.file.originFileObj, image.file.originFileObj.name);
                        let res = await postFileMethod('maps', fData)
                        setLoading(false);
                        if (res) {
                            message.success(DATASET.CREATE_MAP_SUCCESS_MSG);
                            onModalClose(res);
                        }
                    } else {
                        message.error('please select the logo');
                    }
                })
                .catch((info) => {
                    message.error(info.message)
                })
        }
    }), [])
    const props = {
        beforeUpload: file => {
            if ((file.type.split("/")[0]) !== "image") {
                message.error(`${file.name} is not a valid file`);
            }
            return (file.type.split("/")[0]) === "image" ? true : Upload.LIST_IGNORE;
        },
        onChange: info => {
            addImageFile(info);
        },
    };
    return (
        <Spin spinning={loading}>
            <Form form={form} layout="vertical" initialValues={mapData} hideRequiredMark>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="title"
                            label={DATASET.TITLE}
                            rules={[{ required: true }]}
                        >
                            <Input placeholder={DATASET.PLACE_HOLDER_TITLE} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="subtitle"
                            label={DATASET.SUBTITLE}
                            rules={[{ required: true }]}
                        >
                            <Input placeholder={DATASET.PLACEHOLDER_SUBTITLE} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
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
                    <Col span={12}>
                        <Form.Item
                            name="link"
                            label={DATASET.LINK}
                            rules={[{ required: true }]}
                        >
                            <Input placeholder={DATASET.PLACEHOLDER_LINK} />
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
            <Dragger  {...props} name="file" maxCount={1} >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">{DATASET.LOGO_FILE}</p>
                <p className="ant-upload-text">{DATASET.CLICK_OR_DRAG}</p>


            </Dragger>
        </Spin>
    );
};

export default forwardRef(CreateMap);
