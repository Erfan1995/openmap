import { Slider, Row, Col, Input, Checkbox, Card, List, Spin, Modal } from "antd";
import styled from 'styled-components'
import styles from './Sidebar.module.css'
import ColorPicker from "rc-color-picker";
import "rc-color-picker/assets/index.css";
import { PopUp } from "lib/constants";
import { Scrollbars } from 'react-custom-scrollbars';
import SubTitle from "components/customer/generalComponents/SubTitle";
import { deleteMethod, postFileMethod, putMethod } from "../../../../lib/api";
import { useState } from "react";
const { confirm } = Modal;


const Div = styled.div`
  width:400px;
  padding-left:35px
`

const PopUpContainer = styled.div`
margin-left:35px;

`
const ListWrapper = styled(Row)`
  width: 400px ;
  padding-left:20px;
`
const PopUpCart = styled(Card)`
height: 75px; 
width: 100px; 
padding: 10px;
 margin-left: 10px;
 border-radius:5px;
 border:1px solid #aaa;
 &:hover{
 border:2px solid #228;
 cursor:pointer;

 }
`
const PopuSelectedCard = styled(Card)`
height: 75px; 
width: 100px; 
padding: 10px;
 margin-left: 10px;
 border-radius:5px;
 border:1px solid #aaa;
 border:2px solid #228;
 cursor:pointer;
`

const Popup = ({ mdcId, selectedDataset }) => {
    const [selectedStyle, setSelectedStyle] = useState(false);
    const [loading, setLoading] = useState(false);
    function onChange(checkedValues) {
        console.log('checked = ', checkedValues);
        updateCheckedProperties(checkedValues);

    }
    const updateCheckedProperties = async (checkedValues) => {
        setLoading(true);
        const res = await putMethod('mapdatasetconfs/' + mdcId, { selected_dataset_properties: checkedValues })
        console.log(res);
        setLoading(false);



    }
    const selectPopupStyle = async (item) => {
        setLoading(true);
        setSelectedStyle(true);
        const res = await putMethod('mapdatasetconfs/' + mdcId, { default_popup_style_slug: item.name });
        if (res) {
            console.log(res);

        }
        setLoading(false);
    }
    let options = [];
    let i = 0;
    for (const [key, value] of Object.entries(selectedDataset[0].datasetcontents[0].properties)) {
        options[i] = { 'label': key, "value": key, }
        i++;
    }
    return (
        <Spin spinning={loading}>
            <Row>

                <SubTitle number={1} title={'style'} />
                <PopUpContainer>
                    <Scrollbars style={{ width: 300, height: 100 }} className='track-horizontal'>
                        <ListWrapper>
                            <List
                                dataSource={PopUp}
                                grid={{ gutter: 16, column: 3 }}
                                itemLayout='horizontal'
                                renderItem={item => (
                                    <PopUpCart
                                        cover={<img alt="example" src={item.cover}
                                        />}
                                    />

                                )}
                            />
                        </ListWrapper>
                    </Scrollbars>

                    {/* <Row> */}
                    {/* <Col span={8}>
                        Window Size
                    </Col>
                    <Col span={9}>
                        <Slider
                            min={1}
                            max={20}
                            value={intialValue}
                            onChange={onChange}
                        />
                    </Col>
                    <Col span={4}>
                        <Input
                            min={1}
                            max={20}
                            value={intialValue}
                            onChange={onChange}
                            style={{ margin: '0 16px' }}
                        />
                    </Col> */}
                    {/* </Row> */}

                    {/* <Row>
                    <Col span={8}>
                        Header Color
                    </Col>
                    <Col span={14}>
                        <ColorPicker
                            color={"#36c"}
                            alpha={30}
                            onChange={changeHandler}
                            onClose={closeHandler}
                            placement="topLeft"
                            className="some-class"
                            enableAlpha={false}
                        >
                            <button className="rc-color-picker-trigger"> </button>
                        </ColorPicker>
                    </Col>
                </Row> */}

                </PopUpContainer>

                <SubTitle number={2} title={'Show Items'} />

                <Div>
                    <Row>
                        <Col className="gutter-row" span={18}>All Selected</Col>
                        <Col className="gutter-row" span={6}>NONE</Col>
                    </Row>
                    <br />
                    <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                        {options.map((item) =>
                            <Row key={item.value}>
                                <Col span={8}>
                                    <Checkbox value={item.value}>{item.label}</Checkbox>
                                </Col>
                            </Row>
                        )}
                    </Checkbox.Group>
                </Div>
            </Row>
        </Spin>
    )

}

export default Popup
