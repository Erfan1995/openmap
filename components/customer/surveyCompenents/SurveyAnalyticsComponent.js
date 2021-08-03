import "survey-analytics/survey.analytics.css";
import * as Survey from "survey-react";
import { data, json } from "./analytics_data";
import { useEffect } from "react";
import { VisualizationPanel } from "survey-analytics";

const SurveyAnalyticsComponent = () => {
    let visPanel;
    useEffect(() => {
        const survey = new Survey.SurveyModel(json);
        visPanel = new VisualizationPanel(survey.getAllQuestions(), data);
        visPanel.render(document.getElementById("summaryContainer"));
    })
    return (
        <div id="summaryContainer">
        </div>
    )
}
export default SurveyAnalyticsComponent;