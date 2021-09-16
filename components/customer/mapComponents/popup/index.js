import { Slider, Row, Col, Input, Checkbox, Card, List, Spin, Modal, Divider, Form, Button } from "antd";
import styled from 'styled-components'
import styles from './Sidebar.module.css'
import ColorPicker from "rc-color-picker";
import "rc-color-picker/assets/index.css";
import { PopUp } from "lib/constants";
import { Scrollbars } from 'react-custom-scrollbars';
import SubTitle from "components/customer/generalComponents/SubTitle";
import { deleteMethod, postFileMethod, putMethod, getDatasetConfSelectedDataset } from "../../../../lib/api";
import { useEffect, useState } from "react";
import FormElement from "./FormElement"
const { confirm } = Modal;
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

const Popup = ({ mdcId, datasetProperties, selectedDatasetProperties, layerType, setDataset, onMapDataChange, token }) => {
    const [selectedStyle, setSelectedStyle] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkedList, setCheckedList] = useState(selectedDatasetProperties.selected_dataset_properties);
    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAll, setCheckAll] = useState(false);
    const [cBoxes, setCBoxes] = useState([]);
    let options = [];
    const dynamicFormContent = [];
    let dynamicFormCheckbox = [];
    let initialValues = {};
    let initialFormValues = {};
    if (layerType === "dataset") {
        let i = 0;
        for (const [key, value] of Object.entries(datasetProperties)) {
            options[i] = key;
            let checkbox = {
                label: key,
                required: false,
                name: key,
                key: key,
                checked: false
            }
            dynamicFormCheckbox.push(checkbox);
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
        dynamicFormCheckbox.map((map) => {
            checkedList.map((checked) => {
                if (map.key === checked) {
                    map.checked = true;
                }
            })
        })
        if (selectedDatasetProperties.edited_dataset_properties) {
            for (const [key, value] of Object.entries(selectedDatasetProperties?.edited_dataset_properties)) {
                initialFormValues[key] = value;
            }
        } else {
            initialFormValues = initialValues;
        }
    } else if (layerType === "main") {
        options = datasetProperties;
    }
    const onChange = async (list) => {
        // let checkedCheckboxes;
        // const res = await getDatasetConfSelectedDataset({ id: mdcId }, token);
        // if (res) {
        //     checkedCheckboxes = res[0]?.selected_dataset_properties;
        // }
        // let response;
        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < options.length);
        setCheckAll(list.length === options.length);
        // if (check.target.checked) {
        //     checkedCheckboxes.push(check.target.value);
        // } else {
        //     for (let i = 0; i < checkedCheckboxes.length; i++) {
        //         if (checkedCheckboxes[i] === check.target.value) {
        //             checkedCheckboxes.splice(i, 1)
        //         }
        //     }
        // }
        // console.log(checkedCheckboxes, 'list');
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
                                    {/* <Form > */}
                                        <CheckboxGroup options={options} value={checkedList} onChange={onChange} />
                                        {/* {
                                            dynamicFormCheckbox.map((component) => (
                                                <Form.Item>
                                                    <Checkbox value={component.key} checked={component.checked}
                                                        onChange={onChange}>{component.name}</Checkbox>
                                                </Form.Item>

                                            ))
                                        } */}
                                    {/* </Form> */}
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
