import { getStrapiMedia } from "lib/media";
import styles from "./ProgressbarWidget.module.css";
import styled from 'styled-components';
import { Tooltip, Row } from 'antd';
const ProgressbarWidget = ({ progressbar }) => {
    const Photo = styled.img`
    width:25px;
    height:25px;
    :hover{
        opacity:0.8;
        cursor:pointer;
    }
    `
    const Link = styled.a`
        background-color:${progressbar.progressbarColor} ;
        :after{
            border-left-color: ${progressbar.progressbarColor} ;
        };
    `
    const StepWrapper = styled.div`
    display: inline-block
    `

    const StepTitle = styled.span`
        font-size:9px;
    `
    return progressbar.steps ? <div>
        {progressbar.progressbarStyle === "circle-mode" || !progressbar.progressbarStyle ?
            <div id={styles.circle}>
                <ul>
                    {progressbar.steps?.map((step, i) => {
                        return <li key={i}>
                            <StepWrapper>
                                <Row>
                                    <Link className={step.id <= progressbar.acitveStep ? styles.active : styles.disable}
                                    ><Tooltip title={step?.hover_text}><Photo src={getStrapiMedia(step.icon)}></Photo></Tooltip></Link>
                                </Row>
                                <Row justify="center">
                                    <StepTitle>
                                        {step.title}
                                    </StepTitle>
                                </Row>
                            </StepWrapper>
                        </li>
                    })}
                </ul>
            </div> :
            <div id={styles.flash}>
                <ul>
                    {progressbar.steps?.map((step, i) => {
                        return <li key={i}>
                            <StepWrapper >
                                <Row>
                                    <Link className={step.id <= progressbar.acitveStep ? styles.active : styles.disable}>
                                        <Tooltip title={step.hover_text}><Photo src={getStrapiMedia(step?.icon)}></Photo></Tooltip></Link>
                                </Row>
                                <Row justify="center">
                                    <StepTitle>
                                        {step.title}
                                    </StepTitle>
                                </Row>
                            </StepWrapper>
                        </li>
                    })}
                </ul>
            </div >
        }
    </div> : null;
}
export default ProgressbarWidget