import React from "react";
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import '../components/Analytics.css'


function UserStats() {
    return (
        <div class="center">
            <Form>
                <Row>
                    <Col>
                        <iframe src="https://datastudio.google.com/embed/reporting/2cf7ffa8-c5ec-435a-9b27-7efdd5ed2311/page/tEnnC"
                            width={800} height={800} />
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

export { UserStats };