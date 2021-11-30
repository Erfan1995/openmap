
import SubTitle from "../generalComponents/SubTitle"

import { Row, Checkbox, Menu, Dropdown, Col, Divider, Button, Input, Space, message } from "antd"
import styled from "styled-components"
import { useEffect, useState } from "react"
import { getWidgets, postMethod } from "lib/api"
import { putMethod } from "lib/api"
import { DATASET } from "../../../static/constant"

const widgetData = [
    {
        'id': '1',
        'title': 'Progress Bar',
        'checked': true
    },
    {
        'id': '2',
        'title': 'Video Widget',
        'checked': false
    },
    {
        'id': '3',
        'title': 'Text Widget',
        'checked': true
    },
    {
        'id': '4',
        'title': 'Newsfeed Widget',
        'checked': false
    },
]



const ListEditeButton = styled.span`
    font-size:20px;
    font-weight:bold;
    &:hover{
    font-size:22px;
    }
    padding:4px;
    `;



const MapLisTab = ({ onEdit, mdcId, datasetProperties, listviewProperties, token }) => {

    const [indeterminate, setIndeterminate] = useState(false);
    const [checkAll, setCheckAll] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [widgets, setWidgets] = useState(widgetData);

    useEffect(() => {
        let properties = [];
        if(listviewProperties!=null){
            setDataList(listviewProperties);
        }
        else{
            datasetProperties?.map((proptery, i) => {
                properties.push({ 'id': i + 1, 'title': 'title' + (i + 1), 'value': proptery.value, 'checked': proptery.state })
            });
            setDataList(properties);
        }
        
    }, [])


    const listMenu = (
        <Menu>
            <Menu.Item key="1" style={{ padding: "3px 20px" }}><a onClick={onEdit} >{DATASET.EDIT}</a></Menu.Item>
        </Menu>
    );


    const onChangeState = (e) => {
        setWidgets(widgets.map((widget) => {
            if (widget.id === e.target.id) {
                return { ...widget, checked: e.target.checked }
            }
            else {
                return { ...widget, checked: widget.checked }
            }
        }))
    }


    const onSave = async (e) => {
        try {
            const response = await putMethod('mapdatasetconfs/' + mdcId, { 'listview_properties': dataList });
            if (response) {
                message.success(DATASET.SUCCESS)
            }
        } catch (e) {
            message.error(e?.message);
        }
    }


    const onTextChange = (e) => {

        const id = (e.target.id).split("_")[1];
        const newValue = e.target.value;

        setDataList(dataList.map((element) => {
            if (element.id == id) {
                return { ...element, value: newValue }
            }
            else {
                return { ...element, value: element.value }
            }
        }));
    }


    const onChange = e => {
        let checkedItems = 0;
        setDataList(dataList.map((element) => {
            if (element.id === e.target.id) {
                checkedItems = e.target.checked ? ++checkedItems : checkedItems;
                return { ...element, checked: e.target.checked }
            }
            else {
                checkedItems = element.checked ? ++checkedItems : checkedItems;
                return { ...element, checked: element.checked }
            }
        }));
        setCheckAll(checkedItems === dataList.length);
        setIndeterminate(!!checkedItems && checkedItems < dataList.length)
    };


    const onCheckAllChange = e => {
        setDataList(dataList.map((element) => {
            return { ...element, checked: e.target.checked }
        }))
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    };


    const onSelectedItem = (id) => {
        localStorage.setItem('currentWidget', id);
    }


    return <div>
        <Row>
            <SubTitle title={DATASET.STYLE} number={1}></SubTitle>
            {widgets.map((widget) => (
                <Row style={{ width: '100%', paddingLeft: 20 }}>
                    <Col span={21} >
                        <Checkbox id={widget.id} onChange={onChangeState}>{widget.title}</Checkbox>
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

            <SubTitle title={DATASET.SHOW_ITEMS} number={2}></SubTitle>
            <Row style={{ width: '100%', paddingLeft: 10 }}>
                <Col span={18}>
                    <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                        {DATASET.CHECK_ALL}
                    </Checkbox>
                </Col>
                <Col span={6}>
                    <Button type="primary" onClick={onSave}>{DATASET.SAVE}</Button>
                </Col>
            </Row>
            <Divider style={{ margin: '10px 0px' }} />
            {dataList.map((item) => (
                <Row style={{ width: '100%', marginTop: 10, paddingLeft: 10 }}>
                    <Col span={10}>
                        <Checkbox className={item.id} onChange={onChange} id={item.id} checked={item.checked}>{item.title}</Checkbox>
                    </Col>
                    <Col span={14}>
                        <Input id={'value_' + item.id} onChange={onTextChange} defaultValue={item.value} />
                    </Col>
                </Row>
            ))}
        </Row>

    </div>

}

export default MapLisTab