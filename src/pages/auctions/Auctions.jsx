import auctionApi from "../../api/auction";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { MDBTypography } from "mdb-react-ui-kit";
const Auctions = () => {
  const [auctions, setAuctions] = useState(null);
  const navigate = useNavigate();

  const abortController = new AbortController();
  const signal = abortController.signal;

  // const statusLightsGenerator = () => {
  //   const lights = ['red', 'orange', 'green'];
  //   const status = ['Has not started', 'In progress', 'Finished'];
  //   return lights.map((c) => {
  //     return (
  //       <MDBRow key={c}>
  //         <MDBCol lg={2}>
  //           <i style={{color: c}} className="fa-solid fa-circle p-2"></i>
  //         </MDBCol>
  //         <MDBCol lg={6}>{status[lights.indexOf(c)]}</MDBCol>
  //       </MDBRow>
  //     );
  //   });
  // };
  const createAuctionStack = () => {
    return auctions.map((auction) => {
      return (
        <div
          key={`${auction._id}}`}
          className="row mb-4 shadow-sm rounded h5 auctionRowContent"
          onClick={() => {
            navigate(`/auction/${auction._id}`, {
              state: { auction: auction },
            });
          }}
        >
          <div
            className="col-1 d-flex justify-content-center"
            style={{ borderRight: `2px dotted ${auction.status}` }}
          >
            {auctions.indexOf(auction) + 1}
          </div>
          <div
            className="col-8 d-flex justify-content-center"
            style={{ borderRight: `2px dotted` }}
          >
            {auction.name}
          </div>
          <div className="col-2 d-flex justify-content-center">
            {auction.maxBudget}
          </div>
          <div
            className="col-1 d-flex justify-content-center"
            style={{ borderLeft: `2px dotted ${auction.status}` }}
          >
            <i
              style={{ color: auction.status }}
              className="fa-solid fa-circle p-2"
            ></i>
          </div>
        </div>
      );
    });
  };
  const getAuctions = async () => {
    auctionApi
        .getAll(signal)
        .then((resp) => resp.json())
        .then((response) => {
          if (!response.status && response.errorCode !== 601) {
          // Show error
            return;
          }
          if (response.errorCode === 601) {
            navigate(`/auction/${response.data._id}`, {
              state: { auction: response.data },
            });
            return;
          }
          setAuctions(response.data);
        });
  };

  const createLoadingDiv = () => {
    return (
      <div className="mx-5">
        <div className="d-flex justify-content-center m-5">
          <div className="spinner-grow text-success" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
        <div className="d-flex justify-content-center h2">
          Loading.....Please wait !
        </div>
      </div>
    );
  };

  useEffect(() => {
    getAuctions();
    return () => {
      abortController.abort();
    };
  }, []);
  return (
    <div className="auctionsContainerRoot mt-5">
      {/* <div className="row">
        <div className="col-5"></div>
        <div className="col-4">
          <h1 className="ml-5">Auctions</h1>
        </div>
        <div className="col-3">
          <MDBContainer className="rounded shadow w-75 py-2">
            {statusLightsGenerator()}
          </MDBContainer>
        </div>
      </div> */}
      <div className="d-flex justify-content-center">
        <MDBTypography className="display-5">Auctions</MDBTypography>
      </div>
      <hr className="hr" />
      <div className="d-flex justify-content-center">
        <div className="auctionsContainer w-50">
          {auctions ? createAuctionStack() : createLoadingDiv()}
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <div className="row w-50">
          <div className="col-4"></div>
          <div
            className="col-4 d-flex justify-content-center shadow h3 newAuctionButtonDiv"
            onClick={() => navigate("/new/auction")}
          >
            +
          </div>
          <div className="col-4"></div>
        </div>
      </div>
    </div>
  );
};

export default Auctions;
