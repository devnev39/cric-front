import settings from "../../config/settings.json";
import { useEffect, useState } from "react"
import {Row,Col} from "react-bootstrap"
import fetchData from "../../helpers/fetchData";
import queryBuiler from "../../helpers/queryBuilder";
import BarChart from "../common/BarChart";

export default function Homebottom() {
    const [tb1Data,setTb1Data] = useState();
    const [tb2Data,setTb2Data] = useState();

    const requestHomeData = async () => {
        const query = new queryBuiler();

        let res = await fetchData(`${settings.BaseUrl}/player/query`,{query : query.sort({"BasePrice" : -1}).limit(5).queries});
        if(res.status !== 200) alert(`${res.status} ${res.data}`);
        else setTb1Data(res.data);

        res = await fetchData(`${settings.BaseUrl}/player/query`,{query : query.clear().group({_id : "$IPL2022Team",TotalBid : {$sum : "$AuctionedPrice"}})
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
    },[]);

    const tb1 = {
        BasePrice : Number,
        Country : String,
        PlayingRole : String,
    }

    const tb2 = {
        TotalBid : Number
    }

    const opt1 = {
        xkey : "Name",
        ykey : "BasePrice",
        xlabel : "Players",
        ylabel : "Base Price (in lakhs)",
        label : "Base Price",
        tooltipInfoKeys : Object.keys(tb1)
    };

    const opt2 = {
        indexAxis : 'y',
        xlabel : "Total bid (in lakhs)",
        ylabel : "Team",
        xkey : "Name",
        ykey : "TotalBid",
        label : "Total Bid",
        // tooltipInfoKeys : Object.keys(tb2)
    };

    return (
        <div className="home-bottom-div pt-5 pl-2">
            <Row>
                <Col xs={6} className="border-dark border-right">
                    <div className="stat-head-1 d-flex justify-content-center">
                        <h2>Player stats</h2>
                    </div>
                    <div className="stat-head d-flex justify-content-center my-3">
                        <h3>Top 5 players with high base price</h3>
                    </div>
                    <div className="d-flex justify-content-center shadow-lg p-3 mb-5 bg-white rounded">
                        {tb1Data ? <BarChart data={tb1Data} option={opt1} /> : null}
                    </div>
                </Col>
                <Col xs={6}>
                <div className="stat-head-1 d-flex justify-content-center">
                        <h2>IPL 2022 stats</h2>
                    </div>
                    <div className="stat-head d-flex justify-content-center my-3">
                        <h3>Top teams with high biddings</h3>
                    </div>
                    <div className="justify-content-center shadow-lg p-3 mb-5 bg-white rounded">
                        {tb2Data ? <BarChart data={tb2Data} option={opt2} /> : null}
                    </div>
                </Col>
            </Row>
        </div>
    )
}