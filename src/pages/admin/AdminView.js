import { useEffect, useState } from "react"
import settings from "../../config/settings";
import { useNavigate, useLocation } from "react-router";
import "./styles.css";
import Users from "../../components/adminView/Users";
import AuctionConfig from "../../components/adminView/AuctionConfig";

function AdminView() {
    const [currentComponent, setCurrentComponent] = useState("Users");
    const {state} = useLocation();
    const navigate = useNavigate();
    let options = [
        {
            text : "Users",
            iconClassName: "fa-solid fa-user"
        },
        {
            text: "Auctions",
            iconClassName: "fa-solid fa-gavel"
        },
        {
            text: "Logout",
            iconClassName: "fa-solid fa-right-from-bracket"
        }
    ]

    const onSelect = async (selection) => {
        if(selection.target.innerText === "Logout") {
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
        Array.prototype.slice.call(document.getElementsByClassName("activeItem")).forEach(element => {
            element.classList.remove("activeItem");
        });
        selection.target.classList.add("activeItem");
        setCurrentComponent(selection.target.innerText);
    }

    const makeOptionItem = (item, active) => {
        return (
            <div key={`${item.iconClassName}`} className={`nav-item ${active ? "activeItem" : ""}`} onClick={e => {onSelect(e)}}>
                <i className={`${item.iconClassName}`}></i>
                {item.text}
            </div>
        )
    }

    const makeOptionBar = () => {
        const opts = 
            options.map(opt => {
                return makeOptionItem(opt, options.indexOf(opt) === 0);
            });
        console.log(opts);
        return opts;
    }

    const check_login = async () => {
        const resp = await (await fetch(`${settings.BaseUrl}/admin`,{credentials : "include"})).json()
        if(resp.status !== 601) {
          navigate(-1);
        }
    }

    useEffect(() => {
        check_login();
    },[]);

    if(!state){
        window.alert("Cannot identify the route ! State not found !");
        return;
    }

    if(!state.fromAdmin){
        window.alert("Cannot identify the route !")
        return;
    }

    return (
        <>
         <div className="auctionRoot">
            <div className="row">
                <div className="col-2 border-right vh-100">
                    <div className="menuContainer">
                        {
                            makeOptionBar()
                        }
                    </div>   
                </div>
                <div className="col-10">
                    {currentComponent ? currentComponent === "Users" ? <Users /> : null : null }
                    {currentComponent ? currentComponent === "Auctions" ? <AuctionConfig /> : null : null }
                </div>
            </div>
        </div>
        </>
    )    
}

export default AdminView;
