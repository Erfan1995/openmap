import dynamic from "next/dynamic";
import { useEffect, useState } from 'react';
import CreateProgressBarWidget from '../Forms/Widgets/CreateProgressBarWidget';
import CreateVideoWidget from '../Forms/Widgets/CreateVideoWidget';
// import CreateTextWidget from '../Forms/Widgets/CreateTextWidget';
import CreateNewsFeedWidget from '../Forms/Widgets/CreateNewsFeedWidget';
import { getWidgets, postMethod } from 'lib/api';



const AddWidget = ({ mapId, token, layerType }) => {

    const CreateTextWidget = dynamic(() => import("../Forms/Widgets/CreateTextWidget"), {
        ssr: false
    });
    const [selected, setSelected] = useState(0);
    const [widget, setWidget] = useState([]);

    useEffect(() => {
        setSelected(localStorage.getItem('currentWidget'));
        async function fetchWidget() {
            const response = await getWidgets(mdcId, token);
            if (response && response?.length !== 0) {
                setWidget(response[0]);
            }
            else {
                const res = await postMethod('widgets/', { 'map': mapId });
                if (res) {
                    setWidget(res);
                }
            }
        }

        fetchWidget();
    }, [mdcId, token])




    let SelectedView;
    if (selected == 1) {
        SelectedView = <CreateProgressBarWidget widget={widget}></CreateProgressBarWidget>
    }
    else if (selected == 2) {
        SelectedView = <CreateVideoWidget widget={widget}></CreateVideoWidget>
    }
    else if (selected == 3) {
        SelectedView = <CreateTextWidget widget={widget}></CreateTextWidget>
    }
    else if (selected == 4) {
        SelectedView = <CreateNewsFeedWidget widget={widget}></CreateNewsFeedWidget>
    }

    return <div>
        {widget !== null ? SelectedView : <div></div>}
    </div>

}



export default AddWidget;









