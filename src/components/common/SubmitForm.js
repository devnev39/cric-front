import { useEffect, useState } from "react"
import fetchModel from "../../helpers/fetchModel";
import InputForm from "./InputForm";
import encrypt from "./Encrypt";
import { useNavigate } from "react-router-dom";
/**
 * @param {String} props.postUrl url to post the request
 * @param {Object} props.modelKey model key to request
 * @param {Object} props.neglects model key to request
 * @param {Object} props.navigate model key to request
 * @param {Function} props.closeFunc close function to trigger if splash view is used
 * @returns 
 */
function SubmitForm(props) {
    const [modelJson,setModelJson] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const run = async () => await fetchModel(`/wimodels/${props.modelKey}`,setModelJson);
        run();
    },[]);

    const clearInputs = () => {
        if(modelJson){
            Object.keys(modelJson).forEach(key => {
                document.getElementById(`input-${key}`).value = '';
            })
        }
    }

    const postData = () => {
        let obj = {};
        if(!modelJson){alert("No model !");return;}
        Object.keys(modelJson).forEach(key => {
            let value = document.getElementById(`input-${key}`).value;
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
            body : JSON.stringify(a)
        }
        fetch(props.postUrl,response).then(res => res.json()).then(res => {
            if(res.status === 200) alert("Success !");
            else alert(res.data);
        });
        clearInputs();
        if(props.navigate){
            if(typeof(props.navigate) === 'function'){props.closeFunc();props.navigate();}
            else navigate(props.navigate);
        }
    }

    return (
        <div className="inputFormContainer w-50 p-5 rounded shadow">
            <div className="d-flex justify-content-center mb-5">
                <h2>{`Create new ${props.modelKey}`}</h2>
            </div>
            {modelJson ? <InputForm dataSchema={modelJson} neglects = {props.neglects} /> : null}
            <div className="d-flex justify-content-center mt-5">
                <button className="btn btn-primary mx-2" onClick={postData}>Sumbit</button>
                {props.closeFunc ? <button className="btn btn-danger" onClick={props.closeFunc}>Close</button> : null}
            </div>
        </div>
    )
}

export default SubmitForm;