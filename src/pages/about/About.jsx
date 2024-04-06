import React from "react";
import Footer from "../Footer";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBTypography,
  MDBIcon,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";
import ss1 from "../../resources/ss1.png";
import ss2 from "../../resources/ss2.png";
import ReactIcon from "../../resources/react.svg?react";
import MdbIcon from "../../resources/mdb.svg?react";
import ReduxIcon from "../../resources/redux.svg?react";
import DockerIcon from "../../resources/docker.svg?react";
import MongoIcon from "../../resources/mongo.svg?react";
import VercelIcon from "../../resources/vercel.svg?react";

const About = () => {
  return (
    <>
      <div style={{ minHeight: "75vh", marginTop: "1rem" }}>
        <MDBContainer>
          <MDBRow>
            <MDBCol size={6}>
              <MDBCard>
                <MDBCardBody>
                  <MDBTypography className="display-6">
                    <MDBTypography tag={"mark"}>Streamlined</MDBTypography>
                    Cricket Auction Management
                  </MDBTypography>
                  <MDBContainer>
                    <MDBRow>
                      <MDBCol size={1}>
                        <MDBIcon icon="check-circle" className="text-success" />
                      </MDBCol>
                      <MDBCol>
                        <MDBTypography blockquote>
                          Run multiple auctions with the same player pool or
                          easily adjust player data for each event.
                        </MDBTypography>
                      </MDBCol>
                    </MDBRow>
                    <MDBRow>
                      <MDBCol size={1}>
                        <MDBIcon icon="check-circle" className="text-success" />
                      </MDBCol>
                      <MDBCol>
                        <MDBTypography blockquote>
                          Manage teams and player information efficiently,
                          saving you time and effort.
                        </MDBTypography>
                      </MDBCol>
                    </MDBRow>
                  </MDBContainer>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol size={6}>
              <MDBCard>
                <MDBCardBody>
                  <img style={{ width: "40vw" }} src={ss2} />
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        <hr className="hr" />
        <MDBContainer className="mt-3">
          <MDBRow>
            <MDBCol size={6}>
              <MDBCard>
                <MDBCardBody>
                  <img style={{ width: "40vw" }} src={ss1} />
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol size={6}>
              <MDBCard>
                <MDBCardBody>
                  <MDBTypography className="display-6">
                    <MDBTypography tag={"mark"}>Real-Time</MDBTypography>
                    Transparency and Engagement
                  </MDBTypography>
                  <MDBContainer>
                    <MDBRow>
                      <MDBCol size={1}>
                        <MDBIcon icon="check-circle" className="text-success" />
                      </MDBCol>
                      <MDBCol>
                        <MDBTypography blockquote>
                          Deliver live data updates directly to teams, ensuring
                          everyone stays informed throughout the auction.
                        </MDBTypography>
                      </MDBCol>
                    </MDBRow>
                    <MDBRow>
                      <MDBCol size={1}>
                        <MDBIcon icon="check-circle" className="text-success" />
                      </MDBCol>
                      <MDBCol>
                        <MDBTypography blockquote>
                          Foster a transparent and engaging experience for all
                          participants.
                        </MDBTypography>
                      </MDBCol>
                    </MDBRow>
                  </MDBContainer>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        <hr className="hr" />
        <MDBContainer className="mt-3">
          <MDBRow>
            <MDBCol size={6}>
              <MDBCard>
                <MDBCardBody>
                  <MDBTypography className="display-6">
                    <MDBTypography tag={"mark"}>Secure</MDBTypography>
                    and
                    <MDBTypography tag={"mark"}>Reliable</MDBTypography>
                    Platform
                  </MDBTypography>
                  <MDBContainer>
                    <MDBRow>
                      <MDBCol size={1}>
                        <MDBIcon icon="check-circle" className="text-success" />
                      </MDBCol>
                      <MDBCol>
                        <MDBTypography blockquote>
                          Conduct your auctions with confidence thanks to secure
                          login and robust session management.
                        </MDBTypography>
                      </MDBCol>
                    </MDBRow>
                  </MDBContainer>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol size={6}>
              <MDBCard>
                <MDBCardBody>
                  <img style={{ width: "40vw" }} src={ss1} />
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        <hr className="hr" />
        <MDBContainer>
          <MDBRow>
            <MDBCol>
              <MDBTypography className="display-5">
                Technologies Used
              </MDBTypography>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              <div className="d-flex justify-content-evenly">
                <ReactIcon style={{ height: "10vh" }} />
                <MdbIcon style={{ height: "10vh" }} />
                <ReduxIcon style={{ height: "10vh" }} />
                <MongoIcon style={{ height: "10vh" }} />
                {/* <div>
                  <MDBTypography className="display-6">Express</MDBTypography>
                </div> */}
                <DockerIcon style={{ height: "10vh" }} />
                {/* <div>
                  <MDBTypography className="display-6">Render</MDBTypography>
                </div> */}
                <VercelIcon style={{ height: "10vh" }} />
              </div>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
      <Footer />
    </>
  );
};

export default About;
