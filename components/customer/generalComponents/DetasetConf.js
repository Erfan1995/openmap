import { Tabs } from "antd";
import { DATASET_CONF } from "static/constant";
const { TabPane } = Tabs;

const DatasetConf = () => {

    return (
        <div>
            <Tabs defaultActiveKey="1">

                <TabPane tab={DATASET_CONF.STYLE} key="2" >
                    this is some text here
                </TabPane>
                <TabPane tab={DATASET_CONF.PUPOP} key="3" >
                    this is some tehhhhhhhhhhhhhxt here
                </TabPane>
            </Tabs>
        </div>

    );

}

export default DatasetConf;