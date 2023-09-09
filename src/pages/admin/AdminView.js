import { useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import SubmitForm from "../../components/common/SubmitForm";
import UpdateForm from "../../components/common/UpdateForm";
import settings from "../../config/settings.json";
import "./styles.css";


function AdminView() {
    const [rows,setRows] = useState(null);
    const [users,setUsers] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const {state} = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        check_login();
        fetchUsers();
    },[])

    useEffect(() => {
        setRows(makeRow());
    },[users])

    const fetchUsers = async () => {
        const resp = await (await fetch(`${settings.BaseUrl}/users`,{credentials : "include"})).json()
        if (resp.status === 200){
            setUsers(resp.data);
        }else{
            window.alert(`${resp.data}`);
        }
    }

    const check_login = async () => {
        const resp = await (await fetch(`${settings.BaseUrl}/admin`,{credentials : "include"})).json()
        if(resp.status !== 601) {
          navigate(-1);
        }
    }

    if(!state){
        window.alert("Cannot identify the route ! State not found !");
        return;
    }
    if(!state.fromAdmin){
        window.alert("Cannot identify the route !")
        return;
    }
    if(state){
        
    }
    
    const makeRow = () => {
        if (!users) {
          return null;
        }
        return users.map(user => {
            return (
                <div key={`${user._id}}`} className="row mb-4 shadow-sm rounded h5 auctionRowContent p-2">
                    <div className="col-2 d-flex justify-content-center" style={{"borderRight" : `2px dotted`}}>
                        {user.Name}
                    </div>
                    <div className="col-5 d-flex justify-content-center" style={{"borderRight" : `2px dotted`}}>
                        {user.Email}
                    </div>
                    <div className="col-2 d-flex justify-content-center" style={{"borderRight" : `2px dotted`}}>
                        {user.Expiry}
                    </div>
                    <div className="col-1 d-flex justify-content-center" style={{"borderRight" : `2px dotted`}}>
                        <input type="checkbox" checked={user.Enabled} onChange={(e) => updateUser(user._id)} />
                    </div>
                    <div className="col-2 d-flex justify-content-center">
                        <button className="btn btn-danger btn-sm mx-2" onClick={() => deleteUser(user._id)}><i className="fa-solid fa-trash-can"></i></button>
                        <button className="btn btn-warning btn-sm" onClick={() => updateUser(user)}><i className="fa-solid fa-pen-to-square"></i></button>
                    </div>
                </div>
            )
        });
    }

    const updateUser = (user) => {
        setCurrentUser(user);
        toggleSubmitForm("updateForm");
    }

    const deleteUser = async (user_id) => {
        if (! window.confirm("Do you want do delete this team ?")) {
          return;
        }
        const resp = await (await fetch(`${settings.BaseUrl}/users/${user_id}`,{
            method : "DELETE",
            credentials : "include"
        })).json();
        if (resp.status === 200) {
          alert("Success !");
          setUsers(resp.data);
        } else {
          alert(`${resp.status} ${resp.data}`);
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
            document.getElementById("adminMainDiv").classList.toggle("blurBackground");
        }else{
            e.classList.toggle("display");
            e.classList.toggle("closeForm");
            e.classList.toggle("openFormDisplay")
            e.classList.toggle("closeFormDisplay");
            setTimeout(() => {e.classList.toggle("openForm");},100);
            document.getElementById("adminMainDiv").classList.toggle("blurBackground");
        }
        // const ele = document.getElementsByClassName("newUserDivButton")[0];
        // if (ele.innerText === '+') {
        //   ele.innerText = '-';
        // } else {
        //   ele.innerText = '+';
        // }
    }

    return (
        <>
        <div id="adminMainDiv">
            <div className="optionContainerRoot mt-5 d-flex justify-content-center" id="teamMainDiv">
                <div className="rounded shadow p-5 teams-container">
                    <div className="d-flex justify-content-center border-bottom">
                        <h2 className="pb-5">Users</h2>
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
        </div>
        <div className="closeFormDisplay closeForm" id="submitForm">
            <div className="d-flex justify-content-center">
                <SubmitForm postUrl={"/users"} modelKey="tempUser" neglects={["Enabled"]} closeFunc = {() => toggleSubmitForm("submitForm")} parentKey="submit1" setFunc={setUsers} />
            </div>
        </div>
        <div className="closeFormDisplay closeForm" id="updateForm">
            <div className="d-flex justify-content-center">
                {currentUser ? <UpdateForm modelKey = {"tempUser"} neglects = {[]} model = {currentUser} postUrl={`/users/${currentUser._id}`} closeFunc = {() => toggleSubmitForm("updateForm")} parentKey="update1" setFunc={setUsers} /> : null}
            </div>
        </div>
        </>
    )
}

export default AdminView;