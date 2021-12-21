import { Card, List, Row, message } from "antd"
import { InfoCircleFilled, ClockCircleOutlined } from "@ant-design/icons"
import styled from "styled-components"
import { useState, useEffect } from "react";
import { timeSince } from "lib/general-functions";


const Title = styled.div`
    width: 100%; 
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    color:white;
    padding:10px;
    font-size:20px
  `;

const ItemTitle = styled.div`
      color: #702959
  `;

const ItemDescription = styled.div`
      color: red;
      iniline-size:200px;
      overflow: hidden;
  `;

const SocialWidget = ({ newsFeedWidget }) => {
  const [articles, setArticles] = useState();
  const mediumRssFeed = "https://api.rss2json.com/v1/api.json?rss_url=" + newsFeedWidget.rss_feed;
  const MAX_ARTICLES = 10;
  useEffect(() => {
    getRSSFeed();
    return () => {
      setArticles([]);
    };
  }, [MAX_ARTICLES]);
  const getRSSFeed = async () => {
    await fetch(mediumRssFeed, { headers: { 'Accept': 'application/json' } })
      .then((res) => res.json())
      .then((data) => data.items.filter((item) => item.title.length > 0))
      .then((newArticles) => newArticles.slice(0, MAX_ARTICLES))
      .then((articles) => {
        setArticles(articles);
      })
      .catch((error) => {
        message.error(error);
        setArticles([]);
      });
  }
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
      <Title style={{ background: newsFeedWidget.color ? newsFeedWidget.color : '#542344' }}>
        {newsFeedWidget.title}
      </Title>
    }
  >


    <div style={{ height: 150, overflowY: 'scroll' }}>
      <List
        itemLayout="horizontal"
        dataSource={articles}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              description={
                <div>
                  <Row>
                    <InfoCircleFilled style={{ fontSize: 20, color: '#00b0ff' }} />
                  </Row>
                  <Row><ItemTitle>{item.title}</ItemTitle></Row>
                  <Row> <ItemDescription>{item.description}</ItemDescription></Row>
                  <p><ClockCircleOutlined style={{ fontSize: 12 }} /> {timeSince(new Date(item.pubDate))}</p>
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