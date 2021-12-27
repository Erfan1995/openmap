import { Row, Col } from "antd";
import styled from 'styled-components'

const NumberBox = styled(Col)`
padding: 1px 7px;
border: 1px solid rgb(206, 204, 204);
text-align: center;
border-radius: 4px;
font-size: 15px;
color: rgb(206, 204, 204);
`
const TitleBox = styled(Col)`
margin-left: 10px;
margin-top: 2px;
color: rgb(61, 60, 60);
text-align: center;

`
const ListWrapper = styled(Row)`
padding: 10px 0px;
width:100%
`


const SubTitle = ({number,title}) => {
    return (
            <ListWrapper>
                <NumberBox>{number}</NumberBox>
                <TitleBox > {title}</TitleBox>
            </ListWrapper>
    )
}

export default SubTitle
