const authenticateResponse = async (response,obj) => {
    const postResp = {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(obj)
    };
    const resp = await (await fetch(response.POST,postResp)).json();
    if(resp === 200) return true;
    return resp;
}

export default authenticateResponse;