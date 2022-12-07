import {Row, Col, Button} from "react-bootstrap";
import "./styles.css"
export default function Hometop() {
    return (
        <div className="home-top-div p-5">
                <Row className="home-row">
                    <Col className="home-col d-flex align-items-center justify-content-center" xs={6}>
                        <div>
                            <div className="d-flex justify-content-center">
                                <h1 style={{"font-weight" : "500"}}>Create a game auction instantly !</h1>
                            </div>
                            <br />
                            <ul className="list-unstyled" style={{"font-weight" : "300"}}>
                                <li><i className="fa-solid fa-list-check"></i>Manage your auction profile effortlessly</li>
                                <li><i className="fa-solid fa-timeline"></i>See your auction stats in real time</li>
                                <li><i className="fa-solid fa-user-pen"></i>Add custom players to your auction</li>
                                <li><i className="fa-brands fa-slideshare"></i>Share auction stats with everyone</li>
                            </ul>
                            
                            <div className="mt-5 d-flex justify-content-center">
                                <Button className="m-3 home-btn" variant="success">Create new auction</Button>
                                <Button className="m-3 home-btn" variant="primary">Resume previous auction</Button>
                            </div>
                        </div>
                        
                    </Col>
                    <Col className="home-col" xs={6}>
                        <img className="rounded" alt="" height="100%" src="https://upload.wikimedia.org/wikipedia/commons/f/ff/Microcosm_of_London_Plate_006_-_Auction_Room%2C_Christie%27s_%28colour%29.jpg" />
                    </Col>
                </Row>
            </div>
    );
}