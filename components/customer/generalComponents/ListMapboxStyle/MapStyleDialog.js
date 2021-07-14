import { List, Row, Card, Button, Form, Input, Col, message, Spin, Typography } from 'antd';
import { useImperativeHandle, useState, forwardRef } from "react";
import styled from 'styled-components';
import { postMethod } from 'lib/api';
const { Title } = Typography;


const FormWrapper = styled.div`
    padding-left:100px;
    padding-right:100px;
    margin-top:50px;
    margin-bottom:150px;
`;
const MapStyleDialog = ({ onModalClose }, ref) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useImperativeHandle(ref, () => ({
        addNewStyle() {
            form
                .validateFields()
                .then(async (values) => {
                    values.type = "custom";
                    setLoading(true);
                    const res = await postMethod('mapstyles', values);
                    if (res) {
                        message.success("style added successfully");
                        form.resetFields();
                        onModalClose(res);
                    }
                    setLoading(false);
                })
        }
    }))
    return (
        <Spin spinning={loading}>
            <FormWrapper>
                <h4>Add Mapbox Style Basemap</h4>
                <Form form={form} layout="horizantal" hideRequiredMark>
                    <Form.Item
                        label="MAPBOX STYLE URL"
                        name="link"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="E.g. http://api.mapbox.com/styles/v1/username/basemap/tiles/256/{z}/{X}" />
                    </Form.Item>
                </Form>
            </FormWrapper>
        </Spin>
    )
}

export default forwardRef(MapStyleDialog);