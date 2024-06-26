import React, { useEffect, useState, useContext } from "react";
import teamApi from "../../api/team";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCardTitle,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRow,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBTypography,
} from "mdb-react-ui-kit";
import { AlertContext } from "../../context/AlertContext";
import { useDispatch, useSelector } from "react-redux";
import { setObservableTeam, updateObservableTeam } from "../../feature/team";
import mqtt from "mqtt";
import { updateAuction } from "../../feature/auction";
import Footer from "../Footer";

const Team = () => {
  // Fetch team data with players
  const [teamKey, setTeamKey] = useState(null);
  const observableTeam = useSelector((state) => state.team.observableTeam);
  const auction = useSelector((state) => state.auction.auction);

  const dispatch = useDispatch();
  const { showMessage } = useContext(AlertContext);

  const controller = new AbortController();
  const signal = controller.signal;

  const findTeam = () => {
    teamApi
        .getTeam(teamKey, signal)
        .then((res) => res.json())
        .then((res) => {
          if (res.status) {
            dispatch(setObservableTeam(res.data.team));
            dispatch(updateAuction(res.data.auction));
          } else {
            showMessage(`${res.errorCode} : ${res.data}`, "error");
          }
        });
  };

  useEffect(() => {
    if (Object.keys(observableTeam).length) {
      const client = mqtt.connect(import.meta.env.VITE_MQTT_HOST, {
        username: import.meta.env.VITE_MQTT_USERNAME,
        password: import.meta.env.VITE_MQTT_PASSWORD,
      });
      client.on("connect", () => {
        console.log("Connected !");
        client.subscribe(`/${observableTeam.auctionId}`);
        client.on("message", (topic, message) => {
          const data = JSON.parse(message);
          if (data.player.sold && data.player.team_id == observableTeam._id) {
            dispatch(updateObservableTeam(data));
          } else if (!data.player.sold) {
            dispatch(updateObservableTeam(data));
          }
        });
      });
    }
  }, [observableTeam]);
  return Object.keys(observableTeam).length ? (
    <>
      <div style={{ minHeight: "75vh" }}>
        <MDBContainer className="mt-3">
          <MDBRow>
            <MDBCol size={12}>
              <MDBCard>
                <MDBCardBody>
                  <div className="d-flex justify-content-center">
                    <MDBCardText>
                      <MDBTypography className="display-6">
                        {auction.name}
                      </MDBTypography>
                    </MDBCardText>
                  </div>
                  <div className="d-flex justify-content-center">
                    <MDBTypography tag={"mark"} className="h2">
                      {observableTeam.name}
                    </MDBTypography>
                  </div>
                  <div className="d-flex justify-content-evenly">
                    <div
                      className="border rounded overflow-auto"
                      style={{ maxHeight: "60vh" }}
                    >
                      <MDBTable striped align="center">
                        <MDBTableHead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Country</th>
                            <th scope="col">Base Price</th>
                            <th scope="col">Sold Price</th>
                          </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                          {observableTeam.players.map((p) => (
                            <tr key={p._id}>
                              <td>
                                {observableTeam.players.findIndex(
                                    (pl) => pl._id == p._id,
                                ) + 1}
                              </td>
                              <td>{p.name}</td>
                              <td>{p.country}</td>
                              <td>{p.basePrice}</td>
                              <td>{p.soldPrice}</td>
                            </tr>
                          ))}
                        </MDBTableBody>
                      </MDBTable>
                    </div>
                    <MDBCard>
                      <MDBCardBody>
                        <MDBCardTitle>Remaining Budget</MDBCardTitle>
                        <MDBCardText>
                          <MDBTypography className="mark display-6">
                            {observableTeam.currentBudget}
                          </MDBTypography>
                        </MDBCardText>
                      </MDBCardBody>
                    </MDBCard>
                  </div>
                  {!auction.allowRealtimeUpdates ? (
                    <div className="d-flex justify-content-center mt-3">
                      <MDBTypography note noteColor="info">
                        Realtime updates are turned off.
                      </MDBTypography>
                    </div>
                  ) : null}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
      <Footer />
    </>
  ) : (
    <>
      <div style={{ height: "75vh" }}>
        <div className="d-flex justify-content-center align-items-center mt-3">
          <MDBCard className="w-25">
            <MDBCardBody>
              <MDBCardText>
                <MDBTypography variant="h5">Enter Team Key</MDBTypography>
              </MDBCardText>
              <MDBInput
                onChange={(e) => setTeamKey(e.target.value)}
                label="Team Key"
              />
              <div className="d-flex justify-content-center">
                <MDBBtn
                  onClick={() => findTeam()}
                  color="success"
                  className="mt-3"
                >
                  Submit
                </MDBBtn>
              </div>
            </MDBCardBody>
          </MDBCard>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Team;
