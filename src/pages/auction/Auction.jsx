import auctionApi from "../../api/auction";
import rulesApi from "../../api/rule";
import teamsApi from "../../api/team";
import auctionPlayersApi from "../../api/auctionPlayers";
import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import encrypt from "../../components/common/Encrypt";
import authenticateResponse from "../../components/common/authenticateResponse";
import Option from "../../components/auction/Option";
import Teams from "../../components/auction/Teams";
import { Auction as AuctionComponent } from "../../components/auction/Auction";
import Players from "../../components/auction/Players";
import LiveStats from "../../components/auction/LiveStats";
import "./styles.css";
import { useDispatch, useSelector } from "react-redux";
import { updateAuction } from "../../feature/auction";
import { setRules, setSampleRules } from "../../feature/rule";
import { setTeams } from "../../feature/team";
import { setCountryCodes } from "../../feature/countries";
import { setCustomPlayers, setPlayers } from "../../feature/auctionPlayers";
import { fetchCountryCodes } from "../../api/countryCodes";
import QueryBuiler from "../../helpers/queryBuilder";
import defaultPlayersApi from "../../api/players";
import Footer from "../Footer";
import { setQueryData } from "../../feature/query";
import { AlertContext } from "../../context/AlertContext";
import { MDBTypography } from "mdb-react-ui-kit";

