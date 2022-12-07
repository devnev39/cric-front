import {Row,Col} from "react-bootstrap"
import "./styles.css"
export default function Headbottom() {
    return (
        <div className="home-bottom-div pt-5" style={{"height" : "100px"}}>
            <Row>
                <Col xs={6} className="border-right">
                    <div className="stat-head d-flex justify-content-center">
                        <h2>Player stats</h2>
                    </div>
                </Col>
                <Col xs={6}>
                    <div className="stat-head d-flex justify-content-center">
                        <h2>Auction stats</h2>
                    </div>
                </Col>
            </Row>
        </div>
    )
}