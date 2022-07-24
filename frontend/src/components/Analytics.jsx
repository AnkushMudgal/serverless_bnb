import React from "react";
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

function Analytics() {
    return (
        <div class="center">
            <Form>
                <Row>
                    <Col>
                        <iframe src="https://datastudio.google.com/embed/reporting/83ed2078-254f-48dd-9ff4-47e0b1c6d9fd/page/uAXyC"
                            width={800} height={500} />
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

export { Analytics };