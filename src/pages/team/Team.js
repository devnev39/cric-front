import settings from "../../config/settings.json";
import React, { useState } from "react";
import "./styles.css";
import { io } from "socket.io-client";

const Team = () => {
  const [teamData, setTeamData] = useState(null);
  const [socket, setSocket] = useState(null);

  const connectSocketAndFetchData = async () => {
    const teamCode = document.getElementById("teamCodeInput").value;
    if(teamCode === ""){window.alert("Empty team code !");return;}
    const data = await (await fetch(`${settings.BaseUrl}/teams/${teamCode}`,{credentials: "include"})).json();
    if(data.status === 200){
      setTeamData(data.data);
      let sock = io(settings.BaseUrl,{withCredentials: true});
      sock.on("connect",() => {
        setSocket(sock);
        sock.on(teamCode, (data) => {
          setTeamData(data);
        })
      })
    }else{
      window.alert(data.data);
    }
  }
  
  return (
    <>
    {
      !teamData ? 
        <div className="d-flex justify-content-center align-items-center" style={{height: "50vh"}}>
          <div className="rounded shadow p-5">
            <div className="row">
              <div className="col-5 h5">
                Team Code : 
              </div>
              <div className="col-7">
                <input type="text" id="teamCodeInput" placeholder="Team Code"></input>
              </div>
            </div>
            <div className="d-flex justify-content-center mt-5">
              <button className="btn btn-success" onClick={connectSocketAndFetchData}>Submit</button>  
            </div>
            
          </div>
        </div>
      :
      <div className="team-container">
        <h1>{teamData.Name}</h1>
        <h3 className="text-success">Total Budget : {teamData.Budget}</h3>
        <h3 className="text-danger">Remaining Budget : {teamData.Current}</h3>
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
            {teamData ? teamData.Players.map((player) => (
              <tr key={player.SRNO}>
                <td>{player.SRNO}</td>
                <td>{player.Name}</td>
                <td>{player.BasePrice}</td>
                <td>{player.SoldPrice}</td>
              </tr>
            )) : null}
          </tbody>
        </table>
      </div>
    } 
    </>
  );
};

export default Team;
