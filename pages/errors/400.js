

import { Button, Col, Row } from "antd";
import { useRouter } from "next/router";
import ServerErrorStyle from '../../styles/ServerError.module.css'

function BadRequestPage() {
  
  const router = useRouter();

  const buttonClicked=()=>{
    router.push('/')
  }
  return <div className={ServerErrorStyle.container}>
    <Row >
      <Col className="gutter-row" sm={24} md={12} >
        <img src="./400.png" className={ServerErrorStyle.responsive}></img>
      </Col>
      <Col className="gutter-row" sm={24} md={12} >
        <Row className={ServerErrorStyle.title} align="center">400</Row>
        <Row className={ServerErrorStyle.error_title} align="center">Bad Request</Row>
        <Row className={ServerErrorStyle.error_message} align="center">
          We've been automaticaly alerted of the issue and will work to fix it as quicky as possible.
        </Row>
        <Button className={ServerErrorStyle.button}  onClick={buttonClicked}>
          Ok , just take me to home page
        </Button>
      </Col>
    </Row>
  </div>
}

export default BadRequestPage