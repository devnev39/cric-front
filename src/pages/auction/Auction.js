import settings from "../../config/settings"
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import encrypt from "../../components/common/Encrypt";
import authenticateResponse from "../../components/common/authenticateResponse";
import Option from "../../components/auction/Option";
import Teams from "../../components/auction/Teams";
import {Auction as AuctionComponent} from "../../components/auction/Auction";
import Players from "../../components/auction/Players";
import LiveStats from "../../components/auction/LiveStats";
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
        const response = await (await fetch(`${settings.BaseUrl}/auction/${state.auction._id}`,{credentials : "include"})).json();
        if (response.status !== 200) {
          alert(response.data);
          if(response.status > 500 && response.status < 600) {
              let key = encrypt(prompt(`Enter password for ${state.auction.Name} : `));
              const authenticate = await authenticateResponse(response,{_id : state.auction._id,Password : key});
              if (authenticate) {
                window.location.reload();
              } else {alert(authenticate.data);navigate(-1);}
          }
        } else {
          setAuctionData(response.data);
        }
    }

    const onSelect = async (selection) => {
        if(selection.target.innerText === 'Logout'){
            if (window.confirm("Do you want to logout ?")) {
              const res = await (await fetch(`${settings.BaseUrl}/logout`,{credentials : "include"})).json();
              if (res.status === 200) {
                alert("Logged out !"); navigate("/auctions");return;
              } else {
                alert(res.data);
              }
              return;
            } else {
              return;
            }
        }
        if(selection.target.innerText === 'Delete'){
            if (window.confirm("Do you want to delete this auction ?")) {
                const deleteId = prompt("Enter delelte admin id : ");
                const res = await (await fetch(`${settings.BaseUrl}/auction/${auctionData._id}`,{
                    method : "DELETE",
                    headers : {
                        "Content-Type" : "application/json"
                    },
                    body : JSON.stringify({auction : auctionData, deleteId: encrypt(deleteId)}),
                    credentials : "include"
              })).json();
              if (res.status === 200) {
                const r = await (await fetch(`${settings.BaseUrl}/logout`,{credentials : "include"})).json();
                if (r.status === 200) {
                  navigate("/auctions");
                } else {
                  alert(r.data);
                }
                return;
              } else {
                alert(res.data);
              }
              return;
            } else {
              return;
            }
        }
        Array.prototype.slice.call(document.getElementsByClassName("activeItem")).forEach(element => {
            element.classList.remove("activeItem");
        });
        selection.target.classList.add("activeItem");
        setCurrentComponent(selection.target.innerText);
    }

    const sideNavItems = [
        {
            text : "Options",
            iconClassName : "fa-solid fa-gear"
        },
        {
            text : "Teams",
            iconClassName : "fa-solid fa-user-group"
        },
        {
            text : "Players",
            iconClassName : "fa-solid fa-user-pen"
        },
        {
            text : "Auction",
            iconClassName : "fa-solid fa-gavel"
        },
        {
            text : "Live Stats",
            iconClassName : "fa-solid fa-wave-square"
        },
        {
            text : "Logout",
            iconClassName : "fa-solid fa-right-from-bracket text-danger"
        },
        {
            text : "Delete",
            iconClassName : "fa-solid fa-trash-can text-danger"
        }
    ]

    const makeSideNavItem = (item,active) => {
        return (
            <div key={`${item.iconClassName}`} className={`nav-item ${active ? "activeItem" : ""}`} onClick={e => {onSelect(e)}}>
                <i className={`${item.iconClassName}`}></i>
                {item.text}
            </div>
        )
    }

    const makeSideNavBar = () => {
        return sideNavItems.map(item => {
            return makeSideNavItem(item,!!(sideNavItems.indexOf(item) === 0));
        })
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
                        {makeSideNavBar()}
                    </div>
                    
                </div>
                {auctionData ? 
                <div className="col-10">
                    {currentComponent === "Options" ? <Option auctionObj = {auctionData} setAuctionObj = {setAuctionData} trigger = {toggleTrigger} /> : null}
                    {currentComponent === "Teams" ? <Teams auctionObj = {auctionData} trigger = {toggleTrigger} setAuctionObj = {setAuctionData}  /> : null}
                    {currentComponent === "Players" ? <Players auctionObj = {auctionData} setAuctionObj = {setAuctionData} trigger = {toggleTrigger}  /> : null}
                    {currentComponent === "Auction" ? <AuctionComponent auctionObj = {auctionData} trigger = {toggleTrigger}  /> : null}
                    {currentComponent === "Live Stats" ? <LiveStats auctionObj = {auctionData} trigger = {toggleTrigger}  /> : null}
                </div> : null}
            </div>
        </div>
    )
}

export default Auction;