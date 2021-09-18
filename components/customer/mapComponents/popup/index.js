import { Slider, Row, Col, Input, Checkbox, Card, List, Spin, Modal, Divider, Form, Button } from "antd";
import styled from 'styled-components'
import "rc-color-picker/assets/index.css";
import { PopUp } from "lib/constants";
import { Scrollbars } from 'react-custom-scrollbars';
import SubTitle from "components/customer/generalComponents/SubTitle";
import { putMethod } from "../../../../lib/api";
import { useState, useEffect } from 'react';
const CheckboxGroup = Checkbox.Group;

const Div = styled.div`
  width:500px;
  padding-left:15px
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


const Popup = ({ mdcId, datasetProperties, selectedDatasetProperties, layerType, setDataset, onMapDataChange, token, editedProperties }) => {
    const [selectedStyle, setSelectedStyle] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkedList, setCheckedList] = useState(selectedDatasetProperties.selected_dataset_properties);
    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAll, setCheckAll] = useState(false);
    const [cBoxes, setCBoxes] = useState([]);
    let options = [];
    const dynamicFormContent = [];
    let initialValues = {};
    let initialFormValues = {};
    if (layerType === "dataset") {
        let i = 0;
        for (const [key, value] of Object.entries(datasetProperties)) {
            options[i] = key;
            let input = {
                component: "input",
                name: key,
                required: false,
                key: i
            }
            dynamicFormContent.push(input);
            initialValues[key] = key;
            i++;
        }
        if (editedProperties) {
            for (const [key, value] of Object.entries(editedProperties)) {
                initialFormValues[key] = value;
            }
        } else {
            initialFormValues = initialValues;
        }
    } else if (layerType === "main") {
        console.log(datasetProperties);
        options = datasetProperties;
    }
    const onChange = async (list) => {
        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < options.length);
        setCheckAll(list.length === options.length);
        updateCheckedProperties(list);
    };
    const updateCheckedProperties = async (checkedValues) => {
        setLoading(true);
        if (layerType === "dataset") {
            const res = await putMethod('mapdatasetconfs/' + mdcId, { selected_dataset_properties: checkedValues });
            if (res) {
                setDataset();
            }
        } else if (layerType === "main") {
            const res = await putMethod('maps/' + mdcId, { mmd_properties: checkedValues });
            if (res) {
                onMapDataChange();
            }
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
                setDataset();
            }

        } else if (layerType === "main") {
            const res = await putMethod('maps/' + mdcId, { default_popup_style_slug: item })
            if (res) {
                onMapDataChange();
            }

        }
        setLoading(false);
    }
    const handleInputField = async (e) => {
        if (e.key === 'Enter') {
            setLoading(true);
            initialFormValues[e.target.id] = e.target.value;
            const res = await putMethod('mapdatasetconfs/' + mdcId, { edited_dataset_properties: initialFormValues });
            if (res) {
                initialFormValues = res.edited_dataset_properties;
            }
            setLoading(false);
        }
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
                </PopUpContainer>
                {options.length > 0 && <div>
                    <SubTitle number={2} title={'Show Items'} />
                    <Div>
                        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                            Check all
                        </Checkbox>
                        <Divider />
                        <Scrollbars style={{ width: 300, height: 300 }} className='track-horizontal'>
                            <Row gutter={8}>
                                <Col span={8}>
                                    <CheckboxGroup options={options} value={checkedList} onChange={onChange} />
                                </Col>
                                <Col span={12}>
                                    <Form initialValues={initialFormValues}>
                                        {dynamicFormContent.map((component) => (
                                            <Form.Item
                                                label={component.label}
                                                name={component.name}
                                                onKeyDown={handleInputField}
                                            >
                                                <component.component />
                                            </Form.Item>
                                        ))}
                                    </Form>
                                </Col>
                            </Row>
                        </Scrollbars>
                    </Div>
                </div>

                }
            </Row>
        </Spin >
    )

}

export default Popup
