import { getStrapiMedia } from "lib/media";
import styles from "./progressbar.module.css";
import styled from 'styled-components';
import { Tooltip } from 'antd';

const Progressbar = ({ progressbar }) => {
    console.log(progressbar);
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
    return progressbar.steps ? <div>
        {progressbar.progressbarStyle === "circle-mode" || !progressbar.progressbarStyle ?
            <div id={styles.circle}>
                <ul>
                    {progressbar.steps?.map((step) => {
                        return <li><Link className={step.id <= progressbar.acitveStep ? styles.active : styles.disable}
                        ><Tooltip title={step?.hover_text}><Photo src={getStrapiMedia(step.icon)}></Photo></Tooltip></Link></li>
                    })}
                </ul>
            </div> :
            <div id={styles.flash}>
                <ul>
                    {progressbar.steps?.map((step) => {
                        return <li>
                            <Link className={step.id <= progressbar.acitveStep ? styles.active : styles.disable}>
                                <Tooltip title={step.hover_text}><Photo src={getStrapiMedia(step?.icon)}></Photo></Tooltip></Link>
                        </li>
                    })}
                </ul>
            </div >
        }
    </div> : null;
}
export default Progressbar;