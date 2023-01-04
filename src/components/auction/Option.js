import { useEffect, useState } from "react";
import fetchModel from "../../helpers/fetchModel";
import UpdateForm from "./UpdateForm";

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
            <div className="w-50 rounded shadow p-5">
                <div className="d-flex justify-content-center">
                    <h2 className="pb-5">Edit auction parameters</h2>
                </div>
                {modelJson ? <UpdateForm dataSchema = {modelJson} neglects = {["SRNO","No","Teams","Password"]} model = {props.auctionObj} modelKey = {"auction"} /> : null}
            </div>
        </div>
    )
}

export default Option;