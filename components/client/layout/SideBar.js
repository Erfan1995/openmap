import { Layout, Button, Typography, Divider, Radio, Checkbox } from "antd";
import React, { useEffect, useRef, useState } from 'react';
import { MenuOutlined } from '@ant-design/icons';
import styled from 'styled-components'
import { useRouter } from "next/router";
const { Sider } = Layout;
const { Title } = Typography;
import { MAP } from 'static/constant'
import { getStrapiMedia } from '../../../lib/media'

const ParentWrapper = styled.div`
 width:100%;
 margin-top:40px;
`

const ChildWrapper = styled.div`
 width:100%;
 padding:5px 30px;
`

const Photo = styled.img`
  // width:100%;
  height:120px;
  margin-bottom:20px;
`
const StyledCheckBox = styled(Checkbox)`
  margin-bottom:20px;
  font-weight:500;
`
const StyledButton = styled(Button)`
 background:#000000;
 margin:10px;
 width:180px;

`
const ButtonWrapper = styled.div`
text-align:center;

`
const NeedHelp = styled.div`
position:fixed;
bottom:20px;
left:30px;
`

const SideBar = ({ siderCollapsed, toggle, datasets, onDataSetChange, mapInfo }) => {
  const router = useRouter();
  let firstMounted = useRef(false);
  const [checkedList, setCheckedList] = useState(datasets.map((item) => (item.id)));

  const onLayerChange = list => {
    setCheckedList(list);
    onDataSetChange(list);
  };

  useEffect(() => {
    firstMounted.current = true;
  });


  return (
    <Sider className="site-layout-sider"
      trigger={null}
      collapsible
      collapsed={siderCollapsed}
      collapsedWidth={0}
      width={300}
      theme='light'
      breakpoint="md"
      onBreakpoint={(collapsed) => {
        firstMounted.current && toggle(collapsed);
      }}
    >        <Button shape="circle" onClick={toggle} className='web-trigger'><MenuOutlined
    /></Button>

      <ParentWrapper>
        <ChildWrapper>
          <Photo src={getStrapiMedia(mapInfo.logo)} />
          <Title>
            {mapInfo.title}
          </Title>
          <Title level={2}>
            {mapInfo.subtitle}
          </Title>
        </ChildWrapper>
        <Divider />
        <ChildWrapper >
          <Title level={5}>
            Layers
          </Title>
          <Checkbox.Group options={datasets.map((item) => ({ label: item.title, value: item.id }))} value={checkedList} onChange={onLayerChange} />
        </ChildWrapper>
        <Divider />
        {/* <ChildWrapper >
          <Title style={{ textAlign: "center" }} level={5}>Can you add to our map?</Title>
          <ButtonWrapper>
            <StyledButton type="primary" shape="round" size={'large'}>

              Button</StyledButton>
          </ButtonWrapper>
        </ChildWrapper> */}
      </ParentWrapper>
      <NeedHelp>
        <a href={mapInfo.link} target="_blank" rel="noopener noreferrer">Need Help?</a>
      </NeedHelp>
    </Sider>
  )
};
export default SideBar;