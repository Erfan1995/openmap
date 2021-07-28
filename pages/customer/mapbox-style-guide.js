import styled from 'styled-components';
import { Divider } from 'antd';
import { getStrapiMedia } from '../../lib/media';
const Wrapper = styled.div`
    text-align:center;
    padding:30px;
    
`;

const MapboxStyleGuide = () => {
    return (
        <Wrapper >
            <div style={{ width: "700px" }}>
                <p style={{ fontSize: "30px", fontWeight: "bold" }}>Add a Mapbox style to a OPENMAP</p>
                <p style={{ fontSize: "20px" }}>You can create mapbox style in mapbox studio and use it in your map</p>
                <br />
                <Divider />
                <p style={{ fontSize: "25px", fontWeight: "bold", marginRight: "230px" }}>Getting Started</p>
                <br />
                <p>For this guide, you'll need a Mapbox account and a OPENMAP account. Log in to each, then head on to the next steps.</p>
                <p style={{ fontSize: "20px", fontWeight: "bold", marginRight: "230px" }}>Add style created with Studio</p>
                <img src='metamask-big.png' />
                <p>In Mapbox Studio, click the <strong>Share</strong> button next to the style you would like to add to your CARTO project.</p>

                <p>When the <strong>Share &amp; use</strong> modal opens, switch to the <strong>Use</strong> tab. Click the <strong>
                    Third party</strong> option, and toggle to <strong>CARTO</strong>. Copy the URL by clicking the</p>
            </div>
        </Wrapper>
    )
}

export default MapboxStyleGuide;
