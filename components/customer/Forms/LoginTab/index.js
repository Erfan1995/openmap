
import { useEffect, useState } from "react";
import { Checkbox, message, Spin, Button, Modal, List, Col, Row, Dropdown, Menu, Form, Input, Select, Upload } from "antd";
import { putMethod,putFileMethod } from "lib/api";
import { DATASET } from "static/constant";
import styled from "styled-components";
import { LoginData } from "lib/constants";
import { ExclamationCircleOutlined, InboxOutlined } from '@ant-design/icons'

const { confirm } = Modal;
const { Dragger } = Upload;

function LoginTab({ mapData }) {


    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [attributes, setAttributes] = useState([]);
    const [selectedAttribute, setSelectedAttribute] = useState();
    const [attributeModelVisibility, setAttributeModelVisibility] = useState(false);
    const [editModalVisibility, setEditModalVisiblity] = useState(false);
    const [file, setFile] = useState();
    const [form] = Form.useForm();



    const AttributeWrapper = styled.div`
            border: 1px solid #eeeeee;
            border-radius: 5px;
            width:100%;
            height:70px;
            `;

    const AttributeDeleteButton = styled.span`
            font-size:20px;
            font-weight:bold;
             &:hover{
            font-size:22px;
            }
            padding:4px;
        `;

    const ModalBody = styled.div`
            padding:20px;
    `;


    const CustomTable = styled.table`
            width:100%;
    `;


    const SaveButton = styled(Button)`
        margin-top: 20px;
        margin-bottom: 20px;
        float: right !important;
        `;


    const attributeMenu = (
        <Menu>
            <Menu.Item key="1" style={{ padding: "3px 20px" }}><a onClick={() => setEditModalVisiblity(true)} >{DATASET.EDIT}</a></Menu.Item>
            <Menu.Item key="2" style={{ padding: "3px 20px" }}><a onClick={() => deleteConfirm()} >{DATASET.DELETE}</a></Menu.Item>
        </Menu>
    );

    useEffect(() => {
        mapData.auth_types != null ? setRows(mapData.auth_types) : setRows(LoginData);
        setAttributes(mapData.auth_attributes != null ? mapData.auth_attributes : []);
    }, []);


    function onChange(e) {
        var id = e.target.id;
        var result = [];
        rows.map((row) => {
            if (id == row['id']) {
                row['state'] = e.target.checked;
                result.push(row);
            }
            else {
                result.push(row);
            }
        })
        setRows(result);
        updateAuth(result);
    }


    const updateAuth = async (data) => {
        setLoading(true);
        try {
            await putMethod('maps/' + mapData.id, { auth_types: data });

        } catch (e) {
            message.error(e);
        }
        setLoading(false);
    }



    const updateAttribute = async (data) => {
        setLoading(true);
        try {
            const res = await putMethod('maps/' + mapData.id, { auth_attributes: data });
            if (res) {
                setAttributes(data);

            }
        } catch (e) {
            message.error(e);
        }
        setLoading(false);

    }


    const addAttribute = (values) => {
        const att = [];
        attributes.forEach((element) => {
            att.push(element);
        });
        att.push(values);
        updateAttribute(att);
        setAttributeModelVisibility(false);
    };


    function deleteConfirm() {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <p>{DATASET.DELETE_CONFIRM}</p>,
            onOk() {
                const att = [];
                attributes.forEach((element) => {
                    if (element.attribute != selectedAttribute.attribute) {
                        att.push(element);
                    }
                });
                updateAttribute(att);

            },
            onCancel() {
            },
        });
    }


    const editAttribute = (values) => {
        const att = [];
        attributes.forEach((element) => {
            if (element.attribute == selectedAttribute.attribute) {
                att.push(values);
            }
            else {
                att.push(element);
            }
        });
        updateAttribute(att);
        setEditModalVisiblity(false);
    }


    const addImageFile = (file) => {
        setFile(file);
    }

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


    const storeLoginData = () => {
        form
            .validateFields()
            .then(async (values) => {
                const fData = new FormData();
                let res = null;
                setLoading(true);
                fData.append('data',JSON.stringify(values));
                if (file) {
                    fData.append('files.loginLogo', file.file.originFileObj, file.file.originFileObj.name);
                }
                res = await putFileMethod(`maps/${mapData.id}`, fData);
                setLoading(false);
                if (res) {
                    message.success(DATASET.CREATE_MAP_SUCCESS_MSG);
                }
            })
            .catch((info) => {
                console.log('data ' + info);

                message.error(info)
                setLoading(false);
            })
    }


    return <div>
        <Spin spinning={loading}>
            <h2>Login Info</h2>
            <Form layout="vertical" onFinish={storeLoginData} form={form} initialValues={mapData} hideRequiredMark>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="loginTitle"
                            label={DATASET.TITLE}
                            rules={[{ required: true }]}
                        >
                            <Input placeholder={DATASET.PLACE_HOLDER_TITLE} />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            name="welcomeMessage"
                            label={DATASET.DESCRIPTION}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}>
                            <Input.TextArea rows={2} placeholder={DATASET.PLACE_HOLDER_DESCRIPTION} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Dragger  {...props} name="file" maxCount={1} >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">{DATASET.LOGO_FILE}</p>
                            <p className="ant-upload-text">{DATASET.CLICK_OR_DRAG}</p>
                        </Dragger>
                    </Col>
                    <Col span={24}>
                        <SaveButton type="primary" htmlType="submit" >{DATASET.SAVE}</SaveButton>
                    </Col>
                </Row>
            </Form>


            <h2 className='mt-20'>{DATASET.LOGIN}</h2>

            <CustomTable>
                {rows.map((row) => {
                    return <tr>
                        <td>{row.label}</td>
                        <td><Checkbox checked={row.state} id={row.id} onChange={onChange}></Checkbox></td>
                    </tr>
                })}
            </CustomTable>

            <br />
            <h2>{DATASET.USE_ATTRIBUTE}</h2>
            <Button type="dashed" size='large' block onClick={() => setAttributeModelVisibility(true)}>
                {DATASET.ADD_ATTRIBUTE}
            </Button>


            {/* Start add attribute modal */}
            <Modal
                title={DATASET.ADD_ATTRIBUTE}
                centered
                width={700}
                visible={attributeModelVisibility}
                onCancel={() => setAttributeModelVisibility(false)}
                footer={[
                    <Button form="myForm" key="submit" htmlType="submit">
                        {DATASET.SAVE}
                    </Button>,
                    <Button key="close" onClick={() => { setAttributeModelVisibility(false) }}> {DATASET.CLOSE}</Button>

                ]}
                destroyOnClose={true}
            >
                <ModalBody>
                    <Form id="myForm" name="control-ref" onFinish={addAttribute}>
                        <Form.Item name="attribute" label={DATASET.TITLE} rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                            <Select
                                placeholder={DATASET.SELECT_TYPE_PLACEHOLDER}
                                allowClear
                            >
                                <Option value="string">{DATASET.STRING}</Option>
                                <Option value="number">{DATASET.NUMBER}</Option>
                                <Option value="double">{DATASET.DOUBLE}</Option>
                                <Option value="json">{DATASET.JSON}</Option>

                            </Select>
                        </Form.Item>
                    </Form>
                </ModalBody>
            </Modal>
            {/* end insertion of attribute modal  */}



            {/* start edit attribute modal */}

            <Modal
                title={DATASET.EDIT_ATTRIBUTE}
                centered
                width={700}
                visible={editModalVisibility}
                destroyOnClose={true}
                onCancel={() => setEditModalVisiblity(false)}
                footer={[
                    <Button form='editForm' key='submit' htmlType='submit'> {DATASET.SAVE}</Button>,
                    <Button key='close' onClick={() => setEditModalVisiblity(false)}>{DATASET.CLOSE}</Button>,
                ]}>
                <ModalBody>
                    <Form id='editForm' onFinish={editAttribute}>
                        <Form.Item initialValue={selectedAttribute != null ? selectedAttribute.attribute : null} name="attribute" label={DATASET.TITLE} rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="type" label="Type" initialValue={selectedAttribute != null ? selectedAttribute.type : null} rules={[{ required: true }]}>
                            <Select
                                placeholder={DATASET.SELECT_TYPE_PLACEHOLDER}
                                allowClear
                            >
                                <Option value="string">{DATASET.STRING}</Option>
                                <Option value="number">{DATASET.NUMBER}</Option>
                                <Option value="double">{DATASET.DOUBLE}</Option>
                                <Option value="json">{DATASET.JSON}</Option>

                            </Select>
                        </Form.Item>
                    </Form>
                </ModalBody>
            </Modal>
            {/* end edit attribute modal  */}


            <List
                dataSource={attributes}
                renderItem={item => (
                    <List.Item>
                        <AttributeWrapper >
                            <Row>
                                <Col span={21}>
                                    <div style={{ marginTop: '20px', marginLeft: '5px', textAlign: 'center' }}>
                                        {item.attribute}
                                    </div>
                                </Col>
                                <Col span={3}>
                                    <div style={{ marginTop: "10px", padding: "4px" }}>
                                        <Dropdown size="big" overlay={attributeMenu} trigger={['click']} >
                                            <a className="ant-dropdown-link"
                                                onClick={(e) => {
                                                    setSelectedAttribute(item);
                                                }} >
                                                <AttributeDeleteButton>:</AttributeDeleteButton>
                                            </a>
                                        </Dropdown>
                                    </div>
                                </Col>
                            </Row>
                        </AttributeWrapper>
                    </List.Item>
                )}
            />
        </Spin>
    </div>
}

export default LoginTab