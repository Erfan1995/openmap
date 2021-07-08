import { Slider, Row, Col, Input, Checkbox, Card, List, Spin, Modal, Divider } from "antd";
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
const CheckboxGroup = Checkbox.Group;

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

const Popup = ({ mdcId, datasetProperties, selectedDatasetProperties, layerType }) => {
    const [selectedStyle, setSelectedStyle] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkedList, setCheckedList] = useState(selectedDatasetProperties);
    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAll, setCheckAll] = useState(false);
    let options = [];
    if (layerType === "dataset") {
        let i = 0;
        for (const [key, value] of Object.entries(datasetProperties)) {
            options[i] = key;
            i++;
        }
    } else if (layerType === "main") {
        options = datasetProperties;
    }
    const onChange = list => {
        setCheckedList(list);
        updateCheckedProperties(list);
        setIndeterminate(!!list.length && list.length < options.length);
        setCheckAll(list.length === options.length);
    };
    const updateCheckedProperties = async (checkedValues) => {
        setLoading(true);
        if (layerType === "dataset") {
            const res = await putMethod('mapdatasetconfs/' + mdcId, { selected_dataset_properties: checkedValues });

        } else if (layerType === "main") {
            const res = await putMethod('maps/' + mdcId, { mmd_properties: checkedValues });
        }
        setLoading(false);
    }
    const onCheckAllChange = e => {
        setCheckedList(e.target.checked ? options : []);
        if (e.target.checked) {
            updateCheckedProperties(options);
        } else {
            updateCheckedProperties([]);
        }
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    };
    const selectPopupStyle = async (item) => {
        setLoading(true);
        if (layerType === "dataset") {
            setSelectedStyle(true);
            const res = await putMethod('mapdatasetconfs/' + mdcId, { default_popup_style_slug: item });
            if (res) {
                console.log(res);

            }
        } else if (layerType === "main") {
            console.log(item);
            const res = await putMethod('maps/' + mdcId, { default_popup_style_slug: item })
            if (res) {
                console.log(res);
            }
        }
        setLoading(false);
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
                                    <PopUpCart onClick={() => selectPopupStyle(item.name)}
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
                    <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                        Check all
                    </Checkbox>
                    <Divider />
                    <CheckboxGroup options={options} value={checkedList} onChange={onChange} />
                    {/* <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                        {options.map((item) =>
                            <Row key={item.value}>
                                <Col span={8}>
                                    <Checkbox value={item.value}>{item.label}</Checkbox>
                                </Col>
                            </Row>
                        )}
                    </Checkbox.Group> */}
                </Div>
            </Row>
        </Spin>
    )

}

export default Popup
