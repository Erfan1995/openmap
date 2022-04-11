
import styles from './stepper.module.css'
import { getStrapiMedia } from 'lib/media';
import styled from 'styled-components';
import { Tooltip,Row } from 'antd';
const Stepper = ({ steps, onStepClick, activeStep, color }) => {

    const Photo = styled.img`
        width:25px;
        height:25px;
        :hover{
            opacity:0.8;
            cursor:pointer;
        }
        `

    const Link = styled.a`
        background-color:${color}  ;
        :after{
            color: ${color} ;
        };

    `

    const StepWrapper=styled.div`
        display: inline-block
    `

    const StepTitle=styled.span`
        font-size:9px
    `

    return steps ? <div id={styles.crumbs}>
        <ul>
            {steps?.map((step) => {
                return <li>
                    <StepWrapper>
                        <Row>
                            <Link className={step.id <= activeStep ? styles.active : styles.disable} href="#1" onClick={() => onStepClick(step)}>
                            <Tooltip title={step?.hover_text}><Photo src={getStrapiMedia(step.icon)}></Photo></Tooltip>
                        </Link>
                        </Row>
                        <Row>
                            <StepTitle>{step.title}</StepTitle>
                        </Row>
                    </StepWrapper>
                </li>
            })}
        </ul>
    </div> : null;
}

export default Stepper;