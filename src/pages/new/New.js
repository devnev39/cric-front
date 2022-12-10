import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

function New() {
    const {model} = useParams();
    const [modelJson,setModelJson] = useState(null);
    const fetchModelData = async () => {
        const res = await (await fetch(`/models/${model}`)).json();
        if(res.status !== 200) alert(`${res.status} ${res.data}`);
        else setModelJson(res.data);
    }

    useEffect(() => {
        const run = async () => {
            await fetchModelData();
        }
        run();
    },[]);

    return (
        <>{modelJson}</>
    )
}

export default New;