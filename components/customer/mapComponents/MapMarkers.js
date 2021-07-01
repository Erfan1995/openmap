import styled from 'styled-components';
import { Form, Input, Row, Select, Divider, Col, message, Upload, Spin, Button, Modal, List } from "antd";
import { DATASET } from '../../../static/constant'
import { ConsoleSqlOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { deleteMethod, postFileMethod, postMethod } from "../../../lib/api";
import { getStrapiMedia } from '../../../lib/media';

const { Dragger } = Upload;
const Wrapper = styled.div`
background:#ffffff;
padding:30px;
margin:10px;
`;
const Photo = styled.img`
  height:40px;
`

const MapMarkers = (icons) => {
    console.log(icons.icons);
    const [modalVisible, setModalVisible] = useState(false);
    const [file, setFile] = useState();
    const [loading, setLoading] = useState(false);
    const [markers, setMarkers] = useState(icons.icons);
    const props = {
        beforeUpload: file => {
            if ((file.type.split("/")[0]) !== "image") {
                message.error(`${file.name} is not a valid file`);
            }
            return (file.type.split("/")[0]) === "image" ? true : Upload.LIST_IGNORE;
        },
        onChange: info => {
            setFile(info.file)
        },
    };
    const saveIcon = async () => {
        setLoading(true);
        console.log(file.originFileObj);
        setModalVisible(false);
        const data = new FormData();
        data.append('data', JSON.stringify({ 'name': file.originFileObj.name }))
        data.append('files.icon', file.originFileObj, file.originFileObj.name);
        const res = await postFileMethod('icons', data);
        if (res) {
            console.log(res);
            setMarkers([...markers, res]);
        }
        setLoading(false);
    }
    icons = []
    return (
        <Spin spinning={loading}>
            <div>
                <Button type="dashed" block size='large' onClick={() => setModalVisible(true)}>
                    {DATASET.ADD_NEW_ICON}
                </Button>
                <Modal
                    destroyOnClose={true}
                    visible={modalVisible}
                    onOk={() => saveIcon()}
                    onCancel={() => setModalVisible(false)}
                    width={300}
                >
                    <Wrapper>
                        <Dragger  {...props} name="file" maxCount={1} >
                            <p className="ant-upload-drag-icon">
                                <UploadOutlined />
                            </p>
                        </Dragger>
                    </Wrapper>
                </Modal>
                <Divider />

                <List
                    grid={{
                        gutter: 10,
                        xs: 1,
                        sm: 2,
                        md: 4,
                        lg: 4,
                        xl: 5,
                        xxl: 6
                    }}
                    dataSource={markers}
                    renderItem={(item) => (
                        <List.Item key={`listItem` + item.id}>
                            <Photo src={getStrapiMedia(item.icon[0])} />
                        </List.Item>
                    )}
                />

            </div>
        </Spin>
    )
}
export default MapMarkers;