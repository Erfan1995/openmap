
import 'rc-color-picker/assets/index.css';
import { Col, Row, Steps, Card, Input, Button, Space } from "antd";
import ColorPicker from 'rc-color-picker';
import { PhoneFilled } from '@ant-design/icons';
import BreadCrumb from './Breadcrumb/breadcrumb';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import("react-quill"), { ssr: true });
import 'react-quill/dist/quill.snow.css';


const { Step } = Steps;
const { TextArea } = Input;


const AddWidget = ({ }) => {
    const [selected, setSelected] = useState(0);

    useEffect(() => {
        setSelected(localStorage.getItem('currentWidget'));
    }, [])


    let SelectedView;
    if (selected == 1) {
        SelectedView = <ProgressWidget></ProgressWidget>
    }
    else if (selected == 2) {
        SelectedView = <VideoWidget></VideoWidget>
    }
    else if (selected == 3) {
        SelectedView = <TextWidget></TextWidget>
    }
    else if (selected == 4) {
        SelectedView = <NewsFeedWidget></NewsFeedWidget>
    }

    return <div>
        {SelectedView}
    </div>

}

export default AddWidget;




const VideoWidget = () => {
    return <div>
        <Space direction='vertical'>
            <Row>Title</Row>
            <Row>
                <Input placeholder="Title "></Input>
            </Row>
            <br />
            <Row>
                <Col span={20}>
                    Color
                </Col>
                <Col span={4}>
                    <ColorPicker />

                </Col>
            </Row>
            <br />
            <Row>Video Link</Row>
            <Row>
                <Input placeholder="https://www.youtube.com/watch?v=7O9ZDygWZ58"></Input>
            </Row>
            <br />
            <br />
            <br />
            <Row>
                <Button type='primary'>
                    Save
                </Button>
            </Row>
        </Space>
    </div>
}

const ProgressWidget = () => {
    return < div >
        <Space direction='vertical'>
            <br />
            <Row>
                <Space direction='vertical'>
                    <Row>Style</Row>
                    <Row className="w-full">
                        <BreadCrumb></BreadCrumb>
                    </Row>
                    <Row>
                        <Steps>
                            <Step status="finish" />
                            <Step status="finish" />
                            <Step status="process" />
                        </Steps>
                    </Row>
                </Space>
            </Row>
            <br />
            <Row>
                <Col span={20}>
                    Color
                </Col>
                <Col span={4}>
                    <ColorPicker />
                    {/* <ColorPickerPanel enableAlpha={false} color={'#db19d4'} mode="RGB" /> */}
                </Col>
            </Row>
            <br />
            <Row>
                Progress Bar Steps
            </Row>
            <Row>
                <Space direction='vertical'>
                    <Card bodyStyle={{ padding: 10 }}>
                        <Row>
                            <Space>
                                <Col span={22}>
                                    <Space direction='vertical'>
                                        <Row>Title</Row>
                                        <Row>
                                            <Input placeholder="Basic usage" />
                                        </Row>
                                        <Row>Hover Text</Row>
                                        <Row>
                                            <Input placeholder="Basic usage" />
                                        </Row>
                                    </Space>
                                </Col>
                                <Col span={2}>
                                    <Space direction='vertical'>
                                        <Row>Icon</Row>
                                        <Row>
                                            <Button style={{ height: 60, width: '100%', borderRadius: 5, fontSize: 20, fontWeight: 'bold' }}>
                                                +
                                            </Button>
                                        </Row>
                                        <Row>
                                            <Button type="primary" style={{ borderRadius: 5, }}>
                                                Save
                                            </Button>
                                        </Row>
                                    </Space>
                                </Col>
                            </Space>
                        </Row>
                    </Card>
                    <Row>
                        <Button type='dashed' style={{ width: '100%', height: 50 }}>
                            Add Step
                        </Button>
                    </Row>
                </Space>
            </Row>
        </Space>
    </div>
}



const TextWidget = () => {
    const [value, setValue] = useState('')
    return <div>
        <Space direction='vertical'>
            <Row>Title</Row>
            <Row>
                <Input placeholder="Title "></Input>
            </Row>
            <br />
            <Row>
                <Col span={20}>
                    Color
                </Col>
                <Col span={4}>
                    <ColorPicker />

                </Col>
            </Row>
            <br />
            <Row>
                Braft Editor
            </Row>
            <Row>
                <ReactQuill value={value} onChange={setValue} />
                {/* <Input placeholder="https://www.youtube.com/watch?v=7O9ZDygWZ58"></Input> */}
            </Row>
            <br />
            <br />
            <br />
            <Row>
                <Button type='primary'>
                    Save
                </Button>
            </Row>
        </Space>
    </div>
}


const NewsFeedWidget = () => {
    return <Space direction='vertical'>
        <Row>Title</Row>
        <Row>
            <Input placeholder="Title" ></Input>
        </Row>
        <br />
        <Row>
            <Col span={20}>
                Color
            </Col>
            <Col span={4}>
                <ColorPicker />

            </Col>
        </Row>
        <br />
        <Row>Embed Html (RSS Feed)</Row>
        <Row>
            <TextArea rows={4}>

            </TextArea>
        </Row>
        <br />
        <br />
        <br />
        <Row>
            <Button type='primary'>
                Save
            </Button>
        </Row>
    </Space>
}