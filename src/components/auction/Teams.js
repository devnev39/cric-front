import { useEffect, useState } from "react";
import fetchModel from "../../helpers/fetchModel";
import SubmitForm from "../common/SubmitForm";
import "./styles.css";
/**
 * 
 * @param {Object} props.auctionObj Auction Data
 * @param {Function} props.trigger Trigger to fetch updated info
 */
// TableHeads  SN Name Budget Actions
function Teams(props) {
    const [teamModel,setTeamModel] = useState();
    // const [auctionObj,setAuctionObj] = useState(props.auctionObj);
    const [rows,setRows] = useState(null);
    const makeRow = () => {
        if(!props.auctionObj.Teams.length) return null;
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
                        <button className="btn btn-warning btn-sm mx-2" onClick={() => deleteTeam(team._id)}><i className="fa-solid fa-trash-can"></i></button>
                        <button className="btn btn-info btn-sm" ><i className="fa-solid fa-pen-to-square"></i></button>
                    </div>
                </div>   
            )
        });        
    }

    const deleteTeam = async (teamId) => {
        if(! window.confirm("Do you want do delete this team ?")) return;
        const resp = await (await fetch(`/auction/${props.auctionObj._id}/teams/${teamId}`,{
            method : "DELETE"
        })).json();
        if(resp.status === 200){alert("Success !"); props.trigger();}
        else alert(`${resp.status} ${resp.data}`);
    }

    const toggleSubmitForm = () => {
        const e = document.getElementById("submitForm");
        if(e.classList.contains("display")){
            e.classList.toggle("display");
            e.classList.toggle("openForm");
            e.classList.toggle("closeForm");
            e.classList.toggle("openFormDisplay");
            document.getElementById("teamMainDiv").classList.toggle("blurBackground");
            setTimeout(() => {e.classList.toggle("closeFormDisplay")},500);
            
        }else{
            e.classList.toggle("display");
            e.classList.toggle("closeForm");
            e.classList.toggle("openFormDisplay")
            e.classList.toggle("closeFormDisplay");
            document.getElementById("teamMainDiv").classList.toggle("blurBackground");
            setTimeout(() => {e.classList.toggle("openForm");},100);
        }
        const ele = document.getElementsByClassName("newTeamDivButton")[0];
        if(ele.innerText === '+') ele.innerText = '-';
        else ele.innerText = '+';
    }
    
    useEffect(() => {
        const run = async () => {await fetchModel("/wimodels/team",setTeamModel)}
        run();
        setRows(makeRow());
    },[props.auctionObj]);

    return (
        <>
        <div className="optionContainerRoot mt-5 d-flex justify-content-center" id="teamMainDiv">
            <div className="w-50 rounded shadow p-5">
                <div className="d-flex justify-content-center">
                    <h2 className="pb-5">Teams</h2>
                </div>
                {rows ? rows : <h3>o-o</h3>}
            </div>
        </div>
        <div className="d-flex justify-content-center">
            <div className="rounded shadow my-5 px-5 h4 newTeamDivButton" onClick={() => {toggleSubmitForm()}}>
                +
            </div>
        </div>
        <div className="closeFormDisplay closeForm" id="submitForm">
            <div className="d-flex justify-content-center" style={{"backgroundColor" : "rgba(255,255,255,0.9)"}}>
                <SubmitForm postUrl={`/auction/${props.auctionObj._id}/teams`} modelKey="team" neglects={[]} navigate={props.trigger} closeFunc = {toggleSubmitForm} />
            </div>
        </div>
        </>
    )
}

export default Teams;