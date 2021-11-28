
import { useEffect, useState } from 'react';
import CreateProgressBarWidget from '../Forms/Widgets/CreateProgressBarWidget';
import CreateVideoWidget from '../Forms/Widgets/CreateVideoWidget';
import CreateTextWidget from '../Forms/Widgets/CreateTextWidget';
import CreateNewsFeedWidget from '../Forms/Widgets/CreateNewsFeedWidget';
import { getWidgets,postMethod } from 'lib/api';



const AddWidget = ({ mdcId, token, datasetProperties, selectedDatasetProperties, layerType }) => {
    const [selected, setSelected] = useState(0);
    const [widget, setWidget] = useState([]);


    useEffect(() => {
        setSelected(localStorage.getItem('currentWidget'));
        async function fetchWidget() {
            const response = await getWidgets(mdcId, token);
            if (response) {
                 setWidget(response[0]);
            }
          }

          fetchWidget()
    }, [])

    
    let SelectedView;
    if (selected == 1) {
        SelectedView = <CreateProgressBarWidget mdcId={mdcId} token={token} widget={widget}></CreateProgressBarWidget>
    }
    else if (selected == 2) {
        SelectedView = <CreateVideoWidget widget={widget}></CreateVideoWidget>
    }
    else if (selected == 3) {
        SelectedView = <CreateTextWidget  widget={widget}></CreateTextWidget>
    }
    else if (selected == 4) {
        SelectedView = <CreateNewsFeedWidget widget={widget}></CreateNewsFeedWidget>
    }

    return <div>
        {SelectedView}
    </div>

}



export default AddWidget;