const Auction = () => {
  const { state } = useLocation();
  const { auctionId } = useParams();
  const [currentComponent, setCurrentComponent] = useState("Options");
  const [trigger, setTrigger] = useState(false);
  const { showMessage } = useContext(AlertContext);
  const auctionData = useSelector((state) => state.auction.auction);

  const abortController = new AbortController();
  const signal = abortController.signal;

  const dispatch = useDispatch();

  const toggleTrigger = () => {
    setTrigger(!trigger);
  };
  const navigate = useNavigate();
  if (!state) {
    alert("Cannot identify the route !");
    navigate(-1);
  }

  const qb = new QueryBuiler();

  const buildQuery = (queries) => {
    qb.clear();
    return queries;
  };

  const queries = [
    {
      accessor: "price",
      query: buildQuery(qb.sort({ BasePrice: -1 }).limit(10).queries),
    },
    {
      accessor: "players",
      query: buildQuery(qb.count("name").queries),
    },
    {
      accessor: "countries",
      query: buildQuery(qb.group({ _id: "$country" }).queries),
    },
    {
      accessor: "iplteams",
      query: buildQuery(qb.group({ _id: "$ipl2022Team" }).queries),
    },
  ];

  const fetchQueries = () => {
    defaultPlayersApi
        .query(queries)
        .then((resp) => resp.json())
        .then((resp) => {
          if (resp.status && resp.data) {
            dispatch(setQueryData(resp.data));
          } else {
            showMessage(`${resp.errorCode} : ${resp.data}`, "error");
          }
        })
        .catch((err) => {
          showMessage(`${err}`, "error");
        });
  };

  const fetchAuctionData = async () => {
    if (state.auction._id !== auctionId) {
      alert("Invalid id !");
      return;
    }

    auctionApi
        .getAuction(state.auction._id)
        .then((response) => response.json())
        .then((response) => {
          if (!response.status) {
            alert(response.data);
            if (response.errorCode > 500 && response.errorCode < 600) {
              const key = encrypt(
                  prompt(`Enter password for ${state.auction.name} : `),
              );
              authenticateResponse(response, {
                _id: state.auction._id,
                password: key,
              }).then((authenticate) => {
                if (authenticate.status === true) {
                  window.location.reload();
                } else {
                  alert(authenticate.data);
                  navigate(-1);
                }
              });
            }
          } else {
            dispatch(updateAuction(response.data));
            rulesApi
                .getRules(response.data._id, signal)
                .then((resp) => resp.json())
                .then((resp) => {
                  if (resp.status) {
                    dispatch(setRules(resp.data));
                  } else {
                    showMessage(`${resp.errorCode} : ${resp.data}`, "error");
                  }
                });
            rulesApi
                .getAllRules(signal)
                .then((resp) => resp.json())
                .then((resp) => {
                  if (resp.status) {
                    const rules = resp.data.filter(
                        (r) => r.auctionId != response.data._id,
                    );
                    dispatch(setSampleRules(rules));
                  } else {
                    showMessage(`${resp.errorCode} : ${resp.data}`, "error");
                  }
                })
                .catch((err) => {
                  showMessage(`${err}`, "error");
                });
            teamsApi
                .getTeams(response.data._id, signal)
                .then((resp) => resp.json())
                .then((resp) => {
                  if (resp.status) {
                    dispatch(setTeams(resp.data));
                  } else {
                    showMessage(`${resp.errorCode} : ${resp.data}`, "error");
                  }
                });
            auctionPlayersApi
                .getAuctionPlayers(response.data._id, signal)
                .then((resp) => resp.json())
                .then((resp) => {
                  if (resp.status && resp.data) {
                    dispatch(setPlayers(resp.data.players));
                    dispatch(setCustomPlayers(resp.data.customPlayers));
                  } else {
                    showMessage(`${resp.errorCode} : ${resp.data}`, "error");
                  }
                });
            fetchQueries();
          }
        });

    fetchCountryCodes()
        .then((resp) => resp.json())
        .then((resp) => {
          const rev = Object.entries(resp).map(([key, value]) => [value, key]);
          dispatch(setCountryCodes(Object.fromEntries(rev)));
        });
  };

  const onSelect = async (selection) => {
    if (selection.target.innerText === "Logout") {
      if (window.confirm("Do you want to logout ?")) {
        const res = await (await auctionApi.logoutAuction(signal)).json();
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
    if (selection.target.innerText === "Delete") {
      if (window.confirm("Do you want to delete this auction ?")) {
        const deleteId = prompt("Enter delete admin id : ");
        auctionApi
            .deleteAuction(auctionData, deleteId, signal)
            .then((resp) => resp.json())
            .then((resp) => {
              console.log(resp);
              if (resp.status) {
                auctionApi
                    .logoutAuction(signal)
                    .then((r) => r.json())
                    .then((r) => {
                      if (r.status) {
                        navigate("/auctions");
                      } else {
                        alert(r.data);
                      }
                      return;
                    })
                    .catch((err) => {
                      showMessage(`${err}`, "error");
                    });
              } else {
                alert(resp.data);
              }
              return;
            })
            .catch((err) => {
              showMessage(`${err}`, "error");
            });
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

  const sideNavItems = [
    {
      text: "Options",
      iconClassName: "fa-solid fa-gear",
    },
    {
      text: "Teams",
      iconClassName: "fa-solid fa-user-group",
    },
    {
      text: "Players",
      iconClassName: "fa-solid fa-user-pen",
    },
    {
      text: "Auction",
      iconClassName: "fa-solid fa-gavel",
    },
    {
      text: "Live Stats",
      iconClassName: "fa-solid fa-wave-square",
    },
    {
      text: "Logout",
      iconClassName: "fa-solid fa-right-from-bracket text-danger",
    },
    {
      text: "Delete",
      iconClassName: "fa-solid fa-trash-can text-danger",
    },
  ];

  const makeSideNavItem = (item, active) => {
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

  const makeSideNavBar = () => {
    return sideNavItems.map((item) => {
      return makeSideNavItem(item, !!(sideNavItems.indexOf(item) === 0));
    });
  };

  useEffect(() => {
    fetchAuctionData();
  }, [trigger]);
  return (
    <>
      <div className="auctionRoot">
        <div className="row">
          <div className="col-2 border-right vh-100">
            <div className="menuContainer">{makeSideNavBar()}</div>
          </div>
          {auctionData ? (
            <div className="col-10">
              {auctionData.freeze ? (
                <MDBTypography note noteColor="warning" className="mt-3">
                  <strong>Warning : </strong>This auction has been freezed by
                  admin! It will operate in read only mode. Contact admin for
                  any clearances!
                </MDBTypography>
              ) : null}
              {currentComponent === "Options" ? <Option /> : null}
              {currentComponent === "Teams" ? <Teams /> : null}
              {currentComponent === "Players" ? <Players /> : null}
              {currentComponent === "Auction" ? (
                <AuctionComponent
                  auctionObj={auctionData}
                  trigger={toggleTrigger}
                />
              ) : null}
              {currentComponent === "Live Stats" ? (
                <LiveStats auctionObj={auctionData} trigger={toggleTrigger} />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Auction;
