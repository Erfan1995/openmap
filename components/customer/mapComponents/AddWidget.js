import dynamic from "next/dynamic";
import { useEffect, useState } from 'react';
import CreateProgressBarWidget from '../Forms/Widgets/CreateProgressBarWidget';
import CreateVideoWidget from '../Forms/Widgets/CreateVideoWidget';
// import CreateTextWidget from '../Forms/Widgets/CreateTextWidget';
import CreateNewsFeedWidget from '../Forms/Widgets/CreateNewsFeedWidget';
import { getWidgets, postMethod } from 'lib/api';



const AddWidget = ({ mapId, mdcId, token, layerType }) => {

    const CreateTextWidget = dynamic(() => import("../Forms/Widgets/CreateTextWidget"), {
        ssr: false
    });
    const [selected, setSelected] = useState(0);
    const [widget, setWidget] = useState([]);
    const [progressbars, setProgressbars] = useState();
    const [mdcConf, setMdcConf] = useState();

    useEffect(() => {
        setSelected(localStorage.getItem('currentWidget'));
        async function fetchWidget() {
            let response;
            if (layerType === "main") {
                response = await getWidgets(mdcId, mapId, token, 'surveyProgressbars', 'mapsurveyconf');

            } else if (layerType === "dataset") {
                response = await getWidgets(mdcId, mapId, token, 'datasetProgressbars', 'mapdatasetconf');
                if (response && response?.length !== 0) {
                    setWidget(response?.widgets[0]);
                    setProgressbars(response?.datasetProgressbars);
                    setMdcConf(response?.datasetProgressbars[0]?.mapdatasetconf);
                }
                else {
                    const res = await postMethod('widgets/', { 'map': mapId });
                    if (res) {
                        setWidget(res);
                    }
                }
            }

        }

        fetchWidget();
    }, [mdcId, token])




    let SelectedView;
    if (selected == 1) {
        SelectedView = <CreateProgressBarWidget mdcConf={mdcConf} mdcId={mdcId} progressbar={progressbars} widget={widget} />
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

    return <div>
        {widget !== null ? SelectedView : <div></div>}
    </div>

}



export default AddWidget;









