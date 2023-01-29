import { useEffect, useState } from "react";
import fetchModel from "../../helpers/fetchModel";
import UpdateForm from "../common/UpdateForm";

function Option(props) {
    const [modelJson,setModelJson] = useState(null);
    useEffect(() => {
        const run = async () => {
            await fetchModel("/wimodels/auction",setModelJson);
        }
        run();
    },[]);

    return (
        <div className="optionContainerRoot mt-5 d-flex justify-content-center">
            {modelJson ? <UpdateForm dataSchema = {modelJson} neglects = {["Password"]} model = {props.auctionObj} modelKey = "auction" /> : null}
        </div>
    )
}

export default Option;