import SubmitForm from "../../components/common/SubmitForm";

function New() {
    return (
        <div className="inputFormContainerRoot d-flex justify-content-center mt-5">
            <SubmitForm modelKey = {"auction"} neglects = {[]} postUrl = "/auction" navigate="/auctions" />
        </div>
    )
}

export default New;