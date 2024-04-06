import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCardTitle,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBTabs,
  MDBTabsContent,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsPane,
  MDBTypography,
} from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { simplify, number, fraction, round } from "mathjs";
import { updateTeam } from "../../feature/team";
import PolarAreaChart from "../common/PolarArea";
import { updatePlayer } from "../../feature/auctionPlayers";
import mqtt from "mqtt";
import { useParams } from "react-router";
import { utils, writeFile } from "xlsx";

const updateTeamRules = () => async (dispatch, getState) => {
  const rules = getState().rule.rules;
  rules.forEach(async (r) => {
    const teams = getState().team.teams;
    const players = getState().auctionPlayers.players;
    teams.forEach(async (t) => {
      const nT = JSON.parse(JSON.stringify(t));
      if (r.type == "team") {
        const cRule = JSON.parse(JSON.stringify(r));
        for (const key of Object.keys(t)) {
          const re = new RegExp(`\\b${key}\\b`, "g");
          while (cRule.rule.match(re)) {
            cRule.rule = cRule.rule.replace(re, t[key]);
          }
        }
        cRule.rule = simplify(cRule.rule).toString();
        while (cRule.rule.includes(" ")) {
          cRule.rule = cRule.rule.replace(" ", "");
        }
        let num = 0;
        try {
          num = round(number(fraction(cRule.rule)), 2);
        } catch (error) {
          console.log(error);
        }
        nT[r.name] = num;
      } else if (r.type == "player") {
        const teamPlayers = players.filter((p) => {
          if (t.players.find((pl) => pl._id == p._id)) {
            return true;
          }
          return false;
        });
        let avg = 0;
        teamPlayers.forEach(async (p) => {
          const cRule = JSON.parse(JSON.stringify(r));
          for (const key of Object.keys(p)) {
            const re = new RegExp(`\\b${key}\\b`, "g");
            while (cRule.rule.match(re)) {
              cRule.rule = cRule.rule.replace(re, p[key]);
            }
          }
          cRule.rule = simplify(cRule.rule).toString();
          while (cRule.rule.includes(" ")) {
            cRule.rule = cRule.rule.replace(" ", "");
          }
          let num = 0;
          try {
            num = round(number(fraction(cRule.rule)), 2);
          } catch (error) {
            console.log(error);
            console.log(cRule);
          }
          const nP = JSON.parse(JSON.stringify(p));
          nP[r.name] = num;
          avg += num;
          await dispatch(updatePlayer(nP));
        });
        avg = avg / teamPlayers.length;
        nT[`${r.name}avg`] = avg;
      }
      await dispatch(updateTeam(nT));
    });
  });
};

