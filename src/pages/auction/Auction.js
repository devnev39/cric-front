import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import encrypt from "../../components/common/Encrypt";
import authenticateResponse from "../../components/common/authenticateResponse";
import Option from "../../components/auction/Option";
import Teams from "../../components/auction/Teams";
import {Auction as AuctionComponent} from "../../components/auction/Auction";
import Players from "../../components/auction/Players";
import "./styles.css";

function Auction() {
    /*
    state               :   Clicked auction information from /Auctions page
    auctionId           :   auctionId in the browser addressbar to crosscheck browser state
    auctionData         :   Full auction data fetched from server after auth
    currentComponent    :   Currently active component in sidebar
    trigger             :   Trigger to fetch updated info from server 
    */
    const {state} = useLocation();
    const {auctionId} = useParams();
    const [auctionData,setAuctionData] = useState(null);
    const [currentComponent,setCurrentComponent] = useState("Options");
    const [trigger,setTrigger] = useState(false);
    const toggleTrigger = () => {setTrigger(!trigger)};
    const navigate = useNavigate();
    if(!state) {
        alert("Cannot identify the route !");
        navigate(-1);
    }
    const fetchAuctionData = async () => {
        if(state.auction._id !== auctionId){alert("Invalid id !");return;}
        const response = await (await fetch(`/auction/${state.auction._id}`)).json();
        if(response.status !== 200){
            alert(response.data);
            if(response.status > 500 && response.status < 600) {
                let key = encrypt(prompt(`Enter password for ${state.auction.Name} : `));
                const authenticate = await authenticateResponse(response,{_id : state.auction._id,Password : key});
                if(authenticate) window.location.reload();
                else{alert(authenticate.data);navigate(-1);}
            }
        }else setAuctionData(response.data);
    }

    const onSelect = async (selection) => {
        if(selection.target.innerText === 'Logout'){
            if(window.confirm("Do you want to logout ?")){
                const res = await (await fetch("/logout")).json();
                if(res.status === 200) {alert("Logged out !"); navigate("/auctions");return;}
                else alert(res.data);
                return;
            }else return;
        }
        if(selection.target.innerText === 'Delete'){
            if(window.confirm("Do you want to delete this auction ?")){
                const res = await (await fetch(`/auction/${auctionData._id}`,{
                    method : "DELETE",
                    headers : {
                        "Content-Type" : "application/json"
                    },
                    body : JSON.stringify({auction : auctionData})
                })).json();
                if(res.status === 200){
                    const r = await (await fetch("/logout")).json();
                    if(r.status === 200) navigate("/auctions");
                    else alert(r.data);
                    return;
                }
                else alert(res.data);
                return;
            }else return;
        }
        Array.prototype.slice.call(document.getElementsByClassName("activeItem")).forEach(element => {
            element.classList.remove("activeItem");
        });
        selection.target.classList.add("activeItem");
        setCurrentComponent(selection.target.innerText);
    }

    useEffect(() => {
        const run = async () => {
            await fetchAuctionData();
        }
        run();
    },[trigger]);
    return (
        <div className="auctionRoot">
            <div className="row">
                <div className="col-2 border-right vh-100">
                    <div className="menuContainer">
                        <div className="nav-item activeItem" onClick={e => {onSelect(e)}}>
                            <i className="fa-solid fa-gear"></i>
                            Options
                        </div>
                        <div className="nav-item" onClick={e => {onSelect(e)}}>
                            <i className="fa-solid fa-user-group"></i>
                            Teams
                        </div>
                        <div className="nav-item" onClick={e => {onSelect(e)}}>
                            <i className="fa-solid fa-user-pen"></i>
                            Players
                        </div>
                        <div className="nav-item" onClick={e => {onSelect(e)}}>
                            <i className="fa-solid fa-gavel"></i>
                            Auction
                        </div>
                        <div className="nav-item" onClick={e => {onSelect(e)}}>
                            <i className="fa-solid fa-right-from-bracket text-danger"></i>
                            Logout
                        </div>
                        <div className="nav-item" onClick={e => {onSelect(e)}}>
                            <i className="fa-solid fa-trash-can text-danger"></i>
                            Delete
                        </div>
                    </div>
                    
                </div>
                {auctionData ? 
                <div className="col-10">
                    {currentComponent === "Options" ? <Option auctionObj = {auctionData} trigger = {toggleTrigger} /> : null}
                    {currentComponent === "Teams" ? <Teams auctionObj = {auctionData} trigger = {toggleTrigger}  /> : null}
                    {currentComponent === "Players" ? <Players auctionObj = {auctionData} trigger = {toggleTrigger}  /> : null}
                    {currentComponent === "Auction" ? <AuctionComponent auctionObj = {auctionData} trigger = {toggleTrigger}  /> : null}
                </div> : null}
            </div>
        </div>
    )
}

export default Auction;