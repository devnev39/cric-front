import {Row, Col, Button} from "react-bootstrap";
import "./styles.css"
import {SVGS} from "../../resources/index";
import { useNavigate } from "react-router-dom";
export default function Hometop() {
    const navigate = useNavigate();
    const svgs = [
        {url : SVGS.hmanage, tag : "See your auctions anytime, anywhere !"},
        {url : SVGS.hstat, tag : "Store and analyse the stats based on your rules !"},
        {url : SVGS.hcustom, tag : "Tight protection !"},
        {url : SVGS.hshare, tag : "See realtime updates anywhere anytime with full control !"}
    ];
    const createSvgBanner = (src) => {
        return (
            <li key={`${src.url}`}>
                <div className="row mt-2">
                    <div className="col-2">
                        <img src={src.url} className="side-svg" alt="" />
                    </div>
                    <div className="col-10">
                        {src.tag}
                    </div>
                </div>
                                    
            </li>
        )
    }
    return (
        <div className="home-top-div">
                <Row className="home-row">
                    <Col className="home-col d-flex align-items-center justify-content-center" xs={6}>
                        <div className="home-col-1-content">
                            <div className="d-flex justify-content-center">
                                <div className="row">
                                    <div className="col-2">
                                        <img src={SVGS.hbid} className="side-svg" alt="" />
                                    </div>
                                    <div className="col-10">
                                        <h1 style={{"fontWeight" : "300"}}>Create a game auction instantly !</h1>
                                    </div>
                                </div>
                            </div>
                            <br />
                            <ul className="list-unstyled" style={{"fontWeight" : "300"}}>                      
                                {svgs.map(src => createSvgBanner(src))}
                            </ul>
                            
                            <div className="mt-5 d-flex justify-content-center">
                                <Button className="m-3 home-btn" onClick={()=>navigate("/new/auction")} variant="success">Create new auction</Button>
                                <Button className="m-3 home-btn" onClick={()=>navigate("/auctions")} variant="primary">Resume previous auction</Button>
                            </div>
                        </div>
                    </Col>
                    <Col className="home-col" xs={6}>
                        <img src={SVGS.hside} alt="" />
                    </Col>
                </Row>
            </div>
    );
}