const LiveStats = () => {
  const [basicActive, setBasicActive] = useState("tab1");
  const dispatch = useDispatch();
  const { auctionId } = useParams();
  const handleBasicClick = (value) => {
    if (value === basicActive) {
      return;
    }
    setBasicActive(value);
  };

  // Load the data from local store
  // Parse the data with rules
  // After parsing save the data in store
  // Show the data

  const teams = useSelector((state) => state.team.teams);
  const rules = useSelector((state) => state.rule.rules);
  const players = useSelector((state) => state.auctionPlayers.players);
  const auction = useSelector((state) => state.auction.auction);

  const downloadCurrentTeamData = () => {
    const workbook = utils.book_new();
    for (const team of teams) {
      const pls = team.players.map((p) => {
        let pl = players.filter((pl) => pl._id == p._id)[0];
        pl = JSON.parse(JSON.stringify(pl));
        delete pl.imgUrl;
        delete pl.team_id;
        delete pl.sold;
        delete pl.includeInAuction;
        delete pl.isAdded;
        delete pl.isEdited;
        delete pl._id;
        delete pl.__v;
        return pl;
      });
      const worksheet = utils.json_to_sheet(pls);
      utils.book_append_sheet(workbook, worksheet, team.name);
    }
    writeFile(workbook, `${auction.name}_team_data.xlsx`);
  };

  useEffect(() => {
    if (teams.length && rules.length && players.length) {
      dispatch(updateTeamRules());
    }
    if (!auction.allowRealtimeUpdates) {
      return;
    }
    const client = mqtt.connect(import.meta.env.VITE_MQTT_HOST, {
      username: import.meta.env.VITE_MQTT_USERNAME,
      password: import.meta.env.VITE_MQTT_PASSWORD,
    });
    client.on("connect", () => {
      console.log("Connected !");
      console.log(auctionId);
      client.subscribe(`/${auctionId}`);
      client.on("message", (topic, message) => {
        console.log(topic);
        const data = JSON.parse(message);
        dispatch(updatePlayer(data.player));
        dispatch(updateTeam(data.team));
        dispatch(updateTeamRules());
      });
    });

    return () => {
      if (!auction.allowRealtimeUpdates) {
        return;
      }
      client.end();
    };
  }, []);

  // MQTT
  // Upon receiving new data update the data and parse with rules
  return (
    <>
      <MDBTabs fill className="mb-3">
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleBasicClick("tab1")}
            active={basicActive == "tab1"}
          >
            Live Stats
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleBasicClick("tab2")}
            active={basicActive == "tab2"}
          >
            Team Stats
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleBasicClick("tab4")}
            active={basicActive == "tab4"}
          >
            Players Overview
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleBasicClick("tab3")}
            active={basicActive == "tab3"}
          >
            Downloads
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>
      <MDBTabsContent>
        <MDBTabsPane open={basicActive == "tab1"}>
          <MDBContainer>
            <MDBRow>
              <MDBCol size={8}>
                {!auction.allowRealtimeUpdates ? (
                  <>
                    <MDBTypography note noteColor="info">
                      Realtime updates are turned off ! If wanted, turn on from
                      options tab.
                    </MDBTypography>
                  </>
                ) : null}
                {teams.length && players.length ?
                  teams.map((t) => (
                    <MDBCard key={t.key} className="my-3">
                      <MDBCardBody>
                        <MDBCardTitle>
                          <MDBTypography tag={"mark"}>{t.name}</MDBTypography>
                        </MDBCardTitle>
                        <div className="d-flex justify-content-center">
                          <div
                            className="border rounded overflow-auto"
                            style={{ maxHeight: "70vh" }}
                          >
                            <MDBTable>
                              <MDBTableHead>
                                <tr>
                                  <th scope="col">#</th>
                                  <th scope="col">Name</th>
                                  <th scope="col">Base Price</th>
                                  <th scope="col">Auctioned Price</th>
                                  <th scope="col">Sold Price</th>
                                  {rules.length ?
                                      rules.map((r) =>
                                          r.type == "player" ? (
                                            <th key={r.name} scope="col">
                                              {r.name}
                                            </th>
                                          ) : null,
                                      ) :
                                      null}
                                </tr>
                              </MDBTableHead>
                              <MDBTableBody>
                                {t.players.map((p) => (
                                  <tr key={p.id}>
                                    <td>
                                      {players.findIndex(
                                          (pl) => pl._id == p._id,
                                      ) + 1}
                                    </td>
                                    <td>
                                      {
                                        players.find((pl) => p._id == pl._id)
                                            .name
                                      }
                                    </td>
                                    <td>
                                      {
                                        players.find((pl) => p._id == pl._id)
                                            .basePrice
                                      }
                                    </td>
                                    <td>
                                      {
                                        players.find((pl) => p._id == pl._id)
                                            .auctionedPrice
                                      }
                                    </td>
                                    <td>
                                      {
                                        players.find((pl) => p._id == pl._id)
                                            .soldPrice
                                      }
                                    </td>
                                    {rules.length ?
                                        rules.map((r) =>
                                            r.type == "player" ? (
                                              <td key={r.name}>
                                                {
                                                  players.find(
                                                      (pl) => p._id == pl._id,
                                                  )[r.name]
                                                }
                                              </td>
                                            ) : null,
                                        ) :
                                        null}
                                  </tr>
                                ))}
                                <tr>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td>
                                    <MDBTypography className="mark rounded text-danger">
                                        Avg.
                                    </MDBTypography>
                                  </td>
                                  {rules.length ?
                                      rules.map((r) =>
                                          r.type == "player" ? (
                                            <td key={r.name}>
                                              {t[`${r.name}avg`]}
                                            </td>
                                          ) : null,
                                      ) :
                                      null}
                                </tr>
                              </MDBTableBody>
                            </MDBTable>
                          </div>
                        </div>
                      </MDBCardBody>
                    </MDBCard>
                  )) :
                  null}
              </MDBCol>
              <MDBCol size={4}>
                {rules.map((r) =>
                  r.type == "player" ? (
                    <MDBCard key={r.name} className="my-3">
                      <MDBCardBody>
                        <div style={{ height: "60vh" }}>
                          <PolarAreaChart
                            data={teams}
                            option={{
                              ykey: `${r.name}avg`,
                              xkey: "name",
                              ylabel: `${r.name}`,
                              xlabel: "value",
                              chartTitle: `${r.name} - Avg Value`,
                            }}
                          />
                        </div>
                      </MDBCardBody>
                    </MDBCard>
                  ) : null,
                )}
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </MDBTabsPane>
        <MDBTabsPane open={basicActive == "tab2"}>
          <MDBContainer>
            <MDBRow>
              <MDBCol size={8}>
                {!auction.allowRealtimeUpdates ? (
                  <>
                    <MDBTypography note noteColor="info">
                      Realtime updates are turned off ! If wanted, turn on from
                      options tab.
                    </MDBTypography>
                  </>
                ) : null}
                <MDBCard>
                  <MDBCardBody>
                    <div className="d-flex justify-content-center">
                      <div
                        className="border rounded overflow-auto"
                        style={{ maxHeight: "70vh" }}
                      >
                        <MDBTable striped>
                          <MDBTableHead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Name</th>
                              <th scope="col">Max Budget</th>
                              <th scope="col">Remaining Budget</th>
                              {rules.length ?
                                rules.map((r) =>
                                    r.type == "team" ? (
                                      <th key={r.name} scope="col">
                                        {r.name}
                                      </th>
                                    ) : null,
                                ) :
                                null}
                            </tr>
                          </MDBTableHead>
                          <MDBTableBody>
                            {teams.length ?
                              teams.map((t) => (
                                <tr key={t.key}>
                                  <td>{teams.indexOf(t) + 1}</td>
                                  <td>{t.name}</td>
                                  <td>{t.budget}</td>
                                  <td>{t.currentBudget}</td>
                                  {rules.length ?
                                      rules.map((r) =>
                                          r.type == "team" ? (
                                            <td key={r.name}>{t[r.name]}</td>
                                          ) : null,
                                      ) :
                                      null}
                                </tr>
                              )) :
                              null}
                          </MDBTableBody>
                        </MDBTable>
                      </div>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol size={4}>
                {rules.length && teams.length ?
                  rules.map((r) =>
                      r.type == "team" ? (
                        <MDBCard key={r.name}>
                          <MDBCardBody>
                            <div style={{ height: "60vh" }}>
                              <PolarAreaChart
                                data={teams}
                                option={{
                                  ykey: r.name,
                                  xkey: "name",
                                  ylabel: r.name,
                                  xlabel: "Some",
                                  chartTitle: `${r.name} - Rule Value`,
                                }}
                              />
                            </div>
                          </MDBCardBody>
                        </MDBCard>
                      ) : null,
                  ) :
                  null}
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </MDBTabsPane>
        <MDBTabsPane open={basicActive == "tab3"}>
          <div className="w-50">
            <MDBTypography note noteColor="warning">
              Please do check the datasheet before handing out ! It might
              contain sensitive info for winner judgetment !
            </MDBTypography>
          </div>
          <MDBBtn onClick={downloadCurrentTeamData}>
            Download Current Team Data
          </MDBBtn>
        </MDBTabsPane>
        <MDBTabsPane open={basicActive == "tab4"}>
          <div className="d-flex justify-content-evenly">
            <MDBCard>
              <MDBCardBody>
                <MDBCardTitle>Total Players</MDBCardTitle>
                <MDBCardText>
                  <MDBTypography className="display-6 text-center">
                    {players.length}
                  </MDBTypography>
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
            <MDBCard>
              <MDBCardBody>
                <MDBCardTitle>Sold Players</MDBCardTitle>
                <MDBCardText>
                  <MDBTypography className="display-6 text-center">
                    {players.filter((p) => p.sold == true).length}
                  </MDBTypography>
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
            <MDBCard>
              <MDBCardBody>
                <MDBCardTitle>Unsold Players</MDBCardTitle>
                <MDBCardText>
                  <MDBTypography className="display-6 text-center">
                    {players.length -
                      players.filter((p) => p.sold == true).length}
                  </MDBTypography>
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </div>
          <hr className="hr" />
          <div className="d-flex justify-content-evenly mt-3">
            <MDBCard>
              <MDBCardBody>
                <MDBCardTitle>
                  <MDBTypography className="mark">Sold Players</MDBTypography>
                </MDBCardTitle>
                <div
                  className="border rounded overflow-auto"
                  style={{ maxHeight: "70vh" }}
                >
                  <MDBTable align="middle" striped>
                    <MDBTableHead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Base Price</th>
                        <th scope="col">Sold Price</th>
                        <th scope="col">Team Name</th>
                      </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                      {players
                          .filter((p) => p.sold == true)
                          .map((p) => (
                            <tr key={p._id}>
                              <td>
                                {players.findIndex((pl) => pl._id == p._id) + 1}
                              </td>
                              <td>{p.name}</td>
                              <td>{p.basePrice}</td>
                              <td>{p.soldPrice}</td>
                              <td>{p.teamName}</td>
                            </tr>
                          ))}
                    </MDBTableBody>
                  </MDBTable>
                </div>
              </MDBCardBody>
            </MDBCard>
            <MDBCard>
              <MDBCardBody>
                <MDBCardTitle>
                  <MDBTypography className="mark">Unsold Players</MDBTypography>
                </MDBCardTitle>
                <div
                  className="border rounded overflow-auto"
                  style={{ maxHeight: "70vh" }}
                >
                  <MDBTable align="middle" striped>
                    <MDBTableHead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                      </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                      {players
                          .filter((p) => p.sold != true)
                          .map((p) => (
                            <tr key={p._id}>
                              <td>
                                {players.findIndex((pl) => pl._id == p._id) + 1}
                              </td>
                              <td>{p.name}</td>
                            </tr>
                          ))}
                    </MDBTableBody>
                  </MDBTable>
                </div>
              </MDBCardBody>
            </MDBCard>
          </div>
        </MDBTabsPane>
      </MDBTabsContent>
    </>
  );
};

export default LiveStats;
