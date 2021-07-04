const MapConf = () => {
    const changeStyle = (item) => {
        setStyleID(item.id);
    }
    const chooseDataset = async () => {
        setLoading(true);
        let res = await getDatasets({ users: authenticatedUser.id }, token);
        setLoading(false);
        if (res) {
            let finalDatasets = [];
            let i = 0;
            res.forEach(element => {
                element.size = fileSizeReadable(element.size);
                element.title = element.title.split(".")[0];
                element.updated_at = formatDate(element.updated_at);
                element.key = element.id;
                finalDatasets[i] = element;
                i++;
            });
            setDatasets(finalDatasets);
        }
        setModalVisible(true)
    }
    const addSelectedDataset = async (selectedRow) => {
        let alreadyExist = false;
        selectedDataset.map((dd) => {
            if (dd.id === selectedRow.id) {
                alreadyExist = true;
            }
        })

        if (alreadyExist === false) {
            setLoading(true);
            selectedDataset.push(selectedRow);
            try {
                const res = await putMethod(`maps/${mapData.id}`, { datasets: selectedDataset.map(item => item.id) });
                if (res) {
                    setModalVisible(false);
                    message.success(DATASET.SUCCESS);
                }
            } catch (e) {
                setLoading(false);
                message.error(e);
            }
            setLoading(false);
        } else {
            message.error(DATASET.DUPLICATE_DATASET);
        }
    }
    const onModalClose = (res) => {
        router.push({
            pathname: 'maps'
        })

    }
    const addImageFile = (file) => {
        setFile(file);
    }

    function showConfirm(id) {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <p>{DATASET.DELETE_CONFIRM}</p>,
            onOk() {
                deleteDataset(id)
            },
            onCancel() {
            },
        });
    }


    const deleteDataset = async (id) => {
        setLoading(true);
        const dd = selectedDataset.filter(dData => dData.id !== id)
        try {
            const res = await putMethod(`maps/${mapData.id}`, { datasets: dd.map(item => item.id) });
            if (res) {
                setSelectedDataset(dd);
                message.success(DATASET.SUCCESS);
            }
        } catch (e) {
            setLoading(false);
            message.error(e);
        }
        setLoading(false);
    }

    return (
        <Tabs defaultActiveKey="1">
            <TabPane tab={DATASET.META_DATA} key="1" >
                <CreateMap ref={childRef} mapData={mapData} serverSideTags={tags} user={authenticatedUser} onModalClose={onModalClose} addImageFile={addImageFile} />
            </TabPane>

            <TabPane tab={DATASET.MAP_STYLE} key="2" >
                <StyledMaps
                    changeStyle={changeStyle}
                    mapData={styledMaps}
                />

            </TabPane>
            <TabPane tab={DATASET.LAYERS} key="3" >
                <Button type="dashed" size='large' block onClick={() => chooseDataset()}>
                    {DATASET.ADD_NEW_LAYER}
                </Button>
                <Modal
                    title={DATASET.CHOOSE_DATASET}
                    centered
                    width={700}
                    visible={modalVisible}
                    destroyOnClose={true}
                    footer={[
                        <Button key="close" onClick={() => { setModalVisible(false) }}> {DATASET.CLOSE}</Button>
                    ]}
                    destroyOnClose={true}
                >
                    <SelectNewMapDataset datasets={datasets} ref={selectDatasetChildRef} addSelectedDataset={addSelectedDataset} />
                </Modal>
                <List
                    className='margin-top-10'
                    size="default"
                    bordered
                    dataSource={selectedDataset}
                    renderItem={item => (
                        <List.Item className='margin-top-10' actions={[<a onClick={() => showConfirm(item.id)} ><span><DeleteTwoTone twoToneColor="#eb2f96" /></span></a>]}>
                            <List.Item.Meta title={item.title.split(".")[0]} />
                        </List.Item>
                    )}
                />
            </TabPane>
        </Tabs>


    );

}

export default MapConf;