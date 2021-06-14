import { Col, Row, List, Typography, Skeleton, Avatar, message } from "antd";
import { fetchApi } from "lib/api";
import { useEffect, useState } from "react";
const count = 4;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat&noinfo`;
const { Title } = Typography;
import LayoutPage from "components/client/layout";
import dynamic from "next/dynamic";

export default function Home() {

    const [initLoading, setInitLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [list, setList] = useState([]);


    useEffect(() => {
        setLoading(true);
        getData();
    }, [])


    const MapWithNoSSR = dynamic(() => import("../../components/map/mapImage"), {
        ssr: false
    });

    const getData = async () => {
        try{
            const  res= await fetch(fakeDataUrl);
            const fakeData=await res.json();
            setInitLoading(false);
            setLoading(false);
            setList(fakeData.results);
            setData(fakeData.results);
        }catch(ex){
          message.info(ex.message);
        }
        
    };

    return (

        <LayoutPage>
            <MapWithNoSSR style={{height:'100vh'}} />
            <div className='news-relay' >
                <Row gutter={[20, 20]}>
                    <Col className='text-center newslist-wrapper' xs={24} sm={24} md={12} lg={14} xl={16}>
                        <List
                            className="demo-loadmore-list"
                            // loading={initLoading}
                            itemLayout="horizontal"
                            // loadMore={loadMore}
                            dataSource={list}
                            renderItem={item => (
                                <List.Item className="news-list-item"                           >
                                    <Skeleton avatar title={false} loading={loading} active>
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                            }
                                            title={<a href="https://ant.design">{item.name.last}</a>}
                                            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                        />
                                    </Skeleton>
                                </List.Item>
                            )}
                        />
                    </Col>
                    <Col className='text-center newsfeed-wrapper' xs={24} sm={24} md={12} lg={10} xl={8}>
                        <List
                            className="newsfeed-list"
                            // loading={initLoading}

                            itemLayout="horizontal"
                            // loadMore={loadMore}
                            header={<Title level={4}>headlines</Title>}
                            dataSource={list}
                            renderItem={item => (
                                <List.Item
                                    extra={
                                        <img
                                            width={80}
                                            alt="logo"
                                            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                        />
                                    }                        >
                                    <Skeleton avatar title={false} loading={loading} active>
                                        <List.Item.Meta

                                            title={<a href="https://ant.design">{item.name.last}</a>}
                                            description=" is refined by Ant UED Team"
                                        />
                                    </Skeleton>
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>

            </div>
        </LayoutPage>

    );
}
