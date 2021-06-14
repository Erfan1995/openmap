import Layout from '../../components/customer/layout/Layout';
import withPrivateServerSideProps from '../../utils/withPrivateServerSideProps';
import { useRouter } from 'next/router';
import MapItem from 'components/customer/mapComponents/mapListItem';
import { List, Button, Divider, Typography, Modal } from 'antd';
import styled from 'styled-components';
import React, { useState, useRef } from 'react';
import { getMethod } from 'lib/api';
const { Title } = Typography;
import nookies from 'nookies';
import CreateMap from 'components/customer/Forms/CreateMap';
import { DATASET } from '../../static/constant'
const MapsWrapper = styled.div`
background:#ffffff;
padding:20px;
margin:10px;
`;
const AddNew = styled(Button)`
  margin-bottom: 10px;
  float: right !important;
`;
const CardTitle = styled(Title)`
  margin-bottom: 10px;
  float: left !important;
`;
const CreateMapWrapper = styled.div`
background:#ffffff;
padding:20px;
margin:10px;
`;
const Map = ({ authenticatedUser, collapsed, maps, tags, mapData = null }) => {
  const router = useRouter();
  const childRef = useRef();
  const [allMaps, setAllMaps] = useState(maps)
  const [createMapModalVisibl, setCreateMapModalVisible] = useState(false);
  const onModalClose = (res) => {
    setCreateMapModalVisible(false);
    router.push({
      pathname: 'create-map',
      query: { id: res.id }
    })

  }
  const filterDeletedMap = (id) => {
    setAllMaps(allMaps.filter(dData => dData.id !== id))
  }

  return (
    <Layout collapsed={collapsed} user={authenticatedUser}>
      <MapsWrapper  >
        <CardTitle level={4}>
          {DATASET.MAPS}
        </CardTitle>
        <AddNew type='primary' onClick={() => setCreateMapModalVisible(true)}>{DATASET.ADD_NEW}</AddNew>
        <Modal
          title="Create Map"
          centered
          visible={createMapModalVisibl}
          onOk={() => childRef.current.createMap()}
          destroyOnClose={true}
          onCancel={() => setCreateMapModalVisible(false)}>
          <CreateMapWrapper>
            <CreateMap ref={childRef}
              mapData={mapData} serverSideTags={tags} user={authenticatedUser} onModalClose={onModalClose} />
          </CreateMapWrapper>
        </Modal>
        <Divider />
        <List
          pagination={true}
          grid={{
            gutter: 10,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 5,
            xxl: 6
          }}
          dataSource={allMaps}
          renderItem={(item) => (
            <List.Item key={`listItem` + item.id}>
              <MapItem
                item={item} filterDeletedMap={filterDeletedMap}
              />
            </List.Item>
          )}
        />
      </MapsWrapper>
    </Layout>
  )
}
export const getServerSideProps = withPrivateServerSideProps(
  async (ctx, verifyUser) => {
    try {
      const { token } = nookies.get(ctx);
      const res = await getMethod(`maps?_sort=updated_at:DESC&_where[0][users.id]=${verifyUser.id}`, token);
      const tags = await getMethod('tags', token);

      let mapData = null;

      return { props: { authenticatedUser: verifyUser, maps: res, tags: tags } }
    } catch (error) {
      return {
        redirect: {
          destination: '/server-error',
          permanent: false,
        },
      }
    }
  },
);
export default Map;