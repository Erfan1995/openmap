import { Slider, Row, Col, Input, Checkbox, Card, List } from "antd";
import styled from 'styled-components'
import 'antd/dist/antd.css';
import styles from './Sidebar.module.css'
import ColorPicker from "rc-color-picker";
import "rc-color-picker/assets/index.css";
import { PopUp } from "lib/constants";
import { Scrollbars } from 'react-custom-scrollbars';


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

 }
`


const Popup = () => {

    const onChange = value => {
        console.log(" value " + { value })
    }

    return (
        <Row>

            <Row className={styles.list_title}>
                <Col className={styles.list_item_no}>1</Col>
                <Col className={styles.list_item_title}> Style</Col>
            </Row>

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

            <Row className={styles.list_title}>
                <Col className={styles.list_item_no}>2</Col>
                <Col className={styles.list_item_title}> Show Items</Col>
            </Row>
            <Div>
                <Row>
                    <Col className="gutter-row" span={18}>All Selected</Col>
                    <Col className="gutter-row" span={6}>NONE</Col>
                </Row>

                <br />
                <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                    <Row>
                        <Col span={8}>
                            <Checkbox value="A">First</Checkbox>
                        </Col>
                    </Row>


                    <Row>
                        <Col span={8}>
                            <Checkbox value="A">First</Checkbox>
                        </Col>
                    </Row>


                    <Row>
                        <Col span={8}>
                            <Checkbox value="A">First</Checkbox>
                        </Col>
                    </Row>


                    <Row>
                        <Col span={8}>
                            <Checkbox value="A">First</Checkbox>
                        </Col>
                    </Row>


                    <Row>
                        <Col span={8}>
                            <Checkbox value="A">First</Checkbox>
                        </Col>
                    </Row>


                    <Row>
                        <Col span={8}>
                            <Checkbox value="A">First</Checkbox>
                        </Col>
                    </Row>

                </Checkbox.Group>

            </Div>
        </Row>
    )

}

export default Popup
