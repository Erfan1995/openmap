import { getStrapiMedia } from "lib/media";
import styles from "./progressbar.module.css";
import styled from 'styled-components';

const Progressbar = ({ progressbar }) => {
    console.log(progressbar);
    const Photo = styled.img`
    width:20px;
    height:20px;
    :hover{
        opacity:0.8;
        cursor:pointer;
    }
    `

    const Link = styled.a`
        background-color:#006400 ;
        :after{
            color: gray ;
        };

    `
    return progressbar.steps ? <div id={styles.circle}>
        <ul>
            {progressbar.steps?.map((step) => {
                return <li><Link href="#1" ><Photo src={getStrapiMedia(step.icon)}></Photo></Link></li>
            })}
        </ul>
    </div> : null;
}
export default Progressbar;