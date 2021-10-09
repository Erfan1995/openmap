import { Row, Col, Input, Checkbox, Card, Spin, Form, Button, message } from "antd";
import styled, { createGlobalStyle } from 'styled-components'
import { PopUp } from "lib/constants";
import SubTitle from "components/customer/generalComponents/SubTitle";
import { putMethod } from "../../../../lib/api";
import { useState } from 'react';
const CheckboxGroup = Checkbox.Group;



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

const PopUpCart = styled(Card)`
height: 75px; 
width: 100px; 
float:left;
padding: 10px;
 margin-left: 10px;
 border-radius:5px;
 border:1px solid #aaa;
 &:hover{
 border:2px solid #228;
 cursor:pointer;

 }
`




const Popup = ({ mdcId, properties, selectedDatasetProperties, layerType, setDataset, onMapDataChange, token, editedProperties }) => {
    const [loading, setLoading] = useState(false);
    const [checkedList, setCheckedList] = useState(selectedDatasetProperties);
    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAll, setCheckAll] = useState(false);
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
        if (editedProperties) {
            for (const [key, value] of Object.entries(editedProperties)) {
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
        if (editedProperties) {
            for (const [key, value] of Object.entries(editedProperties)) {
                initialFormValues[key] = value;
            }
        } else {
            initialFormValues = initialValues;
        }
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
            const res = await putMethod('mapsurveyconfs/' + mdcId, { selected_survey_properties: checkedValues });
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
            const res = await putMethod('mapdatasetconfs/' + mdcId, { default_popup_style_slug: item });
            if (res) {
                setDataset();
            }

        } else if (layerType === "main") {
            const res = await putMethod('mapsurveyconfs/' + mdcId, { default_popup_style_slug: item })
            if (res) {
                onMapDataChange();
            }

        }
        setLoading(false);
    }
    const handleInputField = async (e) => {
        setLoading(true);

        form
            .validateFields()
            .then(async (values) => {
                // initialFormValues[e.target.id] = e.target.value;
                if (layerType === "dataset") {
                    const res = await putMethod('mapdatasetconfs/' + mdcId, { edited_dataset_properties: values });
                    if (res) {
                        initialFormValues = res.edited_dataset_properties;
                        setDataset();
                        setLoading(false);


                    }
                } else if (layerType === "main") {
                    const res = await putMethod('mapsurveyconfs/' + mdcId, { edited_survey_properties: values });
                    if (res) {
                        initialFormValues = res.edited_survey_properties;
                        onMapDataChange();
                        setLoading(false);
                    }
                }
            }).catch(e => {
                setLoading(false);
                message.error(e?.message);
            })


    }
    return (
        <Spin spinning={loading}>

            <GeneralCSS />

            <div>
                <SubTitle number={1} title={'style'} />

                <div className="slider">
                    <div className="slides">
                        {
                            PopUp?.map((item, index) => (
                                <div  key={'div'+item.name + index}>
                                    <PopUpCart  key={item.name + index} onClick={() => selectPopupStyle(item.name)}
                                        cover={<img alt="example" src={item.cover}
                                        />}
                                    />
                                </div>
                            ))

                        }
                    </div>
                </div>
            </div>
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
        </Spin >
    )

}

export default Popup
