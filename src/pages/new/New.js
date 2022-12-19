import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import InputForm from "../../components/new/InputForm";
import CryptoJS from "crypto-js";

function New() {
    const {model} = useParams();
    const [modelJson,setModelJson] = useState(null);
    const navigate = useNavigate();
    const fetchModelData = async () => {
        const res = await (await fetch(`/wimodels/${model}`)).json();
        if(res.status !== 200){alert(`${res.status} ${res.data}`);navigate(-1);}
        else setModelJson(res.data);
    }

    useEffect(() => {
        const run = async () => {
            await fetchModelData();
        }
        run();
    },[]);

    const encrypt = (key) => {
        console.log(process.env.REACT_APP_ENKEY);
        return CryptoJS.AES.encrypt(key,process.env.REACT_APP_ENKEY).toString();
    }

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
        const response = {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({auction : obj})
        }
        fetch("/auction",response).then(res => res.json()).then(res => {
            if(res.status === 200) alert("Success !");
            else alert(res.data);
        });
        clearInputs();
    }

    return (
        <div className="inputFormContainerRoot d-flex justify-content-center mt-5">
            <div className="inputFormContainer w-50 p-5 rounded shadow">
                <div className="d-flex justify-content-center mb-5">
                    <h2>{`Create new ${model}`}</h2>
                </div>
                {modelJson ? <InputForm dataSchema={modelJson} neglects = {["SRNO","No","Teams"]} /> : null}
                <div className="d-flex justify-content-center mt-5">
                    <button className="btn btn-primary" onClick={postData}>Sumbit</button>
                </div>
            </div>
        </div>
    )
}

export default New;