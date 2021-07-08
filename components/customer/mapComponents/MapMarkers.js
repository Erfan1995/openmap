import styled from 'styled-components';
import { Divider, message, Upload, Spin, Button, Modal, List, Card } from "antd";
import { DATASET } from '../../../static/constant'
import { InboxOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { deleteMethod, postFileMethod, putMethod } from "../../../lib/api";
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
const MapMarkers = ({ icons, mdcId, selectedDIcons, layerType }) => {
    selectedDIcons.map(data => data.id = Number(data.id));
    const [uploadIconsLoading, setUploadIconsLoading] = useState(false);
    const [markers, setMarkers] = useState(icons);
    const [selectedIcons, setSelectedIcons] = useState();
    const selectedIconsToUpload = selectedDIcons;
    useEffect(() => {
        setSelectedIcons(selectedDIcons);
    }, [selectedDIcons])
    const props = {
        beforeUpload: file => {
            if ((file.type.split("/")[0]) !== "image") {
                message.error(`${file.name} is not a valid file`);
            }
            return (file.type.split("/")[0]) === "image" ? true : Upload.LIST_IGNORE;
        },
        onChange: info => {
            if (info.file.status === "done") {
                uploadIcon(info.file);
            }
        },

    };
    const uploadIcon = async (file) => {
        setUploadIconsLoading(true);
        setMarkers((markers) => [...markers].reverse());
        const data = new FormData();
        data.append('data', JSON.stringify({ 'name': file.originFileObj.name }))
        data.append('files.icon', file.originFileObj, file.originFileObj.name);
        const res = await postFileMethod('icons', data);
        if (res) {
            setMarkers([...markers, res]);
            message.success('uploaded successfully')
            setMarkers((markers) => [...markers].reverse());

        }
        setUploadIconsLoading(false);
    }
    const selectIcon = async (item) => {
        setUploadIconsLoading(true);
        if (layerType === "main") {
            if (selectedIcons.length !== 0) {
                const found = selectedIcons.some(el => el.id === item.id);
                if (!found) {
                    setSelectedIcons([...selectedIcons, item]);
                    selectedIconsToUpload.push(item);
                    const res = putMethod('maps/' + mdcId, { icons: selectedIconsToUpload.map(item => item.id) });
                }
            } else {
                setSelectedIcons([...selectedIcons, item]);
                selectedIconsToUpload.push(item);
            }
        } else if (layerType === "dataset") {
            const res = putMethod('mapdatasetconfs/' + mdcId, { icon: item.id });
            if (res) {
                let ics = [];
                ics[0] = item;
                setSelectedIcons(ics);
            }
        }
        setUploadIconsLoading(false);

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
    const deleteSelectedIcon = async (id) => {
        if (layerType === "main") {
            setUploadIconsLoading(true)
            const dd = selectedIcons.filter(data => data.id !== id);
            console.log(dd);
            const res = await putMethod('maps/' + mdcId, { icons: dd.map(item => item.id) });
            if (res) {
                setSelectedIcons(dd);
                message.success('deleted successfully');
            }
            setUploadIconsLoading(false);
        } else if (layerType === "dataset") {

        }
    }
    function showDeleteConfirm(id, condition) {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <p>{DATASET.DELETE_CONFIRM}</p>,
            onOk() {
                if (condition === "allIcons") {
                    deleteIcon(id);
                } else if (condition === "selectedIcons") {
                    deleteSelectedIcon(id);
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
            <Wrapper>
                <Dragger  {...props} name="file" maxCount={1} >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p>{DATASET.CLICK_OR_DRAG}</p>
                </Dragger>
            </Wrapper>
        </div>
    )
}
export default MapMarkers;