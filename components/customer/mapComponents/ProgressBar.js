
import 'rc-color-picker/assets/index.css';
import { Col, Row, Steps, Card, Input, Button, Space } from "antd";
import ColorPicker from 'rc-color-picker';
import { PhoneFilled } from '@ant-design/icons';

const { Step } = Steps;

const ProgressBar = ({ }) => {
    return <div>
        <Space direction='vertical'>
            <br />
            <Row>
                <Space direction='vertical'>
                    <Row>Style</Row>
                    <Row>
                        <Steps>
                            <Step status="finish" />
                            <Step status="finish" />
                            <Step status="process" />
                            <Step status="wait" />
                        </Steps>
                    </Row>
                    <Row>
                        <Steps>
                            <Step status="finish" title="" />
                            <Step status="finish" title="" />
                            <Step status="process" title=""/>
                            <Step status="wait" title=""/>
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
                    <ColorPicker/>
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

export default ProgressBar;