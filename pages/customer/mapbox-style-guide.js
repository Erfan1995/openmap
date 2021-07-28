import styled from 'styled-components';
import { Divider } from 'antd';
import { getStrapiMedia } from '../../lib/media';
const Wrapper = styled.div`
   
   

`;

const MapboxStyleGuide = () => {
    return (
        <div style={{ marginLeft: "auto", marginRight: "auto", width: "900px", padding: "100px 0px" }}  >
            <p style={{ fontSize: "25px", fontWeight: "bold" }}>Add a Mapbox style to OPENMAP</p>
            <p style={{ fontSize: "20px" }}>You can create mapbox style in mapbox studio and use it in your map.</p>
            <Divider />
            <p style={{ fontSize: "25px", fontWeight: "bold", marginTop: "15px" }}>Getting Started</p>
            <p>For this guide, you'll need a Mapbox account and an OPENMAP account. Log in to each, then head on to the next steps.</p>
            <p style={{ fontSize: "20px", fontWeight: "bold", marginRight: "230px" }}>Add style created with Studio</p>
            <p>In Mapbox Studio, click the <strong>Share</strong> button next to the style you would like to add to your
                <strong> OPENMAP </strong>  project.</p>
            <img style={{ width: "100%" }} src="/chooseStyle.JPG" />

            <p style={{ paddingTop: "15px" }}>When the <strong>Share</strong> modal opens, scroll down to the
                <strong> Developer Resources</strong> and Click the <strong>
                    Third party</strong> option, and toggle to <strong>CARTO</strong>. Copy the URL by clicking the save button.</p>
            <p>You can follow the steps according to the following picture!</p>
            <img style={{ width: "100%" }} src="/guidanceImage.jpg" />
            <p style={{ marginTop: "20px" }}>Back in OPENMAP, paste the Share URL you copied in the previous step into the text box,
                then click on <strong>OK</strong>.</p>
            <img style={{ width: "100%", marginTop: "20px" }} src="/styleMapDialog.JPG" />
        </div>
    )
}

export default MapboxStyleGuide;
