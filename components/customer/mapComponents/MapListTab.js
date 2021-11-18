
import SubTitle from "../generalComponents/SubTitle"

import { Row, Checkbox, Menu, Dropdown, Col, Divider, Button, Input, Space } from "antd"
import { DATASET } from '../../../static/constant'
import styled from "styled-components"
import { useEffect, useState } from "react"


const widgetData=[
    {
        'id':'1',
        'title':'Progress Bar',
        'checked':true
    },
    {
        'id':'2',
        'title':'Video Widget',
        'checked':false
    },
    {
        'id':'3',
        'title':'Text Widget',
        'checked':true
    },
    {
        'id':'4',
        'title':'Newsfeed Widget',
        'checked':false
    },
]

const data = [
    {
        'id': '1',
        'title': 'Title 1',
        'checked':true
    },
    {
        'id': '2',
        'title': 'Title 2',
        'checked':true
    },
    {
        'id': '3',
        'title': 'Title 3',
        'checked':false
    },
    {
        'id': '4',
        'title': 'Title 4',
        'checked':true
    },
    {
        'id': '5',
        'title': 'Title 5',
        'checked':false
    },
]



const AttributeDeleteButton = styled.span`
    font-size:20px;
    font-weight:bold;
    &:hover{
    font-size:22px;
    }
    padding:4px;
    `;



const MapLisTab = ({onEdit}) => {

    const [indeterminate, setIndeterminate] = useState(false);
    const [checkAll, setCheckAll] = useState(false);
    const [dataList,setDataList]=useState(data);
    const [widgets,setWidgets]=useState(widgetData);
    const [selectedItem,setSelectedItem]=useState();



    const listMenu = (
        <Menu >
            <Menu.Item key="1" style={{ padding: "3px 20px" }}><a onClick={onEdit} >{DATASET.EDIT}</a></Menu.Item>
            {/* <Menu.Item key="2" style={{ padding: "3px 20px" }}><a onClick={() => showSurveyConfirm()} >{DATASET.DELETE}</a></Menu.Item> */}
        </Menu>
    );





    const onChangeState=(e)=>{
        setWidgets(widgets.map((widget)=>{
            if(widget.id===e.target.id){
                return {...widget,checked:e.target.checked}
            }
            else{
                return {...widget,checked:widget.checked}
            }
        }))
    }


    const onChange = e => {
        let checkedItems=0;
        setDataList(dataList.map((element)=>{
            if(element.id===e.target.id){
                checkedItems=e.target.checked ? ++checkedItems :checkedItems;
                return {...element,checked:e.target.checked}
            }
            else{
                checkedItems=element.checked ? ++checkedItems : checkedItems;
                return {...element,checked:element.checked}
            }
        }))
        setCheckAll(checkedItems===dataList.length);
        setIndeterminate(!!checkedItems && checkedItems <dataList.length)        
    };


    const onCheckAllChange = e => {
        setDataList(dataList.map((element)=>{
            return {...element,checked:e.target.checked}
        }))
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    };







    return <div>
        <Row>
            <SubTitle title={'Style'} number={1}></SubTitle>
            {widgets.map((widget) => (
                <Row style={{ width: '100%', paddingLeft: 20}}>
                    <Col span={21} >
                        <Checkbox id={widget.id} onChange={onChangeState}>{widget.title}</Checkbox>
                    </Col>
                    <Col span={3}>
                        <div>
                            <Dropdown size="big" overlay={listMenu} trigger={['click']} >
                                <a className="ant-dropdown-link"
                                    onClick={(e) => setSelectedItem(widget)} >
                                    <AttributeDeleteButton>:</AttributeDeleteButton>
                                </a>
                            </Dropdown>
                        </div>
                    </Col>
                </Row>
            ))}
 
            <SubTitle title={'Show Items'} number={2}></SubTitle>
            <Row style={{ width: '100%', paddingLeft: 10 }}>
                <Col span={18}>
                    <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                        Check all
                    </Checkbox>
                </Col>
                <Col span={6}>
                    <Button type="primary">Save</Button>
                </Col>
            </Row>
            <Divider style={{ margin: '10px 0px' }} />
            {/* <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} /> */}
            {dataList.map((item) => (
                <Row style={{ width: '100%', marginTop: 10, paddingLeft: 10 }}>
                    <Col span={10}>
                        <Checkbox  onChange={onChange} id={item.id} checked={item.checked}>{item.title}</Checkbox>
                    </Col>
                    <Col span={14}>
                        <Input defaultValue="26888888" />
                    </Col>
                </Row>
            ))}
        </Row>

    </div>

}

export default MapLisTab