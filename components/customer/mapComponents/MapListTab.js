
import SubTitle from "../generalComponents/SubTitle"

import { Row, Checkbox, Menu, Dropdown, Col, Form, Divider, Button, Input, Spin, message } from "antd"
import styled, { createGlobalStyle } from "styled-components"
import { useEffect, useState } from "react"
import { getWidgets, postMethod } from "lib/api"
import { putMethod } from "lib/api"
import { DATASET } from "../../../static/constant"
const CheckboxGroup = Checkbox.Group;
import { WidgetsData } from "lib/constants"
const GeneralCSS = createGlobalStyle`
.ant-checkbox-wrapper{
    padding:14px  !important;
    width:100%;
}
.properties-input{
    padding-top:17px;
    margin:0;
}

.divider{
    height:1px;
    background-color:#eee;
}

  .slider {
    width: 100%;
    text-align: center;
    margin-left:30px;
    overflow: hidden;
  }
  
  .slides {
    display: flex;
    overflow-x: auto;
    padding-bottom:20px;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    /*
    scroll-snap-points-x: repeat(300px);
    scroll-snap-type: mandatory;
    */
  }
  .slides > div {
    scroll-snap-align: start;
    flex-shrink: 0;
    border-radius: 10px;
    transform-origin: center center;
    transform: scale(1);
    transition: transform 0.5s;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .slides > div:target {
  /*   transform: scale(0.8); */
  }

  .slides > div:last-child {
    margin-right:50px;
  }

  /* Don't need button navigation */
  @supports (scroll-snap-type) {
    .slider > a {
      display: none;
    }
  }
  
  .prop-scroll {
    overflow-x: auto;
    padding-bottom:20px;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    /*
    scroll-snap-points-x: repeat(300px);
    scroll-snap-type: mandatory;
    */
  }

  .prop-part-wrapper{
      width:270px;
  }

`

const ListEditeButton = styled.span`
    font-size:20px;
    font-weight:bold;
    &:hover{
    font-size:22px;
    }
    padding:4px;
    `;



