import { Row, Col, Spin, Button, Modal, Menu, List, Dropdown } from "antd";
import {  deleteMethod } from "lib/api";
import { useState, useRef } from "react";
import styled from 'styled-components';
import { DATASET } from '../../../../static/constant';
import {  ExclamationCircleOutlined } from '@ant-design/icons';
import dynamic from "next/dynamic";
const { confirm } = Modal;

const code1 = `function add(a, b) {
    return a + b;
  }
  `;

const InjectedCodesWrapper = styled.div`
border: 1px solid #eeeeee;
 border-radius: 5px;
 width:100%;
 height:70px;
`;
const InjectedCodeDeleteButton = styled.span`
    font-size:20px;
    font-weight:bold;
    &:hover{
        font-size:22px;
    }
    padding:4px;
`;
const InjectedCodeName = styled.p`
    &:hover{
        text-decoration:underline;
        cursor:pointer;
    }
    margin-top:23px;
    margin-left:10px;
`;
const InjectCode = ({ mapData, injectedcodes }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [injectedCode, setInjectedCodes] = useState(injectedcodes);
  const [injectedCodeId, setInjectedCodeId] = useState();
  const [loading, setLoading] = useState(false);
  const [editableCode, setEditableCode] = useState([]);
  const [displayCode, setDisplayCode] = useState();


  const InjectCodeForm = dynamic(() => import("./injectCodeForm"), {
    ssr: false
  });



  const childRef = useRef();

  const onModalClose = (res, actionType) => {
    setModalVisible(false);
    if (actionType === "store") {
      setInjectedCodes([...injectedCode, res]);
    } else if (actionType === "edit") {
      let arr = [];
      for (let i = 0; i < injectedCode.length; i++) {
        if (injectedCode[i].id === res.id) {
          arr[i] = res;
        } else {
          arr[i] = injectedCode[i];
        }
      }
      setInjectedCodes(arr);
    }
  }
  const menu = (
    <Menu >
      <Menu.Item key="1" style={{ padding: "5px 20px" }}><a onClick={() => showConfirm()} >{DATASET.DELETE}</a></Menu.Item>
      <Menu.Item key="2" style={{ padding: "5px 20px" }}><a onClick={() => editInjectedCode()} >{DATASET.EDIT}</a></Menu.Item>
    </Menu>
  );
  function showConfirm() {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <p>{DATASET.DELETE_CONFIRM}</p>,
      onOk() {
        deleteInjectedCode()
      },
      onCancel() {
      },
    });
  }
  const deleteInjectedCode = async () => {
    setLoading(true)
    const res = await deleteMethod('injectedcodes/' + injectedCodeId)
    if (res) {
      const dd = injectedCode.filter(dData => dData.id !== res.id);
      setInjectedCodes(dd);
      setLoading(false)
    }
  }
  const editInjectedCode = () => {
    const data = injectedCode.filter(edata => edata.id === injectedCodeId);
    setEditableCode(data[0]);
    setDisplayCode(false);
    setModalVisible(true);
  }
  const addInjectedCode = () => {
    setEditableCode();
    setDisplayCode(false);
    setModalVisible(true);
  }
  const displayInjectedCode = (code) => {
    setDisplayCode(true);
    setEditableCode(code);
    setModalVisible(true);
  }


  

  return (
    <Spin spinning={loading}>
      <Button type="dashed" size='large' block onClick={() => addInjectedCode()} >
        {DATASET.INJECT_CODE}
      </Button>
      <Modal
        centered
        width={700}
        visible={modalVisible}
        destroyOnClose={true}
        title={'Inject code'}
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
      
        <InjectCodeForm ref={childRef} onModalClose={onModalClose} id={mapData.id} editableCode={editableCode}
          displayCode={displayCode} setModalVisible={setModalVisible} />
      </Modal>

      <List
        dataSource={injectedCode}
        renderItem={item => (
          <List.Item>
            <InjectedCodesWrapper >
              <Row>
                <Col span={21}>
                  <InjectedCodeName onClick={() => displayInjectedCode(item)}>{item.title}</InjectedCodeName>
                </Col>
                <Col span={3}>
                  <div style={{ marginTop: "13px", padding: "4px" }}>
                    <Dropdown size="big" overlay={menu} trigger={['click']} >
                      <a className="ant-dropdown-link"
                        onClick={(e) => {
                          setInjectedCodeId(item.id);
                        }} >
                        <InjectedCodeDeleteButton>:</InjectedCodeDeleteButton>
                      </a>
                    </Dropdown>
                  </div>
                </Col>
              </Row>
            </InjectedCodesWrapper>
          </List.Item>
        )}
      />
    </Spin>
  );
};

export default InjectCode;
