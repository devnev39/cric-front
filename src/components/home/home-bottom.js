import { useEffect, useState } from "react"
import {Row,Col,Table} from "react-bootstrap"
import fetchData from "../../helpers/fetchData";
import queryBuiler from "../../helpers/queryBuilder";
import { MaketableBody } from "../common/Tablebody";
import { MaketableHead } from "../common/Tablehead";
import "./styles.css"
export default function Homebottom() {
    const [tb1Data,setTb1Data] = useState();
    const [tb2Data,setTb2Data] = useState();
    const requestHomeData = async () => {
        const query = new queryBuiler();

        let res = await fetchData("/players/query",{query : query.sort({"BasePrice" : -1}).limit(5).queries});
        if(res.status !== 200) alert(`${res.status} ${res.data}`);
        else setTb1Data(res.data);

        res = await fetchData("/players/query",{query : query.clear().group({_id : "$IPL2022Team",TotalBid : {$sum : "$AuctionedPrice"}})
        .project({_id : 0,Name : "$_id",TotalBid : "$TotalBid"})
        .sort({"TotalBid" : -1}).limit(5).queries})
        if(res.status !== 200) alert(`${res.status} ${res.data}`);
        else setTb2Data(res.data);
    }
    useEffect(() => {
        const requestData = async () => {
            await requestHomeData();
        }
        requestData();
    },[])

    const tb1 = {
        Name : String,
        Country : String,
        BasePrice : Number,
    }

    const tb2 = {
        Name : String,
        TotalBid : Number
    }

    return (
        <div className="home-bottom-div pt-5">
            <Row>
                <Col xs={6} className="border-dark border-right">
                    <div className="stat-head d-flex justify-content-center">
                        <h2>Player stats</h2>
                    </div>
                    <div className="stat-head d-flex justify-content-center my-3">
                        <h3>Top 5 players with high base price</h3>
                    </div>
                    <div className="stat-head d-flex justify-content-center">
                        <Table striped bordered hover size="sm">
                            <thead>
                                {MaketableHead(tb1)}
                            </thead>
                            <tbody>
                                {MaketableBody(tb1Data,tb1)}
                            </tbody>
                        </Table>
                    </div>
                </Col>
                <Col xs={6}>
                <div className="stat-head d-flex justify-content-center">
                        <h2>IPL 2022 stats</h2>
                    </div>
                    <div className="stat-head d-flex justify-content-center my-3">
                        <h3>Top teams with high biddings</h3>
                    </div>
                    <div className="stat-head d-flex justify-content-center">
                        <Table striped bordered hover size="sm">
                            <thead>
                                {MaketableHead(tb2)}
                            </thead>
                            <tbody>
                                {MaketableBody(tb2Data,tb2)}
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>
        </div>
    )
}