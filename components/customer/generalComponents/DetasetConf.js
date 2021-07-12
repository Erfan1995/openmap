import { Tabs } from "antd";
import { DATASET_CONF } from "static/constant";
import MapMarkers from "../mapComponents/MapMarkers";
const { TabPane } = Tabs;
import Popup from "../mapComponents/popup";
const DatasetConf = ({ icons, mdcId, selectedDIcons, datasetProperties, selectedDatasetProperties, layerType,setDataset,onMapDataChange }) => {
    return (
        <div>
            <Tabs defaultActiveKey="1">
                <TabPane tab={DATASET_CONF.MARKERS} key="2" >
                    <MapMarkers onMapDataChange={onMapDataChange} icons={icons} setDataset={setDataset} mdcId={mdcId} selectedDIcons={selectedDIcons} layerType={layerType} />
                </TabPane>
                <TabPane tab={DATASET_CONF.PUPOP} key="3" >
                    <Popup mdcId={mdcId} onMapDataChange={onMapDataChange} setDataset={setDataset} datasetProperties={datasetProperties} 
                    selectedDatasetProperties={selectedDatasetProperties} layerType={layerType} />
                </TabPane>
            </Tabs>
        </div>

    );

}

export default DatasetConf;