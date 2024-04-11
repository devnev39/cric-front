import React, { useEffect, useState, useContext } from "react";
import settings from "../../config/settings";
import auctionApi from "../../api/auction";
import usersApi from "../../api/user";
import { useNavigate, useLocation } from "react-router";
import "./styles.css";
import Users from "../../components/adminView/Users";
import AuctionConfig from "../../components/adminView/AuctionConfig";
import { useDispatch } from "react-redux";
import { setAuctions } from "../../feature/auction";
import { setUsers } from "../../feature/users";
import { AlertContext } from "../../context/AlertContext";
import Footer from "../Footer";

const AdminView = () => {
  const [currentComponent, setCurrentComponent] = useState("Users");
  const { state } = useLocation();

  const controller = new AbortController();
  const signal = controller.signal;

  const dispatch = useDispatch();

  const { showMessage } = useContext(AlertContext);

  const navigate = useNavigate();
  const options = [
    {
      text: "Users",
      iconClassName: "fa-solid fa-user",
    },
    {
      text: "Auctions",
      iconClassName: "fa-solid fa-gavel",
    },
    {
      text: "Logout",
      iconClassName: "fa-solid fa-right-from-bracket",
    },
  ];

  const onSelect = async (selection) => {
    if (selection.target.innerText === "Logout") {
      if (window.confirm("Do you want to logout ?")) {
        const res = await (
          await fetch(`${settings.BaseUrl}/logout`, { credentials: "include" })
        ).json();
        if (res.status) {
          alert("Logged out !");
          navigate("/auctions");
          return;
        } else {
          alert(res.data);
        }
        return;
      } else {
        return;
      }
    }
    Array.prototype.slice
        .call(document.getElementsByClassName("activeItem"))
        .forEach((element) => {
          element.classList.remove("activeItem");
        });
    selection.target.classList.add("activeItem");
    setCurrentComponent(selection.target.innerText);
  };

  const makeOptionItem = (item, active) => {
    return (
      <div
        key={`${item.iconClassName}`}
        className={`side-nav-item ${active ? "activeItem" : ""}`}
        onClick={(e) => {
          onSelect(e);
        }}
      >
        <i className={`${item.iconClassName}`}></i>
        {item.text}
      </div>
    );
  };

  const makeOptionBar = () => {
    const opts = options.map((opt) => {
      return makeOptionItem(opt, options.indexOf(opt) === 0);
    });
    return opts;
  };

  const checkLogin = async () => {
    const resp = await (
      await fetch(`${settings.BaseUrl}/admin`, { credentials: "include" })
    ).json();
    if (!resp.status && resp.errorCode !== 601) {
      navigate(-1);
    }
  };

  const fetchData = () => {
    auctionApi
        .getAllAuctionsAdmin(signal)
        .then((resp) => resp.json())
        .then((resp) => {
          if (resp.status) {
            dispatch(setAuctions(resp.data));
          } else {
            showMessage(`${resp.errorCode} : ${resp.data}`, "error");
          }
        })
        .catch((err) => {
          showMessage(`Get All Auctions : ${err}`);
        });

    usersApi
        .getUsers(signal)
        .then((res) => res.json())
        .then((res) => {
          if (res.status) {
            dispatch(setUsers(res.data));
          } else {
            showMessage(`${res.errorCode} : ${res.data}`, "error");
          }
        })
        .catch((err) => {
          showMessage(`Get All Users : ${err}`);
        });
  };

  useEffect(() => {
    checkLogin();
    fetchData();
  }, []);

  if (!state) {
    showMessage("Cannot identify the route ! State not found !");
    return;
  }

  if (!state.fromAdmin) {
    showMessage("Cannot identify the route !");
    return;
  }

  return (
    <>
      <div className="auctionRoot">
        <div className="row">
          <div className="col-2 border-right vh-100">
            <div className="menuContainer">{makeOptionBar()}</div>
          </div>
          <div className="col-10">
            {currentComponent ? (
              currentComponent === "Users" ? (
                <Users />
              ) : null
            ) : null}
            {currentComponent ? (
              currentComponent === "Auctions" ? (
                <AuctionConfig />
              ) : null
            ) : null}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminView;
