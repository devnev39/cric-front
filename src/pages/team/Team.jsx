import React, { useEffect, useState } from "react";
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
            window.alert(`${res.errorCode} : ${res.data}`);
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
        console.log(observableTeam.auctionId);
        client.subscribe(`/${observableTeam.auctionId}`);
        client.on("message", (topic, message) => {
          console.log(topic);
          const data = JSON.parse(message);
          console.log(data);
          if (data.player.sold && data.player.team_id == observableTeam._id) {
            dispatch(updateObservableTeam(data.player));
          } else if (!data.player.sold) {
            dispatch(updateObservableTeam(data.player));
          }
        });
      });
    }
  }, [observableTeam]);
  return Object.keys(observableTeam).length ? (
    <>
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
                    <MDBTable>
                      <MDBTableHead>
                        <tr>
                          <th scope="col">Name</th>
                          <th scope="col">Country</th>
                          <th scope="col">Base Price</th>
                          <th scope="col">Sold Price</th>
                        </tr>
                      </MDBTableHead>
                      <MDBTableBody>
                        {observableTeam.players.map((p) => (
                          <tr key={p._id}>
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
      <Footer />
    </>
  ) : (
    <>
      <div className="d-flex justify-content-center mt-3">
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
      <Footer />
    </>
  );
};

export default Team;
