import dynamic from "next/dynamic";
import { useEffect, useState } from 'react';
import CreateProgressBarWidget from '../Forms/Widgets/CreateProgressBarWidget';
import CreateVideoWidget from '../Forms/Widgets/CreateVideoWidget';
import CreateNewsFeedWidget from '../Forms/Widgets/CreateNewsFeedWidget';
import { getWidgets, postMethod } from 'lib/api';
import { Spin } from "antd";

const AddWidget = ({ mapId, mdcId, token, layerType }) => {

    const CreateTextWidget = dynamic(() => import("../Forms/Widgets/CreateTextWidget"), {
        ssr: false
    });
    const [selected, setSelected] = useState(0);
    const [widget, setWidget] = useState([]);
    const [progressbars, setProgressbars] = useState();
    const [mdcConf, setMdcConf] = useState();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setSelected(localStorage.getItem('currentWidget'));
        async function fetchWidget() {
            let response;
            if (layerType === "main") {
                response = await getWidgets(mdcId, mapId, token, 'surveyProgressbars', 'mapsurveyconf');
                if (response) {
                    if (response?.widgets.length > 0) {
                        setWidget(response?.widgets[0]);
                    } else {
                        const res = await postMethod('widgets/', { 'map': mapId });
                        if (res) {
                            setWidget(res);
                        }
                    }
                    setProgressbars(response.surveyProgressbars);
                    setMdcConf(response?.surveyProgressbars[0]?.mapsurveyconf);
                    setLoaded(true);

                }

            } else if (layerType === "dataset") {
                response = await getWidgets(mdcId, mapId, token, 'datasetProgressbars', 'mapdatasetconf');
                if (response) {
                    if (response?.widgets.length > 0) {
                        setWidget(response?.widgets[0]);
                    } else {
                        const res = await postMethod('widgets/', { 'map': mapId });
                        if (res) {
                            setWidget(res);
                        }
                    }
                    setProgressbars(response?.datasetProgressbars);
                    setMdcConf(response?.datasetProgressbars[0]?.mapdatasetconf);
                    setLoaded(true);
                }
            }

        }

        fetchWidget();
    }, [mdcId, token])


    let SelectedView = null;
    if (loaded) {
        if (selected == 1) {
            SelectedView = <CreateProgressBarWidget mdcConf={mdcConf} mdcId={mdcId} progressbar={progressbars} layerType={layerType} />
        }
        else if (selected == 2) {
            SelectedView = <CreateVideoWidget widget={widget} />
        }
        else if (selected == 3) {
            SelectedView = <CreateTextWidget widget={widget} />
        }
        else if (selected == 4) {
            SelectedView = <CreateNewsFeedWidget widget={widget} />
        }
    }


    return <div>
        {(loaded && SelectedView !== null) ? SelectedView : <Spin spinning={!loaded}></Spin>}
    </div>

}



export default AddWidget;









