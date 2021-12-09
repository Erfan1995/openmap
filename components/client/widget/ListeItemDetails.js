import { Row, Divider } from "antd";
import styled from "styled-components";
import { timeSince } from "lib/general-functions";
import Progressbar from "./progressbar/progressbar";
const CustomItem = styled.div`
    width:100%;
    border-radius:10px;
    background-color:white;
    padding:30px;
    box-shadow:0 16px 16px hsl(0deg 0% 0% / 0.075);
    height:600px;
`;

const ItemTitle = styled.div`
    font-size:24px;
    font-weight:bold;
`
const Question = styled.div`
    font-size:14px;
    font-weight:bold;
`
const Answer = styled.div`
    font-size: 14px; 
    color:gray;
    overflow: hidden;
    inlineSize: 700px;
`;

const DateTitle = styled.div`
    color:#aaa;
    font-size:12px
`;
const ListItemDetails = ({ item }) => {
    let questionAndAnswers = []
    item.surveyData.map((surveyData) => {
        Object.entries(surveyData).map((data) => {
            questionAndAnswers.push(data);
        })
    })
    return (
        <CustomItem  >
            <Row>
                <DateTitle>
                    {timeSince(new Date(item.pubDate))}
                </DateTitle>
            </Row>
            <Row>
                <ItemTitle>
                    {item.surveyInfo.title}
                </ItemTitle>
            </Row>
            <Row>
                <DateTitle>
                    Kabul, Afghanistan
                </DateTitle>
            </Row>
            <Row>
                <div style={{ paddingLeft: '20px' }}>
                    {item.progressbar.steps.length > 0 && (
                        <Progressbar progressbar={item.progressbar} />
                    )}
                </div>
            </Row>
            <div>
                {questionAndAnswers.map((survey) => {
                    return <div>
                        <Row>
                            <Question>{survey[0]}</Question>
                        </Row>
                        <Row>
                            <Answer style={{}}>{survey[1]}</Answer>
                        </Row>
                        <Divider style={{ width: '100%' }} />

                    </div>
                })}
            </div>
        </CustomItem>
    )
}
export default ListItemDetails;