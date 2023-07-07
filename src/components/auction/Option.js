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
        <div className="optionContainerRoot">
            <div className="mt-5 d-flex justify-content-center">
                {modelJson ? <UpdateForm dataSchema = {modelJson} neglects = {["Password"]} model = {props.auctionObj} modelKey = "auction" /> : null}
            </div>
            <div className="RulesContainerRoot mt-5 d-flex justify-content-center">
                <div className="shadow rounded py-3 px-5 w-100">
                    <div className="d-flex justify-content-center h2 ">
                        Rules
                    </div>
                    <div className="playerRuleContainer border-top">
                        <div className="d-flex justify-content-start h4">
                            Player 
                        </div>
                        <div className="d-flex justify-content-center">
                            
                        </div>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-success">Add Rule</button>
                        </div>
                    </div>
                </div>
                
                
            </div>
        </div>
        
    )
}

export default Option;