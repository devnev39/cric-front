import { MDBTypography } from "mdb-react-ui-kit";
import React from "react";
import PlayersTable from "./PlayersTable";

function Players() {
  return (
    <>
      <div className="d-flex justify-content-center mt-3">
        <MDBTypography className="display-6">Default Players</MDBTypography>
      </div>
      <hr className="hr" />
      <div className="d-flex justify-content-evenly"></div>
      <PlayersTable />
    </>
  );
}

export default Players;
