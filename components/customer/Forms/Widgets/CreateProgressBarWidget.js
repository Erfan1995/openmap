
import 'rc-color-picker/assets/index.css';
import { Col, Row, Card, Input, Button, Space, Form, Upload, Progress, Spin, message } from "antd";
import ColorPicker from 'rc-color-picker';
import BreadCrumb from 'components/customer/mapComponents/Breadcrumb/breadcrumb';
import Stepper from 'components/customer/mapComponents/Stepper/stepper';
import { UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { putFileMethod, putMethod, getWidgets } from 'lib/api';
import { PlusOutlined,LoadingOutlined } from '@ant-design/icons';
import { DATASET } from 'static/constant';



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

const CreateProgressBarWidget = ({ mdcId, datsetProperties, token, layerType, widget }) => {
    const [form] = Form.useForm();
    const [icon, setIcon] = useState();
    const [loading, setLoading] = useState(false);
    const [colorCode, setColorCode] = useState('#ff0000');
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [steps,setSteps]=useState([]);




    console.log('widgets '+JSON.stringify(widget));



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
            // Get this url from response in real world.
            setIcon(info.file);
            getBase64(info.file.originFileObj, imageUrl => {
                setImageUrl(imageUrl);
                setUploading(false);
            }
            );
        }
    };


    console.log('widget '+JSON.stringify());

    const onSubmit = async (data) => {

        // const fData = new FormData();
        //         let res = null;
        //         setLoading(true);
        //         fData.append('data',JSON.stringify(values));
        //         if (file) {
        //             fData.append('files.loginLogo', file.file.originFileObj, file.file.originFileObj.name);
        //         }


        setLoading(true);
        let progressbar = [];
        form
            .validateFields()
            .then(async (values) => {
                const fData = new FormData();
                // widget.progressbar.map((item) => {
                //     progressbar.push({ 'title': item.title, 'hover_text': item.hover_text, 'icon': item.icon, 'is_active': false });
                // });

                // fData.append('data',JSON.stringify(values));
                // if (file) {
                //     fData.append('files.loginLogo', file.file.originFileObj, file.file.originFileObj.name);
                // }

  
                progressbar.push({ 'title': values.title, 'hover_text': values.hover_text, 'icon': '', 'is_active': false });
                fData.append('data', JSON.stringify(values));
                if(icon){
                    fData.append('files.icon',icon.originFileObj,icon.originFileObj.name);
                }
                // const res = await putFileMethod('widgets/' + widget.id, { 'progressbar': fData });
                // if (res) {
                //     console.log('widgets ' + JSON.stringify(res.progressbar) + ' id ' + widget.id);
                // }
                setLoading(false);
            }).catch(e => {
                setLoading(false);
                message.error(e?.message);
            })
    }



    return < div >
        <Spin spinning={loading}>
            <Space direction='vertical'>
                <br />
                <Row>
                    <Space direction='vertical'>
                        <Row>{DATASET.STYLE}</Row>
                        <Row className="w-full">
                            <Stepper steps={widget?.progressbar}></Stepper>
                        </Row>
                        <Row className="w-full">
                            <BreadCrumb steps={widget?.progressbar}></BreadCrumb>
                        </Row>
                    </Space>
                </Row>
                <br />
                <Row>
                    <Col span={20}>
                        {DATASET.COLOR}
                    </Col>
                    <Col span={4}>
                        <ColorPicker onChange={(color) => setColorCode(color?.color)} />
                    </Col>
                </Row>
                <br />
                <Row>
                    {DATASET.PROGRES_BAR_STEPS}
                </Row>
                <Row>
                    <Form form={form} name="progressbar" onFinish={onSubmit}>

                        <Space direction='vertical'>
                            <Card bodyStyle={{ padding: 10 }}>
                                <Row>
                                    <Space>
                                        <Col span={22}>
                                            <Space direction='vertical'>
                                                <Row>{DATASET.TITLE}</Row>
                                                <Row>
                                                    <Form.Item name="title" rules={[{ required: true, message: 'Please input title!' }]}>
                                                        <Input placeholder="title" />
                                                    </Form.Item>
                                                </Row>
                                                <Row>{DATASET.HOVER_TEXT}</Row>
                                                <Row>
                                                    <Form.Item name="hover_text" rules={[{ required: true, message: 'Please input hover text!' }]}>
                                                        <Input name="hover_text" placeholder="hover text" />
                                                    </Form.Item>
                                                </Row>
                                            </Space>
                                        </Col>
                                        <Col span={2}>
                                            <Space direction='vertical'>
                                                <Row>{DATASET.ICON}</Row>
                                                <Row>
                                                    {/* <Upload {...props}>
                                                        <Button style={{ height: 60, width: 60, borderRadius: 5, fontSize: 20, fontWeight: 'bold' }} icon={<UploadOutlined />}></Button>
                                                    </Upload> */}
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
                            </Card>
                            <Row>
                                <Button type='dashed' style={{ width: '100%', height: 50 }}>
                                    {DATASET.ADD_STEP}
                                </Button>
                            </Row>

                        </Space>
                    </Form>
                </Row>
            </Space>
        </Spin>
    </div>
}


export default CreateProgressBarWidget