import styled from 'styled-components';
import { Divider, message, Upload, Spin, Button, Modal, List, Card } from "antd";
import { DATASET } from '../../../static/constant'
import { InboxOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { deleteMethod, postFileMethod, putMethod, getIcons } from "../../../lib/api";
import { getStrapiMedia } from '../../../lib/media';
const { confirm } = Modal;
import nookies from 'nookies';
const Photo = styled.img`
  width:70%;
  height:70%;
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
const MapMarkers = ({ icons, mdcId, selectedDIcons, layerType, setDataset, onMapDataChange, changeSelectedIcons }) => {
    selectedDIcons.map(data => data.id = Number(data.id));
    const { token } = nookies.get();
    const [uploadIconsLoading, setUploadIconsLoading] = useState(false);
    const [markers, setMarkers] = useState(icons);
    const [selectedIcons, setSelectedIcons] = useState([]);
    const selectedIconsToUpload = selectedDIcons;
    useEffect(() => {
        setSelectedIcons(selectedDIcons);
    }, [selectedDIcons])
    useEffect(async () => {
        const allIcons = await getIcons(token);
        if (allIcons) {
            allIcons.map((icon) => {
                icon.id = Number(icon.id);
            });
            setMarkers(allIcons);
        }
    }, [icons])
    const props = {
        beforeUpload: file => {
            if ((file.type.split("/")[0]) !== "image") {
                message.error(`${file.name} is not a valid file`);
            }
            return (file.type.split("/")[0]) === "image" ? true : Upload.LIST_IGNORE;
        },
        onChange: info => {
            setUploadIconsLoading(true)
            if (info.file.status === "done") {
                uploadIcon(info.file);
            }
        },

    };
    const uploadIcon = async (file) => {
        // setMarkers((markers) => [...markers].reverse());
        const data = new FormData();
        data.append('data', JSON.stringify({ 'name': file.originFileObj.name }))
        data.append('files.icon', file.originFileObj, file.originFileObj.name);
        try {
            const res = await postFileMethod('icons', data);
            if (res) {
                setMarkers([...markers, res]);
                message.success('uploaded successfully')
                setMarkers((markers) => [...markers].reverse());
                setUploadIconsLoading(false);
            }
        }
        catch (e) {
            setUploadIconsLoading(false);
        }
    }
    const selectIcon = async (item) => {
        if (layerType === "main") {
            const found = selectedIcons.some(el => el.id === item.id);
            if (!found) {
                setUploadIconsLoading(true);
                setSelectedIcons([...selectedIcons, item]);
                selectedIconsToUpload.push(item);
                const res = await putMethod('maps/' + mdcId, { icons: selectedIconsToUpload.map(item => item.id) });
                if (res) {
                    onMapDataChange();
                    setUploadIconsLoading(false);
                }
            }

        } else if (layerType === "dataset") {
            setUploadIconsLoading(true);
            const res = await putMethod('mapdatasetconfs/' + mdcId, { icon: item.id });
            if (res) {
                let ics = [];
                ics[0] = res.icon;
                setSelectedIcons(ics);
                setDataset();
                setUploadIconsLoading(false);
                changeSelectedIcons(ics);
            }
        }

    }
    const deleteIcon = async (id) => {
        setUploadIconsLoading(true)
        const res = await deleteMethod('icons/' + id)
        if (res) {
            const dd = markers.filter(dData => dData.id !== res.id);
            setMarkers(dd);
            message.success('deleted successfully');
            setUploadIconsLoading(false);
        }
    }
    const deleteSelectedIcon = async (id) => {
        if (layerType === "main") {
            setUploadIconsLoading(true)
            const dd = selectedIcons.filter(data => data.id !== id);
            const res = await putMethod('maps/' + mdcId, { icons: dd.map(item => item.id) });
            if (res) {
                setSelectedIcons(dd);
                onMapDataChange();
                message.success('deleted successfully');
                setUploadIconsLoading(false);
            }
        } else if (layerType === "dataset") {
            const res = putMethod('mapdatasetconfs/' + mdcId, { icon: null });
            if (res) {
                setSelectedIcons([]);
                setDataset();
            }
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
            {selectedIcons &&
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
            }
            <Spin spinning={uploadIconsLoading}>
                <MarkerCard size="small" title="Markers" extra={<Upload showUploadList={false} {...props}>
                    <Button icon={<PlusOutlined />}></Button>
                </Upload>} >
                    <List
                        grid={{
                            gutter: 10,
                            column: 5

                        }}
                        dataSource={markers}
                        renderItem={(item) => (
                            <List.Item key={`listItem` + item.id}>
                                <div >
                                    {/* <DeleteButton onClick={() => showDeleteConfirm(item.id, 'allIcons')}>x</DeleteButton> */}
                                    <Photo src={getStrapiMedia(item.icon[0])} onClick={() => selectIcon(item)} />
                                </div>
                            </List.Item>
                        )}
                    />
                </MarkerCard>
            </Spin>
        </div>
    )
}
export default MapMarkers;