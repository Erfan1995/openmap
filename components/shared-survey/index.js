import styled from 'styled-components';
import * as Survey from "survey-react"
import { init } from 'components/customer/surveyCompenents/MapWidget';
import "survey-react/survey.css";
import "survey-creator/survey-creator.css";
import { useEffect, useState } from 'react';
import { postMethod } from 'lib/api';
import * as widgets from "surveyjs-widgets";
import { SUREVEY_COLORS } from 'static/constant';
import $ from "jquery";
import "jquery-ui/themes/base/all.css";
import "nouislider/distribute/nouislider.css";
import "bootstrap-slider/dist/css/bootstrap-slider.css";
import "jquery-ui/ui/widgets/datepicker.js";

import "select2/dist/js/select2.js";
import "select2/dist/css/select2.css";


import "icheck/skins/square/blue.css";
import "pretty-checkbox/dist/pretty-checkbox.css";
import "easy-autocomplete/dist/easy-autocomplete.css";


// bar rating 
import "jquery-bar-rating/dist/themes/css-stars.css";
import "jquery-bar-rating/dist/jquery.barrating.min.js";
import "jquery-bar-rating/dist/themes/fontawesome-stars.css";

var defaultThemeColors = Survey.StylesManager.ThemeColors["default"];
defaultThemeColors["$main-color"] = SUREVEY_COLORS.MAIN_HOVER_COLOR;
defaultThemeColors["$main-hover-color"] = SUREVEY_COLORS.MAIN_HOVER_COLOR;
defaultThemeColors["$text-color"] = SUREVEY_COLORS.TEXT_COLOR;
defaultThemeColors["$header-color"] = SUREVEY_COLORS.HEADER_COLOR;
defaultThemeColors["$body-container-background-color"] = SUREVEY_COLORS.BODY_CONTAINER_BACKGROUND_COLOR;
Survey.StylesManager.applyTheme();

const Wrapper = styled.div`
    padding:100px
`

const SharedSurvey = ({ survey, mapId }) => {
    const [json, setJson] = useState([]);
    const [surveyId, setSurveyId] = useState();
    const [userInfo, setUserInfo] = useState();
    init(Survey);

    useEffect(() => {
        window["$"] = window["jQuery"] = $;
        require("emotion-ratings/dist/emotion-ratings.js");
        require("easy-autocomplete/dist/jquery.easy-autocomplete.js");

        // ckeditor
        // const self = this;
        // if (self.alreadyRendered) return;
        const script = document.createElement("script");
        script.src = "https://cdn.ckeditor.com/4.14.1/standard/ckeditor.js";
        document.head.append(script);
        script.onload = function () {
            window.CKEDITOR;
            // self.alreadyRendered = true;
            // if (self.forceUpdate) self.forceUpdate(); // need only for REACT
        };

        widgets.icheck(Survey, $);
        widgets.prettycheckbox(Survey);
        widgets.select2(Survey, $);
        widgets.inputmask(Survey);
        widgets.jquerybarrating(Survey, $);
        widgets.jqueryuidatepicker(Survey, $);
        widgets.nouislider(Survey);
        widgets.select2tagbox(Survey, $);
        widgets.sortablejs(Survey);
        widgets.ckeditor(Survey);
        widgets.autocomplete(Survey);
        widgets.bootstrapslider(Survey);
        widgets.emotionsratings(Survey);

        setSurveyId(survey.id);
        setJson(survey.forms);
        getUserIp();
    }, [survey]);

    // fetches users ip address and location details
    const getUserIp = async () => {
        const res = await fetch('https://ipapi.co/json/')
            .then((res) => res.json())
            .then((data) => {
                setUserInfo(data);
            })
    }
    const onCompleteSurvey = async (data) => {
        let latlng;
        let geometry;
        let properties = data.valuesHash;
        let hasMap = false;
        Object.entries(data.valuesHash).map(value => {
            if (value[1].lat) {
                hasMap = true;
                latlng = [value[1].lng, value[1].lat];
                geometry = { 'type': 'Point', 'coordinates': latlng };
                getAddress(value[1].lat, value[1].lng, geometry, properties);
            }
        })
        if (!hasMap) {
            store(null, properties, '', false);
        }
    }
    
    const store = async (geometry, properties, address, hasMap) => {
        let values = {};
        values.map = mapId;
        values.geometry = geometry;
        values.properties = properties;
        values.survey = surveyId;
        values.address = address;
        values.ip = userInfo?.ip;
        values.is_approved = false;
        try {
            if (hasMap && geometry) {
                const res = await postMethod('mmdpublicusers', values, false);
            }
            if (!hasMap) {
                const res = await postMethod('mmdpublicusers', values, false);
            }
        } catch (e) {
            message.error(e.message)
        }
    }


    const getAddress = async (lat, lng, geometry, properties) => {
        await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&featureTypes=&location=${lng}%2C${lat}`,
            { headers: { 'Accept': 'application/json' } })
            .then((res) => res.json())
            .then((data) => {
                store(geometry, properties, data.address.LongLabel, true);
            });
    }

    return (
        <Wrapper>
            <div>
                <Survey.Survey
                    model={new Survey.Model(json)}
                    showCompletedPage={true}
                    onComplete={data => onCompleteSurvey(data)}
                >
                </Survey.Survey>
            </div>
        </Wrapper>
    )
}
export default SharedSurvey;