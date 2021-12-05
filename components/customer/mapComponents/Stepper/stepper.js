
import styles from './stepper.module.css'
import Image from 'next/image';
import { getStrapiMedia } from 'lib/media';
import styled from 'styled-components';

const Stepper = ({ steps, onStepClick }) => {

    const Photo = styled.img`
        width:20px;
        height:20px;
        :hover{
            opacity:0.8;
            cursor:pointer;
        }
        `

    return steps ? <div id={styles.crumbs}>
        <ul>
            {steps?.map((step) => {
                return <li><a href="#1" onClick={() => onStepClick(step)}><Photo src={getStrapiMedia(step?.icon)}></Photo></a></li>
            })}
        </ul>
    </div> : null;
}

export default Stepper;