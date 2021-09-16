import { Input, Form, Checkbox } from "antd"
// mapping of our components
const componentMapping = {
    input: Input,
    password: Input.Password,
    checkbox: Checkbox,
}
const FormElement = ({ component, label, required, name }) => {
    const Component = componentMapping[component]
    return (
        <Form.Item
            label={label}
            name={name}
            rules={[{ required, message: "Field is required!" }]}
        >
            <Component />
        </Form.Item>
    )
}
export default FormElement;