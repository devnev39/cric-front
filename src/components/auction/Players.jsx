import { MDBTypography } from "mdb-react-ui-kit";
import React from "react";
import PlayersTable from "./PlayersTable";
import PlayerStats from "./PlayerStats";

function Players() {
  return (
    <>
      <div className="d-flex justify-content-center mt-3">
        <MDBTypography className="display-6">Default Players</MDBTypography>
      </div>
      <hr className="hr" />
      <PlayerStats />
      <hr className="hr" />
      <PlayersTable />
    </>
  );
}

export default Players;
