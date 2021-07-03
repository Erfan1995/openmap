import styled from 'styled-components';
import { Form, Input, Row, Select, Divider, Col, message, Upload, Spin, Button, Modal, List, Card } from "antd";
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
  width:100%;
  height:100%;
  :hover{
      opacity:0.8;
      cursor:pointer;
  }
`
const MarkerCard = styled(Card)`
  margin-top:10px;
`
const IconCard = styled(Card)`
  
`
const DeleteButton = styled.div`
  position: absolute;
  top:1%;
  right:6%;
  padding:1px 4px;
  :hover{

  }

cursor:pointer;
`
const MapMarkers = (icons) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [file, setFile] = useState();
    const [loading, setLoading] = useState(false);
    const [markers, setMarkers] = useState(icons.icons);
    const [selectedIcons, setSelectedIcons] = useState([]);
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
        setModalVisible(false);
        const data = new FormData();
        data.append('data', JSON.stringify({ 'name': file.originFileObj.name }))
        data.append('files.icon', file.originFileObj, file.originFileObj.name);
        const res = await postFileMethod('icons', data);
        if (res) {
            setMarkers([...markers, res]);
        }
        setLoading(false);
    }
    const selectIcon = (item) => {
        let exists = false;
        if (selectedIcons.length !== 0) {
            selectedIcons.map((icons) => {
                if (icons.id === item.id) {
                    exists = true;
                } else {
                    exists = false;
                }
            })
            if (!exists) {
                setSelectedIcons([...selectedIcons, item]);
            }
        } else {
            setSelectedIcons([...selectedIcons, item]);
        }
    }
    const deleteIcon = (id) => {
        console.log(id);
    }
    return (
        <Spin spinning={loading}>
            <div>

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
                <Card size="small" title="Selected Markers" >
                    <List
                        grid={{
                            gutter: 10,
                            column: 3
                        }}
                        dataSource={selectedIcons}
                        renderItem={(item) => (
                            <List.Item key={`listItem` + item.id}>
                                <IconCard onClick={() => selectIcon(item)}>
                                    <Photo src={getStrapiMedia(item.icon[0])} />
                                </IconCard>
                            </List.Item>
                        )}
                    />
                </Card>
                <MarkerCard size="small" title="Markers" >
                    <List
                        pagination={true}
                        grid={{
                            gutter: 10,
                            column: 3

                        }}
                        dataSource={markers}
                        renderItem={(item) => (
                            <List.Item key={`listItem` + item.id}>
                                <IconCard >
                                    <DeleteButton onClick={() => deleteIcon(item.id)}>x</DeleteButton>
                                    <Photo src={getStrapiMedia(item.icon[0])} onClick={() => selectIcon(item)} />
                                </IconCard>
                            </List.Item>
                        )}
                    />
                </MarkerCard>
                <Button type="dashed" block size='large' onClick={() => setModalVisible(true)}>
                    {DATASET.ADD_NEW_ICON}
                </Button>

            </div>
        </Spin>
    )
}
export default MapMarkers;