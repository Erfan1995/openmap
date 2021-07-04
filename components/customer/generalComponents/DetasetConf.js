import { Tabs } from "antd";
import { DATASET_CONF } from "static/constant";
import MapMarkers from "../mapComponents/MapMarkers";
const { TabPane } = Tabs;
import Popup from "../mapComponents/popup";
const DatasetConf = ({icons}) => {

    return (
        <div>
            <Tabs defaultActiveKey="1">
                <TabPane tab={DATASET_CONF.MARKERS} key="2" >
                   <MapMarkers icons={icons}/>
                </TabPane>
                <TabPane tab={DATASET_CONF.PUPOP} key="3" >
                    <Popup/>
                </TabPane>
            </Tabs>
        </div>

    );

}

export default DatasetConf;