const MapLisTab = ({ onEdit, mdcId, properties, editedListViewProperties, listviewProperties, selectedWidgets,mapId,token, layerType,onMapDataChange }) => {
    const [indeterminate, setIndeterminate] = useState(false);
    const [checkAll, setCheckAll] = useState(false);
    const [checkedList, setCheckedList] = useState(listviewProperties);
    const [widgets, setWidgets] = useState(selectedWidgets !== null ? selectedWidgets : WidgetsData);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    let options = [];
    let dynamicFormContent = [];
    let initialValues = {};
    let initialFormValues = {};

    if (layerType === "dataset") {
        let i = 0;
        for (const [key, value] of Object.entries(properties)) {
            options[i] = key;
            let input = {
                component: Input,
                name: key,
                required: false,
                key: i
            }
            dynamicFormContent.push(input);
            initialValues[key] = key;
            i++;
        }
        if (editedListViewProperties) {
            for (const [key, value] of Object.entries(editedListViewProperties)) {
                initialFormValues[key] = value;
            }
        } else {
            initialFormValues = initialValues;
        }
    } else if (layerType === "main") {
        let i = 0;
        properties.map((data) => {
            options[i] = data.title;
            let input = {
                component: Input,
                name: data.title,
                required: false,
                key: data.key
            }
            dynamicFormContent.push(input);
            initialValues[data.key] = data.key;
            i++;
        })
        if (editedListViewProperties) {
            for (const [key, value] of Object.entries(editedListViewProperties)) {
                initialFormValues[key] = value;
            }
        } else {
            initialFormValues = initialValues;
        }
    }
    const listMenu = (
        <Menu>
            <Menu.Item key="1" style={{ padding: "3px 20px" }}><a onClick={onEdit} >{DATASET.EDIT}</a></Menu.Item>
        </Menu>
    );

    const onChange = async (list) => {
        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < options.length);
        setCheckAll(list.length === options.length);
        updateCheckedProperties(list);
    };
    const updateCheckedProperties = async (checkedValues) => {
        setLoading(true);
        if (layerType === "dataset") {
            const res = await putMethod('mapdatasetconfs/' + mdcId, { listview_dataset_properties: checkedValues });
            if (res) {
                setLoading(false);
            }
        } else if (layerType === "main") {
            const res = await putMethod('mapsurveyconfs/' + mdcId, { listview_survey_properties: checkedValues });
            if (res) {
                setLoading(false);
            }
        }
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

    const handleInputField = async (e) => {
        setLoading(true);

        form
            .validateFields()
            .then(async (values) => {
                // initialFormValues[e.target.id] = e.target.value;
                if (layerType === "dataset") {
                    const res = await putMethod('mapdatasetconfs/' + mdcId, { listview_edited_dataset_properties: values });
                    if (res) {
                        initialFormValues = res.listview_edited_dataset_properties;
                        setLoading(false);
                    }
                } else if (layerType === "main") {
                    const res = await putMethod('mapsurveyconfs/' + mdcId, { listview_edited_survey_properties: values });
                    if (res) {
                        initialFormValues = res.listview_edited_survey_properties;
                        setLoading(false);
                    }
                }
            }).catch(e => {
                setLoading(false);
                message.error(e?.message);
            })
    }

    const onChangeState = async (e) => {
        setLoading(true);
            let tempWidgets = [];
            widgets.map((widget) => {
                if (widget.id === e.target.id) {
                    tempWidgets.push({ 'id': widget.id, 'title': widget.title, 'checked': e.target.checked })
                }
                else {
                    tempWidgets.push(widget);
                }
            })
            const res = await putMethod('maps/' + mapId, { selected_widgets: tempWidgets });
            if (res) {
                setWidgets(tempWidgets);
                onMapDataChange();
            }
            setLoading(false);
    }

    const onSelectedItem = (id) => {
        localStorage.setItem('currentWidget', id);
    }


    return <div>
        <Spin spinning={loading}>
            <GeneralCSS />

            <Row>
                <SubTitle title={DATASET.STYLE} number={1}></SubTitle>
                {widgets.map((widget) => (
                    <Row style={{ width: '100%', paddingLeft: 20 }}>
                        <Col span={21} >
                            <Checkbox id={widget.id} checked={widget.checked} onChange={onChangeState}>{widget.title}</Checkbox>
                        </Col>
                        <Col span={3}>
                            <div>
                                <Dropdown size="big" overlay={listMenu} trigger={['click']} >
                                    <a className="ant-dropdown-link"
                                        onClick={(e) => onSelectedItem(widget.id)} >
                                        <ListEditeButton>:</ListEditeButton>
                                    </a>
                                </Dropdown>
                            </div>
                        </Col>
                    </Row>
                ))}


                <div>
                    {options.length > 0 && <div className='margin-top-20'>
                        <SubTitle number={2} title={'Show Items'} />
                        <Row >
                            <Col span={18}>
                                <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                                    Check all
                                </Checkbox>

                            </Col>
                            <Col span={6} className='text-right'>
                                <Button type='primary' className='margin-top-15 ' size='small' onClick={handleInputField} >save</Button>

                            </Col>

                        </Row>
                        <div className='divider'></div>
                        <div className='prop-scroll' >
                            <Row className='prop-part-wrapper'>
                                <Col span={12}>
                                    <CheckboxGroup options={options} value={checkedList} onChange={onChange} />

                                </Col>
                                <Col span={12}>

                                    <Form form={form} initialValues={initialFormValues}>
                                        {dynamicFormContent.map((component) => (
                                            <Form.Item
                                                label={component.label}
                                                name={component.name}
                                                key={component.label}
                                                className='properties-input'
                                            >
                                                <component.component />
                                            </Form.Item>
                                        ))}
                                    </Form>
                                </Col>
                            </Row>
                        </div>
                    </div>

                    }
                </div>
            </Row>
        </Spin>

    </div>

}

export default MapLisTab