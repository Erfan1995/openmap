
import styles from './stepper.module.css'
import Image from 'next/image';
import { getStrapiMedia } from 'lib/media';
import styled from 'styled-components';
import { style } from '../styles';

const Stepper = ({ steps, onStepClick ,activeStep,color}) => {

    const Photo = styled.img`
        width:20px;
        height:20px;
        :hover{
            opacity:0.8;
            cursor:pointer;
        }
        `

        const Link = styled.a`
        background-color:${color?.color} ;
        :after{
            color: ${color?.color} ;
        };

    `

    return steps ? <div id={styles.crumbs}>
        <ul>
            {steps?.map((step) => {
                return <li><Link className={step.id<=activeStep ? styles.active : styles.disable} href="#1" onClick={() => onStepClick(step)}><Photo src={getStrapiMedia(step.icon)}></Photo></Link></li>
            })}
        </ul>
    </div> : null;
}

export default Stepper;