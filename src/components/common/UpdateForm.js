import settings from "../../config/settings.json";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchModel from "../../helpers/fetchModel";
import InputForm from "./InputForm";

/**
 * @param {String} props.modelKey Model name for heading (Update <Model_name>)
 * @param {Object} props.neglects Model Json neglects
 * @param {Object} props.model Model with values
 * @param {String} props.postUrl Post request url
 * @param {Function} props.closeFunc Close to trigger if splash view is used
 * @param {String} props.parentKey Parent componet key
 * @param {Object} props.navigate Function (trigger) or route to navigate after 200 status
 * @abstract This doen't have wimodels caller
 */
function UpdateForm(props) {
    const [modelJson,setModelJson] = useState(0);
    const [updateState,setUpdateState] = useState(false);
    const [state,setState] = useState(JSON.parse(JSON.stringify(props.model))); // Deepcopy of props.model to compare
    const [changed,setChanged] = useState(false);
    const navigate = useNavigate();

    const putModelRequest = () => {
        let obj = {};
        obj[props.modelKey] = state;
        const resp = {
            method : "PUT",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(obj),
            credentials : "include"
        };
        console.log("Clicked !");
        let url = props.postUrl ? props.postUrl : `/${props.modelKey}/${props.model._id}`;
        fetch(url,resp).then(res => res.json()).then(res => {
            if(res.status === 200) {
                if(props.navigate){
                    if(typeof(props.navigate) === 'function'){
                        if(props.closeFunc) {props.navigate();props.closeFunc();}
                        else props.navigate();
                    }
                    else navigate(props.navigate);
                }else{
                    !props.closeFunc ? window.location.reload() : props.closeFunc()
                }
            }
            else alert(`${res.status} ${res.data}`);
        });
    }

    useEffect(() => {    
        const run = async () => {await fetchModel(`${settings.BaseUrl}/wimodels/${props.modelKey}`,setModelJson)}
        run();
    },[]);

    useEffect(() => {
        for(let key of Object.keys(modelJson)){
            if(props.neglects.indexOf(key) !== -1) continue;
            document.getElementById(`input-${key}-${props.parentKey}`).addEventListener("input",() => {
                setState(model => {
                    if(model[key] !== document.getElementById(`input-${key}-${props.parentKey}`).value){
                        if(modelJson[key] === 'number') model[key] = +document.getElementById(`input-${key}-${props.parentKey}`).value;
                        else model[key] = document.getElementById(`input-${key}-${props.parentKey}`).value;
                    }
                    return model;
                });
                setChanged(true);
            });
        }
    },[modelJson]);

    useEffect(() => {
        for(let key of Object.keys(modelJson)){
            if(props.neglects.indexOf(key) !== -1) continue;
            document.getElementById(`input-${key}-${props.parentKey}`).disabled = !updateState;
            document.getElementById(`input-${key}-${props.parentKey}`).value = props.model[key];
        }
    },[updateState,modelJson]);

    useEffect(() => {
        if(JSON.stringify(props.model) !== JSON.stringify(state)) document.getElementById("saveBtn").disabled = false;
        else document.getElementById("saveBtn").disabled = true;
        setChanged(false);
    },[changed, props.model, state]);

    return (
        <div className="w-50 p-5 rounded shadow" style={{"backgroundColor" : "rgba(255,255,255,0.9)"}}>
            <div className="d-flex justify-content-center mb-5">
                <h2>{`Update ${props.modelKey} parameters`}</h2>
            </div>
            <InputForm dataSchema = {modelJson} neglects = {props.neglects} parentKey = {props.parentKey}/>
            <div className="d-flex justify-content-center mt-5">
                <button className="btn btn-primary mx-5" onClick={() => setUpdateState(!updateState)}>Update</button>
                <button className="btn btn-success mx-5" id="saveBtn" onClick={putModelRequest}>Save</button>
                {props.closeFunc ? <button className="btn btn-danger mx-5" onClick={props.closeFunc}>Close</button> : null}
            </div>
        </div>
    )
}

export default UpdateForm;