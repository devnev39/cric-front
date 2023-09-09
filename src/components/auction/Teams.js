import settings from "../../config/settings.json";
import { useEffect, useState } from "react";
import SubmitForm from "../common/SubmitForm";
import UpdateForm from "../common/UpdateForm";
import "./styles.css";
/**
 * 
 * @param {Object} props.auctionObj Auction Data
 * @param {Function} props.trigger Trigger to fetch updated info
 */
// TableHeads  SN Name Budget Actions
function Teams(props) {
    // const [teamModel,setTeamModel] = useState();
    const [currentTeam, setCurrentTeam] = useState(null);
    const [rows,setRows] = useState(null);

    const makeRow = () => {
        if (!props.auctionObj.Teams.length) {
          return null;
        }
        return props.auctionObj.Teams.map(team => {
            return (
                <div key={`${team._id}}`} className="row mb-4 shadow-sm rounded h5 auctionRowContent p-2">
                    <div className="col-1 d-flex justify-content-center" style={{"borderRight" : `2px dotted`}}>
                        {team.No}
                    </div>
                    <div className="col-6 d-flex justify-content-center" style={{"borderRight" : `2px dotted`}}>
                        {team.Name}
                    </div>
                    <div className="col-2 d-flex justify-content-center" style={{"borderRight" : `2px dotted`}}>
                        {team.Budget}
                    </div>
                    <div className="col-2 d-flex justify-content-center">
                        <button className="btn btn-danger btn-sm mx-2" onClick={() => deleteTeam(team._id)}><i className="fa-solid fa-trash-can"></i></button>
                        <button className="btn btn-warning btn-sm" onClick={() => updateTeam(team)}><i className="fa-solid fa-pen-to-square"></i></button>
                    </div>
                </div>
            )
        });        
    }

    const deleteTeam = async (teamId) => {
        if (! window.confirm("Do you want do delete this team ?")) {
          return;
        }
        const resp = await (await fetch(`${settings.BaseUrl}/auction/${props.auctionObj._id}/teams/${teamId}`,{
            method : "DELETE",
            credentials : "include"
        })).json();
        if (resp.status === 200) {
          alert("Success !"); props.trigger();
        } else {
          alert(`${resp.status} ${resp.data}`);
        }
    }

    const updateTeam = (team) => {
        setCurrentTeam(team);
        toggleSubmitForm("updateForm");
    }

    const toggleSubmitForm = (formId) => {
        const e = document.getElementById(formId);
        if(e.classList.contains("display")){
            e.classList.toggle("display");
            e.classList.toggle("openForm");
            e.classList.toggle("closeForm");
            e.classList.toggle("openFormDisplay");
            setTimeout(() => {e.classList.toggle("closeFormDisplay")},500);
            document.getElementById("teamMainDiv").classList.toggle("blurBackground");
            setCurrentTeam(null);
        }else{
            e.classList.toggle("display");
            e.classList.toggle("closeForm");
            e.classList.toggle("openFormDisplay")
            e.classList.toggle("closeFormDisplay");
            setTimeout(() => {e.classList.toggle("openForm");},100);
            document.getElementById("teamMainDiv").classList.toggle("blurBackground");
        }
        if (formId !== 'submitForm') {
          return;
        }
        const ele = document.getElementsByClassName("newTeamDivButton")[0];
        if (ele.innerText === '+') {
          ele.innerText = '-';
        } else {
          ele.innerText = '+';
        }
    }
    
    useEffect(() => {
        setRows(null);
        console.log(props.auctionObj.Teams);
        setRows(makeRow());
    },[props.auctionObj]);

    return (
        <>
        <div className="optionContainerRoot mt-5 d-flex justify-content-center" id="teamMainDiv">
            <div className="rounded shadow p-5 teams-container">
                <div className="d-flex justify-content-center border-bottom">
                    <h2 className="pb-5">Teams</h2>
                </div>
                <div className="team-items-container p-3">
                    {rows || <h3>o-o</h3>}
                </div>
                
            </div>
        </div>
        <div className="d-flex justify-content-center">
            <div className="rounded shadow my-5 px-5 h4 newTeamDivButton" onClick={() => {toggleSubmitForm("submitForm")}}>
                +
            </div>
        </div>
        <div className="closeFormDisplay closeForm" id="submitForm">
            <div className="d-flex justify-content-center">
                <SubmitForm postUrl={`/auction/${props.auctionObj._id}/teams`} modelKey="team" neglects={[]} navigate={props.trigger} closeFunc = {() => toggleSubmitForm("submitForm")} parentKey="submit1" />
            </div>
        </div>
        <div className="closeFormDisplay closeForm" id="updateForm">
            <div className="d-flex justify-content-center">
                {currentTeam ? <UpdateForm modelKey = {"team"} neglects = {[]} setFunc = {props.setAuctionObj} model = {currentTeam} postUrl={`/auction/${props.auctionObj._id}/teams/${currentTeam._id}`} closeFunc = {() => toggleSubmitForm("updateForm")} parentKey="update1" navigate={props.trigger} /> : null}
            </div>
        </div>
        </>
    )
}

export default Teams;