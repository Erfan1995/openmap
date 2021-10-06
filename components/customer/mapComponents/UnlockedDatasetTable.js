import { Table, Dropdown, Menu, Modal, Spin, Button, message } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteMethod, putMethod, getMaps, postMethod } from "../../../lib/api";
import 'antd/dist/antd.css';
import styled from 'styled-components';
import DatasetDetails from './DatasatDetails';
import CreateMap from '../Forms/CreateMap';
import { useRouter } from 'next/router';
import { DATASET } from '../../../static/constant'
const { confirm } = Modal;
const CreateMapWrapper = styled.div`
background:#ffffff;
padding:20px;
margin:10px;
`;
const UnlockedDataset = ({ data, updateLockedData, user, tags, updatedData }) => {
    let mapData;
    const router = useRouter();
    const [datasetId, setDatasetId] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [dataset, setDataset] = useState([]);
    const [loading, setLoading] = useState(false);
    const [createMapModalVisibl, setCreateMapModalVisible] = useState(false);
    const childRef = useRef();
    const [file, setFile] = useState();

    useEffect(() => {
        setDataset(data);
    }, [data])

    const deleteDataset = async () => {
        try {
            setLoading(true);
            const res = await deleteMethod('datasetcontents/' + datasetId)
            if (res !== 'Faild') {
                const datasets = dataset.filter(dData => dData.id !== res);
                setDataset(datasets);
                updatedData(datasets);
                setLoading(false)
            } else {
                message.error('Faild to delete please try again.');
            }
        } catch (e) {
            message.error(e.message);
            setLoading(false)
        }
    }
    const lockDataset = async () => {
        setLoading(true)
        const res = await putMethod('datasets/' + datasetId, { is_locked: true });
        if (res) {
            let dd = dataset.filter(dData => dData.id !== res.id);
            setDataset(dd);
            updateLockedData(dataset.filter(dData => dData.id === res.id), dd)
            setLoading(false)
        }
    }
    function showConfirm() {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <p>{DATASET.DELETE_CONFIRM}</p>,
            onOk() {
                deleteDataset()
            },
            onCancel() {
            },
        });
    }
    function showLockConfirm() {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <p>{DATASET.LOCK_CONFIRM}</p>,
            onOk() {
                lockDataset()
            },
            onCancel() {
            },
        });
    }

    const menu = (
        <Menu >
            <Menu.Item key="0"><a onClick={() => setModalVisible(true)}>{DATASET.DATASET_DETAILS}</a></Menu.Item>
            <Menu.Divider />
            <Menu.Item key="1"><a onClick={() => setCreateMapModalVisible(true)}>{DATASET.CREATE_MAP}</a></Menu.Item>
            <Menu.Divider />
            <Menu.Item key="2"><a onClick={() => showLockConfirm()}>{DATASET.LOCK}</a></Menu.Item>
            <Menu.Divider />
            <Menu.Item key="3"><a onClick={() => showConfirm()}>{DATASET.DELETE}</a></Menu.Item>
        </Menu>
    );

    const columns = [
        {
            title: DATASET.ID,
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: DATASET.NAME,
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: DATASET.DATE,
            dataIndex: 'updated_at',
            key: 'updated_at'

        },
        {
            title: DATASET.MAPS,
            dataIndex: "maps",
            key: 'maps'
        },
        {
            title: DATASET.SIZE,
            dataIndex: "size",
            key: 'size'
        },
        {
            title: DATASET.ACTIONS,
            key: 'action',
            render: (record) => (
                <Dropdown size="big" overlay={menu} trigger={['click']} >
                    <a className="ant-dropdown-link"
                        onClick={(e) => {
                            setDatasetId(record.id)
                        }} >
                        {DATASET.MORE_ACTIONs} <DownOutlined />
                    </a>
                </Dropdown>
            ),
        },
    ];

    const addImageFile = (file) => {
        setFile(file);
    }
    const createMapDatasetConf = async (mapId) => {
        const dd = await postMethod('mapdatasetconfs', { map: mapId, dataset: datasetId });
        if (dd) {
            setCreateMapModalVisible(false);
            router.push({
                pathname: 'create-map',
                query: { id: mapId }
            })
        }

    }
    const onModalClose = (res) => {
        createMapDatasetConf(res.id)
    }
    return (
        <>
            <Modal
                title={DATASET.DATASET_DETAILS}
                width={1500}
                centered
                visible={modalVisible}
                destroyOnClose={true}
                onCancel={() => { setModalVisible(false) }}
                footer={[
                    <Button key="close" onClick={() => { setModalVisible(false) }}> close</Button>
                ]}

            >
                <DatasetDetails rowId={datasetId} />
            </Modal>
            <Modal
                title={DATASET.CREATE_MAP}
                centered
                width={800}
                visible={createMapModalVisibl}
                onOk={() => childRef.current.createMap(datasetId, file)}
                destroyOnClose={true}
                onCancel={() => setCreateMapModalVisible(false)}>
                <CreateMapWrapper>
                    <CreateMap ref={childRef}
                        mapData={mapData} serverSideTags={tags} user={user} onModalClose={onModalClose} addImageFile={addImageFile} />
                </CreateMapWrapper>

            </Modal>
            <Spin spinning={loading}>
                <Table dataSource={dataset} columns={columns} />
            </Spin>
        </>

    )
}

export default UnlockedDataset;