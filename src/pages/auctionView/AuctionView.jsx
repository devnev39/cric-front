import auctionApi from "../../api/auction";
import rulesApi from "../../api/rule";
import teamsApi from "../../api/team";
import bidApi from "../../api/bid";
import auctionPlayersApi from "../../api/auctionPlayers";
import { useDispatch, useSelector } from "react-redux";
import { updateAuction } from "../../feature/auction";
import { setRules } from "../../feature/rule";
import { setTeams, updateTeam } from "../../feature/team";
import { setCountryCodes } from "../../feature/countries";
import {
  setCustomPlayers,
  setPlayers,
  updatePlayer,
} from "../../feature/auctionPlayers";
import { fetchCountryCodes } from "../../api/countryCodes";
import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBModal,
  MDBModalBody,
  MDBModalContent,
  MDBModalDialog,
  MDBModalFooter,
  MDBModalHeader,
  MDBModalTitle,
  MDBRow,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBTypography,
} from "mdb-react-ui-kit";
import { useParams } from "react-router";
import LineBarChart from "../../components/common/LineBarChart";
import "./styles.css";

const budgetChartOptions = {
  indexAxis: "y",
  xkey: "name",
  ylinekey: "budget",
  ybarkey: "currentBudget",
  xlabel: "Budget Value",
  ylinelabel: "Max Budget",
  ybarlabel: "Remaining Budget",
  chartTitle: "Team Budget",
  // chartTitleSize: 20,
  chartTitlePosition: "top",
};

