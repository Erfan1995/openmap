
import styles from './stepper.module.css'
import { getStrapiMedia } from 'lib/media';
import styled from 'styled-components';
import { Tooltip } from 'antd';
const Stepper = ({ steps, onStepClick ,activeStep,color}) => {

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

    return steps ? <div id={styles.crumbs}>
        <ul>
            {steps?.map((step) => {
                return <li><Link className={step.id<=activeStep ? styles.active : styles.disable} href="#1" onClick={() => onStepClick(step)}><Tooltip title={step?.hover_text}><Photo src={getStrapiMedia(step.icon)}></Photo></Tooltip></Link></li>
            })}
        </ul>
    </div> : null;
}

export default Stepper;