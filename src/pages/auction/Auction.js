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
    const {state} = useLocation();
    const {auctionId} = useParams();
    const [auctionData,setAuctionData] = useState(null);
    const [currentComponent,setCurrentComponent] = useState("Options");
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
                let key = prompt(`Enter password for ${state.auction.Name} : `);
                key = encrypt(key);
                const authenticate = await authenticateResponse(response,{_id : state.auction._id,Password : key});
                if(authenticate) window.location.reload();
                else{alert(authenticate.data);navigate(-1);}
            }
        }else setAuctionData(response.data);
    }

    const onSelect = async (selection) => {
        Array.prototype.slice.call(document.getElementsByClassName("activeItem")).forEach(element => {
            element.classList.remove("activeItem");
        });
        selection.target.classList.add("activeItem");
        if(selection.target.innerText === 'Logout'){
            if(window.confirm("Do you want to logout ?")){
                const res = await (await fetch("/logout")).json();
                if(res.status === 200) {alert("Logged out !"); navigate("/auctions");return;}
                else alert(res.data);
            }
        }
        setCurrentComponent(selection.target.innerText);
    }

    useEffect(() => {
        const run = async () => {
            await fetchAuctionData();
        }
        run();
    },[]);
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
                            <i class="fa-solid fa-right-from-bracket"></i>
                            Logout
                        </div>
                    </div>
                    
                </div>
                <div className="col-10">
                    {currentComponent === "Options" ? <Option auctionObj = {auctionData} /> : null}
                    {currentComponent === "Teams" ? <Teams auctionObj = {auctionData} /> : null}
                    {currentComponent === "Players" ? <Players auctionObj = {auctionData} /> : null}
                    {currentComponent === "Auction" ? <AuctionComponent auctionObj = {auctionData} /> : null}
                </div>
            </div>
        </div>
    )
}

export default Auction;