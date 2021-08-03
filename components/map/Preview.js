import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, Button, Row, Col, List, Card, message, Spin } from "antd";
import { deleteMethod, putMethod } from "lib/api";
import { useEffect, useState } from "react";
import styled from 'styled-components';
import EditMap from "./EditMap";
import { API, MAP } from '../../static/constant';
import { getStrapiMedia } from "lib/media";

const { confirm } = Modal;

const ContentWrapper = styled.div`
padding:10px;

`


const Photo = styled.img`
  width:43px;
  height:43px;
  :hover{
      opacity:0.8;
  }
`

const MarkerCard = styled(Card)`
:hover{
    cursor:pointer;
}
`

const Preview = ({ isVisible, place, closePlaceDetails, mapData, onDataSaved }) => {

    const [visible, setVisible] = useState(false);
    const [icons, setIcons] = useState(mapData?.icons.map(item => ({ ...item, isSelected: false })));
    const [loading, setLoading] = useState(false);

    const selectMarker = async (item) => {


        setLoading(true);
        setIcons(mapData?.icons.map((obj) => {
            if (item.id === obj.id) {
                return { ...obj, isSelected: true }
            } else {
                return { ...obj, isSelected: false }
            }
        }));

        let url = place.properties.type === 'public' ? 'mmdpublicusers' : 'mmdcustomers';

        try {
            const res = await putMethod(`${url}/${place.properties.id}`, { icon: item.id });

            if (res) {
                setLoading(false)
                setVisible(false);
                onDataSaved();
            }
        } catch (e) {
            setLoading(false);
            message.info(e.message);

        }




    }

    useEffect(() => {
        setVisible(isVisible);
    }, [])

    const saveData = async (geometry = null) => {
        setLoading(true);

        try {
            if (geometry) {
                let url = place.properties.type === 'public' ? 'mmdpublicusers' : 'mmdcustomers';
                const res = await putMethod(`${url}/${place.properties.id}`, { geometry: geometry });
                if (res) {
                    setLoading(false);

                    setVisible(false);
                    onDataSaved();
                }
            }
        }
        catch (info) {
            setLoading(false);
            message.error(info.message);
        };
    }

    const onUpdate = (data) => {
        saveData(data);
    }

    const deleteFeature = async () => {
        setLoading(true);

        try {
            let url = place.properties.type === 'public' ? 'mmdpublicusers' : 'mmdcustomers';

            const res = await deleteMethod(`${url}/${place.properties.id}`);
            if (res) {
                setLoading(false);

                onDataSaved();
            }
        } catch (e) {
            setLoading(false);

            message.error(MAP.CHECK_INTERNET_CONNECTION);
        }

    }

    const onDelete = () => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <p>{MAP.CONFIRM_DELETE}</p>,
            onOk() {
                deleteFeature()
            },
            onCancel() {
            },
        });
    }

    return (
        <Modal
            title={MAP.Place_DETAILS}
            visible={visible}
            style={{ top: 20 }}
            onCancel={closePlaceDetails}
            destroyOnClose={true}
            width={800}
            footer={[
                <Button key="close" onClick={closePlaceDetails}> close</Button>,
                <Button key="delete" onClick={onDelete} > {MAP.DELETE}</Button>,

            ]}
        >

            <Spin spinning={loading}>
                <ContentWrapper>
                    <Row gutter={[24, 24]}>
                        <Col span={10} >
                            {
                                place.geometry?.type === 'Point' &&
                                <Col span={24}>
                                    <List

                                        grid={{
                                            gutter: 10,
                                            column: 3

                                        }}
                                        dataSource={icons || []}
                                        renderItem={(item) => (
                                            <List.Item key={`listItem` + item.id} >
                                                <MarkerCard className={item.isSelected ? 'selectedBox' : ''} onClick={() => selectMarker(item)} >
                                                    <Photo src={getStrapiMedia(item.icon[0])} />
                                                </MarkerCard>
                                            </List.Item>
                                        )}
                                    />
                                </Col>
                            }
                        </Col>
                        <Col span={14}>
                            <EditMap
                                manualMapData={place}
                                styleId={mapData.mapstyle?.link}
                                style={{ height: "50vh" }}
                                option={{ zoom: 5 }}
                                mapData={mapData}
                                onUpdateEvent={onUpdate}
                                draw={{
                                    rectangle: false,
                                    polygon: false,
                                    circle: false,
                                    circlemarker: false,
                                    polyline: false,
                                    marker: false
                                }}
                                edit={
                                    {
                                        edit: true,
                                        remove: false,
                                    }
                                }
                            />
                        </Col>

                    </Row>


                </ContentWrapper>
            </Spin>


        </Modal>
    );
};

export default Preview;
