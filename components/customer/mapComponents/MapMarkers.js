import styled from 'styled-components';
import { Divider, message, Upload, Spin, Button, Modal, List, Card } from "antd";
import { DATASET } from '../../../static/constant'
import { InboxOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { deleteMethod, postFileMethod } from "../../../lib/api";
import { getStrapiMedia } from '../../../lib/media';
const { confirm } = Modal;

const { Dragger } = Upload;
const Wrapper = styled.div`
background:#ffffff;
padding:10px;
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
const DeleteButton = styled.div`
  position: absolute;
  top:-4%;
  right:10%;
  :hover{
    font-size:large;
  }

cursor:pointer;
`
const MapMarkers = (icons) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectIconLoading, setSelectIconLoading] = useState(false);
    const [file, setFile] = useState();
    const [uploadIconsLoading, setUploadIconsLoading] = useState(false);
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
            setModalVisible(false);
            uploadIcon(info.file)
        },
    };
    const uploadIcon = async (file) => {
        setUploadIconsLoading(true);
        setMarkers((markers) => [...markers].reverse());
        // console.log(markers, 'reversed')
        const data = new FormData();
        data.append('data', JSON.stringify({ 'name': file.originFileObj.name }))
        data.append('files.icon', file.originFileObj, file.originFileObj.name);
        const res = await postFileMethod('icons', data);
        if (res) {
            setMarkers([...markers, res]);
            message.success('uploaded successfully')
            setMarkers((markers) => [...markers].reverse());
            console.log(markers, '>>>>revers');

        }
        setUploadIconsLoading(false);
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
    const deleteIcon = async (id) => {
        setUploadIconsLoading(true)
        const res = await deleteMethod('icons/' + id)
        if (res) {
            const dd = markers.filter(dData => dData.id !== res.id);
            setMarkers(dd);
            message.success('deleted successfully');
        }
        setUploadIconsLoading(false);
    }
    function showDeleteConfirm(id, condition) {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <p>{DATASET.DELETE_CONFIRM}</p>,
            onOk() {
                if (condition === "allIcons") {
                    deleteIcon(id);
                } else if (condition === "selectedIcons") {
                    console.log("helllllloooooooooooo");
                }
            },
            onCancel() {
            },
        });
    }
    return (
        <div>
            <Card size="small" title="Selected Markers" >
                <List
                    grid={{
                        gutter: 10,
                        column: 3
                    }}
                    dataSource={selectedIcons}
                    renderItem={(item) => (
                        <List.Item key={`listItem` + item.id}>
                            <Card >
                                <DeleteButton onClick={() => showDeleteConfirm(item.id, 'selectedIcons')}>x</DeleteButton>
                                <Photo src={getStrapiMedia(item.icon[0])} />
                            </Card>
                        </List.Item>
                    )}
                />
            </Card>
            <Spin spinning={uploadIconsLoading}>
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
                                <Card >
                                    <DeleteButton onClick={() => showDeleteConfirm(item.id, 'allIcons')}>x</DeleteButton>
                                    <Photo src={getStrapiMedia(item.icon[0])} onClick={() => selectIcon(item)} />
                                </Card>
                            </List.Item>
                        )}
                    />
                </MarkerCard>
            </Spin>
            <br />
            <Button type="dashed" block size='large' onClick={() => setModalVisible(!modalVisible)}>
                {DATASET.ADD_NEW_ICON}
            </Button>
            {modalVisible ? (<Wrapper>
                <Dragger  {...props} name="file" maxCount={1} >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p>{DATASET.CLICK_OR_DRAG}</p>
                </Dragger>
            </Wrapper>) : (<p></p>)
            }
        </div>
    )
}
export default MapMarkers;