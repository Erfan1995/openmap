import { List } from 'antd';
import styled from 'styled-components';

const StyleWrapper = styled.div`
border: 1px solid #eeeeee;
 border-radius: 5px;
 &:hover{
  border:1px solid #5bc0de;
  cursor:pointer
 }
`;
const Image = styled.img`
border-radius: 5px 0 0 5px;
 margin-right: 20px;
`;
const StyledMaps = ({changeStyle,mapData}) => {

    return (
        <List
            itemLayout="vertical"
            dataSource={mapData}
            renderItem={(item) => (
                <List.Item>
                    <StyleWrapper onClick={() => { changeStyle(item) }}>
                        <Image src={`${process.env.NEXT_PUBLIC_MAPBOX_API_URL}/styles/v1/mbshaban/${item.id}/static/-87.0186,32.4055,10/80x70?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`} alt={item.name} />
                        {item.name}
                    </StyleWrapper>
                </List.Item>
            )}
        />
    );
};

export default StyledMaps;
