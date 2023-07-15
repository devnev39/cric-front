import settings from "../../config/settings.json";
import { useEffect, useState } from "react";
import fetchData from "../../helpers/fetchData";
import fetchModel from "../../helpers/fetchModel";
import queryBuiler from "../../helpers/queryBuilder";
import LineBarChart from "../common/LineBarChart";
import PolarAreaChart from "../common/PolarArea";
import SubmitForm from "../common/SubmitForm";
import UpdateForm from "../common/UpdateForm";
import "./styles.css"

function Players(props) {
    const [chartData,setChartData] = useState(null);
    const [playerLenght,setPlayerLength] = useState(0);
    const [totalCountries,setTotalCountries] = useState(0);
    const [totalIPLTeams,setTotalIplTeams] = useState(0);
    const [playingRoleCount,setPlayingRoleCount] = useState(0);
    const [CUACount,setCUACount] = useState(0);
    const [mPlayers,setMplayers] = useState(0);
    const [aPlayers,setAplayers] = useState(0);
    const [rPlayers,setRplayers] = useState(0);
    const [currentPlayer,setCurrentPlayer] = useState(0);

    const [showUploadDiv,setShowUploadDiv] = useState(false);
    // const [playerModel,setPlayerModel] - u
    
    const option = {
        // indexAxis : 'y',
        xkey : "Name",
        ylinekey : "AuctionedPrice",
        ybarkey : "BasePrice",
        xlabel : "Name",
        ylinelabel : "AuctionedPrice",
        ybarlabel : "BasePrice",
    }

    const area1Option = {
        xkey : "CUA",
        ykey : "Count",
        ylabel : "Players"
    }

    const area2Option = {
        xkey : "PlayingRole",
        ykey : "Count",
        ylabel : "Players"
    }

    const tableFields = ["SRNO","Name","Country","BasePrice","AuctionedPrice","Action"];

    const requestAndSetData = async (queries,setObject) => {
        let res = await fetchData(`${settings.BaseUrl}/player/query`,{
            query : queries
        });
        if(res.status !== 200) alert(`${res.status} ${res.data}`);
        else setObject(res.data);
    }

    const requestData = async () => {
        const query = new queryBuiler();
        requestAndSetData(query.sort({"BasePrice" : -1}).limit(10).queries,setChartData);
        query.clear();
        requestAndSetData(query.count("Name").queries,setPlayerLength);
        query.clear();
        requestAndSetData(query.group({_id : "$Country"}).queries,setTotalCountries);
        query.clear();
        requestAndSetData(query.group({_id : "$IPL2022Team"}).queries,setTotalIplTeams);
        query.clear();
        requestAndSetData(query.group({_id : "$PlayingRole",Count : {$sum : 1}}).project({_id : 0, PlayingRole : "$_id",Count : 1}).queries,setPlayingRoleCount);
        query.clear();
        requestAndSetData(query.group({_id : "$CUA",Count : {$sum : 1}}).project({_id : 0, CUA : "$_id",Count : 1}).queries,setCUACount);
        query.clear();

        const players = await (await fetch(`${settings.BaseUrl}/auction/${props.auctionObj._id}/players`,{credentials : "include"})).json();
        setMplayers(players.data.Main);
        setAplayers(players.data.Add);
        setRplayers(players.data.Rmv);
        document.getElementById("customSwitch1").checked = props.auctionObj.poolingMethod === "Custom" ? true : false;
        setShowUploadDiv(document.getElementById("customSwitch1").checked);
    }

    const setTableHead = () => {
        let heads = [];
        for(let h of tableFields) {
            heads.push(<th key={`${tableFields.indexOf(h)}${h}`}>{h}</th>)
        }
        return (
            <tr key={"tablehead1"}>
                {heads}
            </tr>
        )
    }

    const fillColumn = (field,tds,p,condition) => {
        // Fill the column not specified in p
        // Fill action with button depending on condition
        if(condition === "mPlayers" || condition === "Add") {
            tds.push(<td key={`${field}${p.SRNO}`}>
                <button className="btn btn-info btn-sm mx-2" onClick={() => updatePlayer(p)}><i className="fa-solid fa-user-pen"></i></button>
                <button className="btn btn-danger btn-sm" onClick={() => movePlayerAndResponse(p,condition,"Rmv")}><i className="fa-solid fa-square-minus"></i></button>
            </td>)
        }
        if(condition === "Rmv") {
            tds.push(<td key={`${field}${p.SRNO}`}>
                <button className="btn btn-success btn-sm mx-2" onClick={() => movePlayerAndResponse(p,"Rmv","mPlayers")}><i className="fa-solid fa-trash-arrow-up"></i></button>
                <button className="btn btn-danger btn-sm" onClick={() => movePlayerAndResponse(p)}><i className="fa-solid fa-trash"></i></button>
            </td>)
        }
    }

    const movePlayerAndResponse = async (p,src,dest) => {
        if(!src && !dest) if(!window.confirm("Do you want to permantly delete this player ? ")) return; 
        const res = await movePlayer(p,src,dest);
        if(res.status === 200) {alert("Success !"); props.trigger();}
        else alert(`${res.status} ${res.data}`);
    }

    const movePlayer = async (p,src,dest) => {
        // src -> source array
        // dest -> destination array
        // player -> player object
        const method = src || dest ? "PATCH"  : "DELETE";
        console.log(props.auctionObj);
        const resp = await (await fetch(`${settings.BaseUrl}/auction/${props.auctionObj._id}/players`,{
            method : method,
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({src : src,dest : dest,player : p}),
            credentials : "include"
        })).json();
        return resp;
    }

    const updatePlayer = (p) => {
        setCurrentPlayer(p);
        toggleSubmitForm("updatePlayerForm");
    }

    const createTableBodyForDataset = (dataset,datasetName,color) => {
        let trs = [];
        let trse = [];
        for(let p of dataset) {
            let tds = [];
            for(let field of tableFields) {
                if(p[field]){
                    tds.push(<td key={`${dataset.indexOf(p)}${field}`}>{p[field]}</td>)
                }else{
                    fillColumn(field,tds,p,datasetName);
                }
            }
            if(!p.Edited || datasetName === "Rmv") trs.push(<tr className={`${color ? color : ""}`} key={`${p.SRNO}`}>{tds}</tr>);
            else trse.push(<tr className={"table-info"} key={`${p.SRNO}`}>{tds}</tr>)
        }
        return trs.concat(trse);
    }

    const setTableBody = () => {
        let trs = [];
        const mp = createTableBodyForDataset(mPlayers,"mPlayers");
        const rp = createTableBodyForDataset(rPlayers,"Rmv","table-danger");
        const add = createTableBodyForDataset(aPlayers,"Add","table-success");
        return trs.concat(mp,rp,add);
    }

    const commandCorrenspondance = {
        "added" : "table-success",
        "removed" : "table-danger",
        "edited" : "table-info",
    };

    const searchInput = () => {
        let val = document.getElementById("searchInput").value;
        const tbody = document.getElementById("tableBody");
        const trs = tbody.getElementsByTagName("tr");
        for(let tr of trs){
            if(tr.textContent.toLowerCase().indexOf(val.toLowerCase()) === -1) tr.style.display = "None";
            else tr.style.display = "";
            
            if(val.toLowerCase() === "added" || val.toLowerCase()  === "removed" || val.toLowerCase()  === "edited") {
                if(tr.classList.contains(commandCorrenspondance[val.toLowerCase()])) tr.style.display = "";
                else tr.style.display = "None";    
            }
            if(val.toLowerCase()  === "$") {
                let flag = false;
                Object.values(commandCorrenspondance).forEach(k => {
                    if(tr.classList.contains(k)) flag = true;
                })
                if(flag) tr.style.display = ""
                else tr.style.display = "None";
            }
        }
    }

    const toggleSubmitForm = (formId) => {
        const e = document.getElementById(formId);
        if(e.classList.contains("display")){
            e.classList.toggle("display");
            e.classList.toggle("openForm");
            e.classList.toggle("closeForm");
            e.classList.toggle("openFormDisplay");
            setTimeout(() => {e.classList.toggle("closeFormDisplay")},500);
            document.getElementById("playersMainDiv").classList.toggle("blurBackground");
            setCurrentPlayer(null);
        }else{
            e.classList.toggle("display");
            e.classList.toggle("closeForm");
            e.classList.toggle("openFormDisplay")
            e.classList.toggle("closeFormDisplay");
            setTimeout(() => {e.classList.toggle("openForm");},100);
            document.getElementById("playersMainDiv").classList.toggle("blurBackground");
        }
        // if(formId !== 'submitForm') return;
        // const ele = document.getElementsByClassName("newTeamDivButton")[0];
        // if(ele.innerText === '+') ele.innerText = '-';
        // else ele.innerText = '+';
    }

    const poolingMethodChanged = async () => {
        const state = document.getElementById("customSwitch1").checked;
        if(state) props.auctionObj.poolingMethod = "Custom"
        else props.auctionObj.poolingMethod = "Composite";
        const req = {
            method : "PUT",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({auction : props.auctionObj}),
            credentials : "include"
        };
        const resp = await (await fetch(`${settings.BaseUrl}/auction/${props.auctionObj._id}`,req)).json();
        if(resp.status === 200) {alert("Success !");setShowUploadDiv(state);}
        else alert(`${resp.status} ${resp.data}`);
        props.trigger();
    }

    function readFileAsync(file) {
        return new Promise((resolve, reject) => {
          let reader = new FileReader();
      
          reader.onloadend = () => {
            resolve(reader.result);
          };
      
          reader.onerror = reject;
      
          reader.readAsText(file);
        })
    }

    const uploadDataset = async () => {
        try {
	        let model = null;
	        await fetchModel(`${settings.BaseUrl}/wimodels/player`,(res) => {model = res});
	        alert(`The data should be in following format : ${JSON.stringify(model)}`);
	        let file = document.getElementById("datasetFileInput").files[0];
	        let data = await readFileAsync(file);
            data = JSON.parse(data);
            if(data.length) {
                const Req = {
                    method : "COPY",
                    headers : {
                        "Content-Type" : "application/json"
                    },
                    body : JSON.stringify({players : data}),
                    credentials : "include"
                }
                const resp = await (await fetch(`${settings.BaseUrl}/auction/${props.auctionObj._id}/players`,Req)).json();
                if(resp.status === 200) {alert("Success !");props.trigger();}
                else alert(`${resp.status} ${resp.data}`);
            }else throw new Error("Array not detected or empty array !");
        } catch (error) {
            alert(error);
        }

    }
    useEffect(() => {
        const run = async () => await requestData();
        run();
        console.log("Auction data fetched !");
    },[props.auctionObj]);
    return (
        <>
        <div className="mt-3" id="playersMainDiv">
            <div className="player-top-container m-2 pb-5 border"> 
                <div className="player-top-first mt-3 ml-3">
                    <div className="h4">Default player list overview</div>
                    <div className="row ml-1 my-3">
                        <div className="col-8 shadow rounded p-3">
                            {chartData ? <LineBarChart data = {chartData} option={option} /> : null}
                        </div>
                        <div className="col-4">
                            <div className="rounded shadow py-3 px-3">
                                <div className="circleAround w-50 mb-5" style={{"marginTop" : "0%","marginLeft" : "20%"}}>
                                    <div className="m-1">
                                        <div className="h4">Total of </div>
                                        <div className="h1">{playerLenght[0] ? playerLenght[0].Name : 0}</div>
                                        <div className="h4">players</div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6" style={{"margin" : "0","paddingLeft" : "2%"}}>
                                        <div className="circleAround2" style={{"marginTop" : "0%","marginLeft" : "","paddingLeft" : ""}}>
                                            Players from 
                                            <div className="h3">{Object.keys(totalCountries).length}</div>
                                            countries
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="circleAround2" style={{"marginTop" : "0%","marginLeft" : ""}}>
                                            Total of
                                            <div className="h3">{Object.keys(totalIPLTeams).length}</div>
                                            IPL teams
                                        </div>
                                    </div>
                                </div>
                            </div>                                
                        </div>
                    </div>
                </div>
                <div className="player-top-last">
                    <div className="row">
                        <div className="col-6 d-flex justify-content-center">
                            <div className="shadow rounded p-3">
                                {CUACount ? <PolarAreaChart data={CUACount} option={area1Option} /> : null}
                                <div className="d-flex justify-content-center">
                                    No. of player according to capped and uncapped
                                </div>
                            </div> 
                        </div>
                        <div className="col-6 d-flex justify-content-center">
                            <div className="shadow rounded p-3">
                                {playingRoleCount ? <PolarAreaChart data={playingRoleCount} option={area2Option} /> : null}
                                <div className="d-flex justify-content-center mt-5">
                                    No. of player according to playing role
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="player-mid-container border m-2 p-3">
                <div className="searchbox-container m-2">
                    <div className="row">
                        <div className="col-4">
                            <label htmlFor="serachInput" className="h5">Search : </label>
                            <input name="searchInput" placeholder="$|added|removed|edited" id="searchInput" className="mx-3" onKeyUp={searchInput}/>
                        </div>
                        <div className="col-8">
                            <div className="status-container">
                                <div className="row h5">
                                    <div className="col-2 d-flex justify-content-center">
                                        <i className="fa-solid fa-circle text-danger"></i>
                                    </div>
                                    <div className="col-2 d-flex justify-content-center">
                                        <i className="fa-solid fa-circle text-success"></i>
                                    </div>
                                    <div className="col-2 d-flex justify-content-center">
                                        <i className="fa-solid fa-circle text-info"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4"></div>
                        <div className="col-8">
                            <div className="row">
                                <div className="col-2 d-flex justify-content-center">
                                    Removed
                                </div>
                                <div className="col-2 d-flex justify-content-center">
                                    Added
                                </div>
                                <div className="col-2 d-flex justify-content-center">
                                    Edited
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-10">
                        <div className="border shadow rounded players-table-container">
                            <table className="table table-striped table-bordered">
                                <thead className="table-head">
                                    {setTableHead()}
                                </thead>
                                <tbody id="tableBody">
                                    {mPlayers ? setTableBody() : null}
                                </tbody>
                            </table>
                        </div>
                        <div className="d-flex justify-content-center mt-3">
                            <button className="btn btn-success" onClick={() => toggleSubmitForm("newPlayerForm")}>Add Player</button>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="custom-control custom-switch">
                            <input type="checkbox" className="custom-control-input" id="customSwitch1" onChange={() => poolingMethodChanged()} />
                            <label className="custom-control-label" htmlFor="customSwitch1">Use custom dataset</label>
                        </div>
                        <div className="mt-5" id="uploadDatasetBtnDiv" style={{"display" : `${showUploadDiv ? "" : "None"}`}}>
                            <label className="form-label" htmlFor="customFile">Select JSON file</label>
                            <input type="file" className="form-control" id="datasetFileInput" accept=".json" />
                            <button onClick={uploadDataset} type="button" className="btn btn-outline-success mt-4" data-mdb-ripple-color="dark">Upload Dataset</button>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
        <div className="closeForm closeFormDisplay" id="newPlayerForm">
            <SubmitForm postUrl={`/auction/${props.auctionObj._id}/players`} modelKey={"player"} neglects={[]} closeFunc={() => toggleSubmitForm("newPlayerForm")} parentKey={"newPlayer1"} navigate={props.trigger} />
        </div>
        <div className="closeForm closeFormDisplay" id="updatePlayerForm">
            {currentPlayer ? <UpdateForm modelKey={"player"} neglects={[]} model={currentPlayer} postUrl={`/auction/${props.auctionObj._id}/players`} closeFunc={() => toggleSubmitForm("updatePlayerForm")} parentKey={"update2"} navigate={props.trigger} /> : null}
        </div>
        </>
        )
}

export default Players;