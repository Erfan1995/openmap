import { Slider, Row, Col, Input, Checkbox, Card,List } from "antd";
import styled from 'styled-components'
import 'antd/dist/antd.css';
import styles from './Sidebar.module.css'
import ColorPicker from "rc-color-picker";
import "rc-color-picker/assets/index.css";
import { PopUp } from "lib/constants";


const Div = styled.div`
  width:400px;
  padding-left:35px
`



const cardStyle = { height: 75, width: 100, padding: 10, margin: 5 }

const Popup = () => {
    var intialValue = 10;


    const onChange = value => {
        console.log(" value " + { value })
    }

    const changeHandler = (colors) => {
        console.log("Change Handler Color : ", posts);
    };

    const closeHandler = (colors) => {
        console.log("Close Handler Color ", colors);
    };

    const style = { background: '#0092ff', padding: '8px 0' };
    return (
        <Row>

            <Row className={styles.list_title}>
                <Col className={styles.list_item_no}>1</Col>
                <Col className={styles.list_item_title}> Style</Col>
            </Row>
            <Div>
                <Row >
                    <List
                        className='margin-top-10'
                        dataSource={PopUp}
                        grid={{
                            gutter: 16,
                            xs: 1,
                            sm: 4,
                            md: 4,
                            lg: 4,
                            xl: 6,
                            xxl: 3,
                          }}                       
                        renderItem={item => (
                            <Card
                            hoverable
                            style={cardStyle}
                            cover={<img alt="example" src={item.cover} 
                             />}
                        />

                        )}
                      />
                </Row>
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
            </Div>

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
