
import styles from './breadcrumb.module.css'
import { getStrapiMedia } from 'lib/media';
import styled from 'styled-components';
const BreadCrumb = ({ steps, onStepClick, color, activeStep }) => {
    
    const Photo = styled.img`
        width:20px;
        height:20px;
        :hover{
            opacity:0.8;
            cursor:pointer;
        }
        `

    const Link = styled.a`
        background-color:${color} ;
        :after{
            border-left-color: ${color} ;
        };
    `

    return steps ? <div id={styles.crumbs}>
        <ul>
            {steps?.map((step) => {

                return <li><Link href="#1" className={step.id<=activeStep ? styles.active : styles.disable}  onClick={() => onStepClick(step)}><Photo src={getStrapiMedia(step?.icon)}></Photo></Link></li>
            })}
    </ul>
    </div > : null;
}

export default BreadCrumb;