

import { Button, Col, Row } from "antd";
import ServerErrorStyle from '../../styles/ServerError.module.css'
import { useRouter } from "next/router";

function NotFoundPage() {

  
  const router = useRouter();

  const buttonClicked=()=>{
    router.push('/')
  }
  return <div className={ServerErrorStyle.container}>
    <Row >
      <Col className="gutter-row" sm={24} md={12} >
        <img src="/404.png" className={ServerErrorStyle.responsive}></img>
      </Col>
      <Col className="gutter-row" sm={24} md={12} >
        <Row className={ServerErrorStyle.title} align="center">404</Row>
        <Row className={ServerErrorStyle.error_title} align="center">Page Not Found</Row>
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

export default NotFoundPage