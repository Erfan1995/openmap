
import styles from './breadcrumb.module.css'
import Image from 'next/image';
import { getStrapiMedia } from 'lib/media';
import styled from 'styled-components';

const BreadCrumb = ({steps}) => {

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
            {steps?.map((step)=>{
                console.log('step '+step.icon[0].url);
            return <li><a href="#1"><Photo src={getStrapiMedia(step.icon[0])}></Photo></a></li>
            })}
        </ul>
    </div>: null;
}

export default BreadCrumb;