const AuctionView = () => {
  const [index, setIndex] = useState(0);
  const players = useSelector((state) => state.auctionPlayers.players);
  const teams = useSelector((state) => state.team.teams);
  const { auctionId } = useParams();

  const [basicModal, setBasicModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [soldPrice, setSoldPrice] = useState(null);

  const toggleOpen = () => {
    setBasicModal(!basicModal);
    setSelectedTeam(null);
    setSoldPrice(null);
  };

  const auction = useSelector((state) => state.auction.auction);
  const contryCodes = useSelector((state) => state.countryCodes.countryCodes);
  const dispatch = useDispatch();

  const abortController = new AbortController();
  const signal = abortController.signal;

  const fetchAuctionData = () => {
    auctionApi
        .getAuction(auctionId)
        .then((response) => response.json())
        .then((response) => {
          if (!response.status) {
            alert(response.data);
            if (response.errorCode > 500 && response.errorCode < 600) {
              const key = encrypt(
                  prompt(`Enter password for ${state.auction.Name} : `),
              );
              authenticateResponse(response, {
                _id: auctionId,
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
                    window.alert(`${resp.errorCode} : ${resp.data}`);
                  }
                });
            teamsApi
                .getTeams(response.data._id, signal)
                .then((resp) => resp.json())
                .then((resp) => {
                  if (resp.status) {
                    dispatch(setTeams(resp.data));
                  } else {
                    window.alert(`${resp.errorCode} : ${resp.data}`);
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
                    window.alert(`${resp.errorCode} : ${resp.data}`);
                  }
                });
          }
        });

    fetchCountryCodes()
        .then((resp) => resp.json())
        .then((resp) => {
          const rev = Object.entries(resp).map(([key, value]) => [value, key]);
          dispatch(setCountryCodes(Object.fromEntries(rev)));
        });
  };

  const nextPlayer = () => {
    if (index < players.length) {
      setIndex(index + 1);
    }
  };

  const prevPlayer = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const searchAndSetplayer = () => {
    if (players.length == 0) {
      window.alert("No players found !");
      return;
    }
    const inp = parseInt(prompt("Enter player number/index : "));
    if (inp > 0 && inp <= players.length) {
      setIndex(inp - 1);
    } else {
      window.alert(`Player number should be between ${1} - ${players.length}`);
    }
  };

  const confirmBid = () => {
    bidApi
        .placeBid(auctionId, players[index], selectedTeam, soldPrice, signal)
        .then((res) => res.json())
        .then((res) => {
          if (res.status) {
            dispatch(updatePlayer(res.data.player));
            dispatch(updateTeam(res.data.team));
            window.alert("Success !");
            toggleOpen();
          } else {
            window.alert(`${res.errorCode} : ${res.data}`);
          }
        })
        .catch((err) => {
          window.alert(`${err}`);
        });
  };

  const revertBid = () => {
    if (!window.confirm("Confirm to revert bid ? ")) {
      return;
    }
    bidApi
        .revertBid(auctionId, players[index], signal)
        .then((res) => res.json())
        .then((res) => {
          if (res.status) {
            dispatch(updatePlayer(res.data.player));
            dispatch(updateTeam(res.data.team));
            window.alert("Success !");
          } else {
            window.alert(`${res.errorCode} : ${res.data}`);
          }
        })
        .catch((err) => {
          window.alert(`${err}`);
        });
  };

  useEffect(() => {
    if (Object.keys(auction).length == 0) {
      fetchAuctionData();
    }
  }, []);
  // Make an information dispay UI
  // Bid console
  // Updating graph

  // After bid update the team in redux
  return (
    <>
      <MDBContainer className="mt-3">
        <MDBRow>
          <MDBCol size={4} className="mt-5">
            <MDBTypography className="display-5 mt-3 text-danger">
              {players.length ? players[index].name : null}
            </MDBTypography>
            <MDBTypography className="display-6 mt-4">
              {players.length ? players[index].playingRole : null}
            </MDBTypography>
            <MDBTypography className="display-6 mt-4">
              {players.length ? players[index].cua : null}
            </MDBTypography>
            <MDBTypography className="display-6 mt-4">
              {players.length ? players[index].iplMatches : null} Matches
            </MDBTypography>
            <MDBTypography className="display-6 mt-4">
              {players.length ? players[index].country : null}
            </MDBTypography>
            <MDBTypography className="display-6 mt-4 mark text-danger">
              {players.length ? players[index].basePrice : null} Lakhs
            </MDBTypography>
          </MDBCol>
          <MDBCol size={4}>
            <div>
              <img
                className="img-thumbnail"
                src={players.length ? players[index].imgUrl : null}
              />
            </div>
            <div className="d-flex justify-content-center mt-3">
              {players.length ? (
                <img
                  src={`https://flagcdn.com/64x48/${contryCodes[players[index].country]}.png`}
                  srcSet={`https://flagcdn.com/128x96/${contryCodes[players[index].country]}.png 2x,
                https://flagcdn.com/128x96/${contryCodes[players[index].country]}.png 3x`}
                  width="64"
                  height="48"
                />
              ) : null}
            </div>
            {players.length ? (
              players[index].sold ? (
                <div className="mt-2 d-flex justify-content-center mt-4">
                  <MDBTypography variant="h5">
                    Sold to :
                    <MDBTypography className="text-danger" tag={"mark"}>
                      {players[index].teamName}
                    </MDBTypography>
                  </MDBTypography>
                </div>
              ) : null
            ) : null}
          </MDBCol>
          <MDBCol size={4}>
            {teams.length ? (
              <div style={{ height: "60vh" }} className="rounded shadow p-3">
                <LineBarChart data={teams} option={budgetChartOptions} />
              </div>
            ) : null}
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <hr className="hr mt-5" />
      <div className="d-flex justify-content-evenly mt-5">
        <MDBBtn
          disabled={index == 0 ? true : false}
          onClick={() => prevPlayer()}
        >
          <MDBIcon fas icon="angle-left" />
        </MDBBtn>
        <MDBBtn
          className="btn btn-success"
          disabled={
            players.length ? (players[index].sold ? true : false) : false
          }
          onClick={() => toggleOpen()}
        >
          <MDBIcon fas icon="check" />
        </MDBBtn>
        <MDBBtn className="btn btn-info" onClick={() => searchAndSetplayer()}>
          <MDBIcon fas icon="search" />
        </MDBBtn>
        <MDBBtn
          className="btn btn-danger"
          disabled={
            players.length ? (players[index].sold ? false : true) : true
          }
          onClick={() => revertBid()}
        >
          <MDBIcon fas icon="times" />
        </MDBBtn>
        <MDBBtn
          disabled={index == players.length - 1 ? true : false}
          onClick={() => nextPlayer()}
        >
          <MDBIcon fas icon="angle-right" />
        </MDBBtn>
      </div>
      <MDBModal open={basicModal} setOpen={setBasicModal} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Bid Console</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleOpen}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <div className="d-flex justify-content-center w-100">
                <div className="border rounded px-2">
                  <MDBTable>
                    <MDBTableHead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Budget</th>
                        <th scope="col">Max Budget</th>
                        <th scope="col">Action</th>
                      </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                      {teams.length ?
                        teams.map((t) => (
                          <tr
                            key={t.key}
                            className={`${t.currentBudget > 0.5 * t.budget ? "table-success" : t.currentBudget > 0.25 * t.budget ? "table-primary" : "table-danger"}`}
                          >
                            <td>{teams.indexOf(t) + 1}</td>
                            <td>{t.name}</td>
                            <td>{t.currentBudget}</td>
                            <td>{t.budget}</td>
                            <td>
                              <MDBBtn
                                color="link"
                                size="sm"
                                rippleColor="success"
                                rounded
                                onClick={() => setSelectedTeam(t)}
                              >
                                  Select
                              </MDBBtn>
                            </td>
                          </tr>
                        )) :
                        null}
                    </MDBTableBody>
                  </MDBTable>
                </div>
              </div>
              {selectedTeam ? (
                <div className="w-100 mt-3 d-flex justify-content-center">
                  <div>
                    <MDBTypography>
                      Selected Team :
                      <MDBTypography tag={"mark"}>
                        {selectedTeam.name}
                      </MDBTypography>
                    </MDBTypography>
                    <MDBInput
                      onChange={(v) => setSoldPrice(v.target.value)}
                      label="Bid Amount"
                      type="number"
                    />
                  </div>
                </div>
              ) : null}
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleOpen}>
                Close
              </MDBBtn>
              <MDBBtn
                className="btn btn-success"
                onClick={() => confirmBid()}
                disabled={!selectedTeam || !soldPrice}
              >
                Bid
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default AuctionView;
