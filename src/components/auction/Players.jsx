import { MDBBtn, MDBTypography } from "mdb-react-ui-kit";
import React from "react";
import PlayersTable from "./PlayersTable";
import PlayerStats from "./PlayerStats";
import { useSelector } from "react-redux";
import { utils, writeFile } from "xlsx";

function Players() {
  const players = useSelector((state) => state.auctionPlayers.players);
  const auction = useSelector((state) => state.auction.auction);
  const downloadPlayers = () => {
    const workbook = utils.book_new();
    const pls = [];
    players.forEach((pl, ind) => {
      if (!pl.includeInAuction) return null;
      const p = JSON.parse(JSON.stringify(pl));
      p.index = ind + 1;
      delete p._id;
      delete p.__v;
      delete p.auctionedPrice;
      delete p.imgUrl;
      delete p.team_id;
      delete p.teamName;
      delete p.sold;
      delete p.isAdded;
      delete p.isEdited;
      delete p.includeInAuction;
      delete p.soldPrice;
      pls.push(p);
    });
    const worksheet = utils.json_to_sheet(pls, { header: ["index"] });
    utils.book_append_sheet(workbook, worksheet, "Players");
    writeFile(workbook, `${auction.name}_players.xlsx`);
  };
  return (
    <>
      <div className="d-flex justify-content-center mt-3">
        <MDBTypography className="display-6">Default Players</MDBTypography>
      </div>
      <hr className="hr" />
      <PlayerStats />
      <hr className="hr" />
      <PlayersTable />
      <hr className="hr" />
      <div className="d-flex justify-content-center">
        <MDBBtn onClick={downloadPlayers}>Download Players List</MDBBtn>
      </div>
    </>
  );
}

export default Players;
