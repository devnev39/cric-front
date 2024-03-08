import React, { useEffect, useState } from "react";
import QueryBuiler from "../../helpers/queryBuilder";
import defaultPlayersApi from "../../api/players";
import LineBarChart from "../common/LineBarChart";
import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";

const priceChartOptions = {
  // indexAxis : 'y',
  xkey: "name",
  ylinekey: "auctionedPrice",
  ybarkey: "basePrice",
  xlabel: "Name",
  ylinelabel: "Auctioned Price",
  ybarlabel: "Base Price",
  chartTitle: "Players with highest base value with auctioned value",
  // chartTitleSize: 20,
  chartTitlePosition: "top",
};

const PlayerStats = () => {
  // baseprice vs Players
  // auctionedprice vs players
  // No. of countries
  // No. of IPL teams
  // No. of total plyaers
  const [queriedData, setQueriedData] = useState({
    price: [],
    players: [],
    countries: [],
    iplteams: [],
  });

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
            setQueriedData(resp.data);
          } else {
            window.alert(`${resp.errorCode} : ${resp.data}`);
          }
        })
        .catch((err) => {
          window.alert(`${err}`);
        });
  };

  useEffect(() => {
    fetchQueries();
  }, []);
  return (
    <>
      <div className="d-flex justify-content-center">
        <MDBTypography className="text-decoration-underline fs-4">
          Default Player Stats
        </MDBTypography>
      </div>
      <MDBContainer>
        <MDBRow>
          <MDBCol size={7}>
            <div style={{ height: "60vh" }} className="rounded shadow p-3">
              <LineBarChart
                data={queriedData.price}
                option={priceChartOptions}
              />
            </div>
          </MDBCol>
          <MDBCol size={5}>
            <MDBRow>
              <MDBCol size={6}>
                <MDBCard alignment="center">
                  <MDBCardBody>
                    <div className="display-4 text-danger">
                      {queriedData.players.length ?
                        queriedData.players[0].name :
                        ""}
                    </div>
                    <div className="fs-4">Players</div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol size={6}>
                <MDBCard alignment="center">
                  <MDBCardBody>
                    <div className="display-4 text-danger">
                      {queriedData.countries.length}
                    </div>
                    <div className="fs-4">Countries</div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
            <MDBRow className="my-3">
              <MDBCol>
                <MDBCard alignment="center">
                  <MDBCardBody>
                    <div className="display-4 text-danger">
                      {queriedData.iplteams.length}
                    </div>
                    <div className="fs-4">IPL Teams Players</div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
};

export default PlayerStats;
