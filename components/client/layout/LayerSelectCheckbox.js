import React from "react";
import { Checkbox, Popover, Button, Col, Row } from "antd"
import { DownOutlined } from '@ant-design/icons';

class LayerSelectCheckbox extends React.Component {
    state = {
        selectedItems: []
    };

    componentDidMount = () => {
        if (this.props.value && this.props.value.length) {
            this.setState(
                {
                    selectedItems: [...this.props.value]
                },
            );
        }
    };

    onChange = (selection) => {
        this.setState({ selectedItems: [...selection] }, () => {
        });

        return this.props.onChange(selection);
    };
    checkboxRender = () => {
        const _this = this;

        const groups = this.props.options
            .map(function (e, i) {
                return i % 3 === 0 ? _this.props.options.slice(i, i + 3) : null;
            })
            .filter(function (e) {
                return e;
            });


        return (
            <Checkbox.Group onChange={this.onChange} value={this.state.selectedItems}>
                <Col>
                    {groups.map((group, i) => {
                        return (
                            <Row
                                key={"checkbox-group-" + i}
                                span={Math.floor(24 / groups.length)}
                            >
                                {group.map((item, i) => {
                                    return (
                                        <Checkbox
                                            key={item.id}
                                            value={item.id}
                                        >
                                            {item?.forms?.title || item.title}
                                        </Checkbox>
                                    );
                                })}
                            </Row>
                        );
                    })}
                </Col>
            </Checkbox.Group>
        );
    };

    render() {
        const CheckboxRender = this.checkboxRender;
        return (
            <Popover
                content={<CheckboxRender />}
                trigger="click"
                placement="bottomLeft"
            >
                <Button >
                    {this.props.title}
                    <DownOutlined style={{paddingTop:"4px"}} />
                </Button>
            </Popover>
        );
    }
}

export default LayerSelectCheckbox;