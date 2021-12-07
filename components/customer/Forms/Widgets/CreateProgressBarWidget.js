
import 'rc-color-picker/assets/index.css';
import { Col, Row, Card, Input, Button, Space, Form, Upload, Modal, Spin, message, Menu, Dropdown, Radio, Checkbox } from "antd";
import ColorPicker from 'rc-color-picker';
import BreadCrumb from 'components/customer/mapComponents/Breadcrumb/breadcrumb';
import Stepper from 'components/customer/mapComponents/Stepper/stepper';
import { useEffect, useRef, useState } from 'react';
import { putFileMethod, deleteMethod, putMethod } from 'lib/api';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { DATASET } from 'static/constant';
import styled from 'styled-components';
import AddStep from './addStep';
import { getStrapiMedia } from 'lib/media';
import { ProgressStyle } from 'lib/constants';



const ListEditeButton = styled.span`
    font-size:20px;
    font-weight:bold;
    &:hover{
    font-size:22px;
    }
    padding:4px;
    `;



function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}

const CreateProgressBarWidget = ({ widget,mdcId,mdcConf,progressbar }) => {
    const [form] = Form.useForm();
    const [icon, setIcon] = useState();
    const [loading, setLoading] = useState(false);
    const [colorCode, setColorCode] = useState();
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [steps, setSteps] = useState([]);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const childRef = useRef();
    const [selectedStep, setSelectedStep] = useState(null);
    const [file, setFile] = useState();
    const [defaultValues, setDefaultValues] = useState(null);
    const [selectedStyle, setSelectedStyle] = useState('circle-mode');
    const [activeStep, setActiveStep] = useState();


    useEffect(() => {
        setSteps(progressbar);
        setActiveStep(mdcConf?.selected_step);
        setSelectedStyle(mdcConf?.progress_bar_default_style);
    }, [progressbar,mdcConf]);


    useEffect(()=>{
        setColorCode(mdcConf?.progressbar_color);
    },[colorCode])

    useEffect(() => {
        form.setFieldsValue(defaultValues);
    }, [form, defaultValues])


    const listMenu = (
        <Menu>
            <Menu.Item key="1" style={{ padding: "3px 20px" }}><a onClick={() => onDelete(defaultValues?.id)} >{DATASET.DELETE}</a></Menu.Item>
        </Menu>
    );


    const uploadButton = (
        <div>
            {uploading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );


    const handleChange = info => {
        if (info.file.status === 'uploading') {
            setUploading(true);
            return;
        }
        if (info.file.status === 'done') {
            setIcon(info.file);
            getBase64(info.file.originFileObj, imageUrl => {
                setImageUrl(imageUrl);
                setUploading(false);
            }
            );
        }
    };


    const onSubmit = async (data) => {
        const fData = new FormData();
        setLoading(true);
        form
            .validateFields()
            .then(async (values) => {

                fData.append('data', JSON.stringify({ 'title': values.title, 'hover_text': values.hover_text, 'mapdatasetconf': mdcId }));
                if (icon) {
                    fData.append('files.icon', icon.originFileObj, icon.originFileObj.name);
                }
                const res = await putFileMethod('dataset-progressbars/' + defaultValues.id, fData);
                if (res) {
                    if (values.is_active) {
                        const widgetRes = await putMethod('mapdatasetconfs/' + mdcId, { 'selected_step':Number(defaultValues.id)});
                        if (widgetRes) {
                            setActiveStep(widgetRes.selected_step);
                        }
                    }
                    message.success(DATASET.STEP_UPDATED_SUCCESSFUL);
                    setSelectedStep(null);
                    setSteps(steps.map((step) => {
                        if (step.id === defaultValues?.id) {
                            return { ...step, title: res.title, hover_text: res.hover_text, icon: res.icon, id: res.id }
                        }
                        else {
                            return { ...step, step: step }
                        }
                    }));

                }
                setLoading(false);
            }).catch(e => {
                setLoading(false);
                message.error(DATASET.STEP_UPDATE_FAILED);
            })
    }



    const onStepClick = (step) => {
        console.log('values '+JSON.stringify(step));
        setDefaultValues({ 'id': step.id, 'title': step.title, 'hover_text': step.hover_text, 'is_active': activeStep == step.id ? true : false });
        setImageUrl(getStrapiMedia(step.icon));
        setIcon(null);
        setSelectedStep(step);
    }


    const onDelete = async (id) => {
        setLoading(true);
        try {
            const res = deleteMethod('dataset-progressbars/' + id);
            if (res) {
                message.success(DATASET.STEP_DELETED);
                const newList = steps.filter((step) => step.id !== id);
                setSteps(newList.map((step) => {
                    return { ...step, step: step }
                }));
                setSelectedStep(null);
                setLoading(false);
            }
        } catch (e) {
            message.error(DATASET.STEP_DELETION_FIELD);
        }
        finally {
            setLoading(false);
        }
    }

    const onModalClose = (res) => {
        steps.push({ 'title': res.title, 'hover_text': res.hover_text, 'id': res.id, 'icon': res.icon });
        setAddModalVisible(false);
    }


    const addImageFile = (file) => {
        setFile(file);
    }


    const onColorChange = async (color) => {
        setLoading(true);
        try {
            const res = await putMethod('mapdatasetconfs/' + mdcId, { 'progressbar_color': color?.color });
            if (res) {
                setColorCode(color);
            }
        } catch (e) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }


    const onStyleChange = async (style) => {
        setLoading(true);
        try {
            const res = await putMethod('mapdatasetconfs/' + mdcId, { 'progress_bar_default_style': style.target.value });
            if (res) {
                message.success(DATASET.STYLE_CHANGED);
                setSelectedStyle(style.target.value);
                setLoading(false);
            }
        } catch (e) {
            message.error(DATASET.FIELD_CHANGE_STYLE)
        } finally {
            setLoading(false);
        }

    }

    return (typeof progressbar !== 'undefined') ? < div >
        <Spin spinning={loading}>
            <Space direction='vertical'>
                <br />
                <Row>
                    <Space direction='vertical'>
                        <Row>{DATASET.STYLE}</Row>
                        <Row className="w-full">
                            <Stepper steps={steps} activeStep={activeStep} onStepClick={onStepClick} color={colorCode}></Stepper>
                        </Row>
                        <Row className="w-full">
                            <BreadCrumb steps={steps} activeStep={activeStep} onStepClick={onStepClick} color={colorCode}></BreadCrumb>
                        </Row>
                    </Space>
                </Row>
                <Row>
                    <Space direction='vertical'>
                        <Row>{DATASET.SELECT_STYLE}</Row>
                        <Row className="w-full">
                            <Radio.Group
                                options={ProgressStyle}
                                value={selectedStyle}
                                onChange={onStyleChange}
                                optionType="button"
                                buttonStyle="solid"
                            />
                        </Row>
                    </Space>
                </Row>
                <br />
                <Row>
                    <Col span={20}>
                        {DATASET.COLOR}
                    </Col>
                    <Col span={4}>
                        <ColorPicker color={colorCode?.color} onChange={(color) => onColorChange(color)} />
                    </Col>
                </Row>
                <Row>
                    {DATASET.PROGRES_BAR_STEPS}
                </Row>
                <Row>
                    <Form form={form} name="progressbar" onFinish={onSubmit} initialValues={defaultValues}>
                        <Space direction='vertical'>
                            <Row>
                                <Col span={23}>
                                    <Space direction="vertical">
                                        {selectedStep !== null ?
                                            <Card bodyStyle={{ padding: 10 }}>
                                                <Row>
                                                    <Space>
                                                        <Col span={22}>
                                                            <Row>{DATASET.TITLE}</Row>
                                                            <Row>
                                                                <Form.Item name="title" rules={[{ required: true, message: 'Please input title!' }]}>
                                                                    <Input placeholder="title" />
                                                                </Form.Item>
                                                            </Row>
                                                            <Row>{DATASET.HOVER_TEXT}</Row>
                                                            <Row>
                                                                <Form.Item name="hover_text" rules={[{ required: true, message: 'Please input hover text!' }]}>
                                                                    <Input placeholder="hover text" />
                                                                </Form.Item>
                                                            </Row>
                                                            <Row>
                                                                <Form.Item name="is_active" valuePropName="checked" >
                                                                    <Checkbox>
                                                                        Is Active
                                                                    </Checkbox>
                                                                </Form.Item>
                                                            </Row>
                                                        </Col>
                                                        <Col span={2}>
                                                            <Space direction='vertical'>
                                                                <Row>{DATASET.ICON}</Row>
                                                                <Row>
                                                                    <Upload
                                                                        name="icon"
                                                                        listType="picture-card"
                                                                        className="avatar-uploader"
                                                                        showUploadList={false}
                                                                        beforeUpload={beforeUpload}
                                                                        onChange={handleChange}
                                                                    >
                                                                        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                                                    </Upload>
                                                                </Row>
                                                                <Row>
                                                                    <Button type="primary" htmlType="submit" style={{ borderRadius: 5, }}>
                                                                        {DATASET.SAVE}
                                                                    </Button>
                                                                </Row>
                                                            </Space>
                                                        </Col>
                                                    </Space>
                                                </Row>
                                            </Card> : <div></div>
                                        }
                                        <Row style={{ minWidth: 250}}>
                                            <Button type='dashed' onClick={() => setAddModalVisible(true)} style={{ width: '100%', height: 50 }}>
                                                {DATASET.ADD_STEP}
                                            </Button>
                                        </Row>
                                    </Space>
                                </Col>
                                {selectedStep !== null ? <Col span={1}>
                                    <Row style={{ width: '100%', height: '100%', paddingTop: 80 }}>
                                        <Col span={3}>
                                            <div>
                                                <Dropdown size="big" overlay={listMenu} trigger={['click']} >
                                                    <a className="ant-dropdown-link">
                                                        <ListEditeButton>:</ListEditeButton>
                                                    </a>
                                                </Dropdown>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col> : <div></div>}
                            </Row>
                        </Space>
                    </Form>
                    <Modal
                        title={DATASET.ADD_STEP}
                        centered
                        width={500}
                        visible={addModalVisible}
                        destroyOnClose={true}
                        onOk={() => childRef.current.saveData(file)}
                        onCancel={() => setAddModalVisible(false)}>
                        <AddStep mdcId={mdcId} ref={childRef} onModalClose={(res) => onModalClose(res)} addImageFile={addImageFile}></AddStep>
                    </Modal>
                </Row>
            </Space>
        </Spin>
    </div> : <div></div>
}


export default CreateProgressBarWidget