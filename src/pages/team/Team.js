import React from "react";
import "./styles.css";

const Team = () => {
  const teamData = [
    { srNo: 1, playerName: "Player 1", basePrice: 100, soldPrice: 200 },
    { srNo: 2, playerName: "Player 2", basePrice: 300, soldPrice: 400 },
  ];

  return (
    <div className="team-container">
      <h1>Team Name</h1>
      <table className="team-table">
        <thead>
          <tr>
            <th>Sr no.</th>
            <th>Player name</th>
            <th>Base Price</th>
            <th>Sold Price</th>
          </tr>
        </thead>
        <tbody>
          {teamData.map((player) => (
            <tr key={player.srNo}>
              <td>{player.srNo}</td>
              <td>{player.playerName}</td>
              <td>{player.basePrice}</td>
              <td>{player.soldPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Team;
