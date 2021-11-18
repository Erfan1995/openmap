import { Card,List,Row } from "antd"
import { InfoCircleFilled,ClockCircleOutlined } from "@ant-design/icons"
import styled from "styled-components"


  const Title=styled.div`
    width: 100%; 
    background-color: #542344;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    color:white;
    padding:10px;
    font-size:20px
  `;

  const ItemTitle=styled.div`
      color: #702959
  `;

  const ItemDescription=styled.div`
      color: red
  `;

  const SocialWidget = ({data}) => {
    return <Card
      bodyStyle={{ padding: '0px 10px 10px 10px' }}
      style={{
        width: 300,
        marginTop: 10,
        border: '1px solid #ddd',
        borderTopRightRadius: 5, borderTopLeftRadius: 5,
        boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)",
      }}
      cover={
        <Title>
          Recent blog posts
        </Title>
      }
    >


      <div style={{ height: 150, overflowY: 'scroll' }}>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                description={
                  <div>
                    <Row>
                      <InfoCircleFilled style={{ fontSize: 20, color: '#00b0ff' }} />
                    </Row>
                    <Row><ItemTitle>Focus 500</ItemTitle></Row>
                    <Row> <ItemDescription>{item}</ItemDescription></Row>
                    <p><ClockCircleOutlined style={{ fontSize: 12 }} /> Last Week</p>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </div>

    </Card>
  }



export default SocialWidget