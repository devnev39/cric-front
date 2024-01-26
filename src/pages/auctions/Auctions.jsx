import settings from "../../config/settings"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css"
function Auctions(){
    const [auctions,setAuctions] = useState(null);
    const navigate = useNavigate();
    const statusLightsGenerator = () => {
        const lights = ['red','orange','green'];
        const status = ['Has not started','In progress','Finished'];
        return lights.map(c => {
            return (
                <div className="row" key={c}>
                    <div className="col-3">
                        <i style={{"color" : c}} className="fa-solid fa-circle p-2"></i>
                    </div>
                    <div className="col-9">
                        {status[lights.indexOf(c)]}
                    </div>
                </div>
            )
        })
    }
    const createAuctionStack = () => {
        return auctions.map(auction => {
            return (
                <div key={`${auction._id}}`} className="row mb-4 shadow-sm rounded h5 auctionRowContent" onClick={() => {navigate(`/auction/${auction._id}`,{state : {auction : auction}})}}>
                    <div className="col-1 d-flex justify-content-center" style={{"borderRight" : `2px dotted ${auction.Status}`}}>
                        {auction.No}
                    </div>
                    <div className="col-8 d-flex justify-content-center" style={{"borderRight" : `2px dotted`}}>
                        {auction.Name}
                    </div>
                    <div className="col-2 d-flex justify-content-center">
                        {auction.MaxBudget}
                    </div>
                    <div className="col-1 d-flex justify-content-center" style={{"borderLeft" : `2px dotted ${auction.Status}`}}>
                        <i style={{"color" : auction.Status}} className="fa-solid fa-circle p-2"></i>
                    </div>
                </div>   
            )
        });
    }
    const getAuctions = async () => {
        const response = await (await fetch(`${settings.BaseUrl}/auction`,{credentials : "include"})).json();
        if(response.status === 601) {navigate(`/auction/${response.data._id}`,{state : {auction : response.data}});return;}
        if(response.status !== 200) {alert(response.data);return;}
        setAuctions(response.data);
    }

    const createLoadingDiv = () => {
        return (
            <div className="mx-5">
                <div className="d-flex justify-content-center m-5">
                    <div class="spinner-grow text-success" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
                <div className="d-flex justify-content-center h2">
                    Loading.....Please wait !
                </div>
            </div>
        )
    }

    useEffect(() => {
        const run = async () => {await getAuctions()}
        run();
    },[]);
    return (
        <div className="auctionsContainerRoot mt-5">
            <div className="row">
                <div className="col-5">

                </div>
                <div className="col-4">
                    <h1 className="ml-5">Auctions</h1>
                </div>
                <div className="col-3">
                     <div className="rounded p-3 indicatorContainer shadow w-50">
                        {statusLightsGenerator()}
                    </div>
                </div>
            </div>            
            <div className="d-flex justify-content-center mt-5">
                <div className="auctionsContainer w-50">
                    {auctions ? createAuctionStack() : createLoadingDiv()}
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <div className="row w-50">
                    <div className="col-4"></div>
                    <div className="col-4 d-flex justify-content-center shadow h3 newAuctionButtonDiv" onClick={() => navigate("/new/auction")}>+</div>
                    <div className="col-4"></div>
                </div>
                
            </div>
        </div>
    )
}

export default Auctions;
