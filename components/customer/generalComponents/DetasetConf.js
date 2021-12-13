import { Tabs } from "antd";
import { DATASET_CONF } from "static/constant";
import MapMarkers from "../mapComponents/MapMarkers";
import MapLisTab from "../mapComponents/MapListTab";
const { TabPane } = Tabs;
import Popup from "../mapComponents/popup";
const DatasetConf = ({ setListClicked, icons, mdcId, selectedDIcons, datasetProperties, selectedDatasetProperties,selectedWidgets,mapId,
    listviewProperties, listviewEditedProperties, layerType, editedProperties, setDataset, onMapDataChange,selectedProgressbar,
    changeSelectedIcons, token }) => {

    const onEdit = () => {
        setListClicked();
    }

    return (
        <div>
            <Tabs defaultActiveKey="1">
                <TabPane tab={DATASET_CONF.MARKERS} key="2" >
                    <MapMarkers onMapDataChange={onMapDataChange} icons={icons} setDataset={setDataset} mdcId={mdcId} selectedDIcons={selectedDIcons}
                        layerType={layerType} changeSelectedIcons={changeSelectedIcons} />
                </TabPane>
                <TabPane tab={DATASET_CONF.PUPOP} key="3" >
                    <Popup mdcId={mdcId} onMapDataChange={onMapDataChange} setDataset={setDataset}
                        properties={datasetProperties} editedProperties={editedProperties}
                        selectedDatasetProperties={selectedDatasetProperties} layerType={layerType} token={token} />
                </TabPane>
                <TabPane tab="List" key="4">
                    <MapLisTab onEdit={onEdit} mdcId={mdcId} selectedProgressbar={selectedProgressbar} properties={datasetProperties} 
                        editedListViewProperties={listviewEditedProperties}  onMapDataChange={onMapDataChange} selectedWidgets={selectedWidgets} listviewProperties={listviewProperties}
                        token={token} layerType={layerType} mapId={mapId} />
                </TabPane>
            </Tabs>
        </div>

    );

}

export default DatasetConf;