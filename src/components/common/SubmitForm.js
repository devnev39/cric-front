import settings from "../../config/settings.json";
import { useEffect, useState } from "react"
import fetchModel from "../../helpers/fetchModel";
import InputForm from "./InputForm";
import encrypt from "./Encrypt";
import { useNavigate } from "react-router-dom";
/**
 * @param {String} props.postUrl Url to post the request
 * @param {Object} props.modelKey Model key to request
 * @param {Object} props.neglects Model keys to nelgect
 * @param {Object} props.navigate Function (trigger) or route to navigate after 200 status
 * @param {Function} props.closeFunc Close function to trigger if splash view is used
 * @param {String} props.parentKey Parent component key
 * @returns
 */
function SubmitForm(props) {
    const [modelJson,setModelJson] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const run = async () => await fetchModel(`${settings.BaseUrl}/wimodels/${props.modelKey}`,setModelJson);
        run();
    },[]);

    const clearInputs = () => {
        if(modelJson){
            Object.keys(modelJson).forEach(key => {
                document.getElementById(`input-${key}-${props.parentKey}`).value = '';
            })
        }
    }

    const postData = async () => {
        let obj = {};
        if(!modelJson){alert("No model !");return;}
        Object.keys(modelJson).forEach(key => {
            let value = document.getElementById(`input-${key}-${props.parentKey}`).value;
            if(modelJson[key] === 'number') value = +value;
            else if(modelJson[key] === 'password') value = encrypt(value);
            if(!value) alert("No value !");
            else obj[key] = value;
        });
        let a = {};
        a[props.modelKey] = obj;
        const response = {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(a),
            credentials : "include",
        }
        const res = await (await fetch(`${settings.BaseUrl}${props.postUrl}`,response)).json();
        if(res.status === 200) {alert("Success !");}
        else {alert(res.data);return;}
        clearInputs();
        if(props.navigate){
            if(typeof(props.navigate) === 'function'){props.navigate();props.closeFunc();}
            else navigate(props.navigate);
        }
    }

    return (
        <div className="inputFormContainer w-50 p-5 rounded shadow" style={{"backgroundColor" : "rgba(255,255,255,0.9)"}}>
            <div className="d-flex justify-content-center mb-5">
                <h2>{`Create new ${props.modelKey}`}</h2>
            </div>
            {modelJson ? <InputForm dataSchema={modelJson} neglects = {props.neglects} parentKey = {props.parentKey}/> : null}
            <div className="d-flex justify-content-center mt-5">
                <button className="btn btn-primary mx-2" onClick={postData}>Sumbit</button>
                {props.closeFunc ? <button className="btn btn-danger" onClick={props.closeFunc}>Close</button> : null}
            </div>
        </div>
    )
}

export default SubmitForm;