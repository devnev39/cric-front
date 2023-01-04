import { useEffect, useState } from "react";
import InputForm from "../common/InputForm";

/**
 * @param {Object} props.dataSchema Model Json (wimodel)
 * @param {Object} props.neglects Model Json neglects
 * @param {Object} props.model Model with values 
 * @param {String} props.postUrl Post request url
 * @param {Function} props.closeFunc Close to trigger if splash view is used
 */
function UpdateForm(props) {
    const [updateState,setUpdateState] = useState(false);
    const [state,setState] = useState(JSON.parse(JSON.stringify(props.model)));
    const [changed,setChanged] = useState(false);

    const fillInformation = () => {
        for(let key of Object.keys(props.dataSchema)){
            if(props.neglects.indexOf(key) !== -1) continue;
            document.getElementById(`input-${key}`).disabled = !updateState;
            document.getElementById(`input-${key}`).value = props.model[key];
        }
    }

    const putModelRequest = () => {
        const resp = {
            method : "PUT",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({auction : state})
        };
        console.log("Clicked !");
        let url = props.postUrl ? props.postUrl : `/${props.modelKey}/${props.model._id}`;
        fetch(url,resp).then(res => res.json()).then(res => {
            if(res.status === 200) {window.location.reload();return;}
            else alert(res.data);
        });
    }

    useEffect(() => {    
        console.log("Rendered !");
        for(let key of Object.keys(props.dataSchema)){
            if(props.neglects.indexOf(key) !== -1) continue;
            document.getElementById(`input-${key}`).addEventListener("input",() => {
                setState(model => {
                    if(model[key] !== document.getElementById(`input-${key}`).value){
                        if(props.dataSchema[key] === 'number') model[key] = +document.getElementById(`input-${key}`).value;
                        else model[key] = document.getElementById(`input-${key}`).value;
                    }
                    return model;
                });
                setChanged(true);
            });
        }
    },[]);

    useEffect(() => {
        fillInformation();
    },[updateState]);

    useEffect(() => {
        if(JSON.stringify(props.model) !== JSON.stringify(state)) document.getElementById("saveBtn").disabled = false;
        else document.getElementById("saveBtn").disabled = true;
        setChanged(false);
    },[changed, props.model, state]);

    return (
        <div>
            <InputForm dataSchema = {props.dataSchema} neglects = {props.neglects} />
            <div className="mt-5">
                <div className="d-flex justify-content-center">
                    <button className="btn btn-primary mx-5" onClick={() => setUpdateState(!updateState)}>Update</button>
                    <button className="btn btn-success mx-5" id="saveBtn" onClick={putModelRequest}>Save</button>
                </div>
            </div>
        </div>
    )
}

export default UpdateForm;