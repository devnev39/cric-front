import settings from "../../config/settings.json";
const authenticateResponse = async (response,obj) => {
    const postResp = {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(obj),
        credentials : "include"
    };
    const resp = await (await fetch(`${settings.BaseUrl}${response.POST}`,postResp)).json();
    if (resp === 200) {
      return true;
    }
    return resp;
}

export default authenticateResponse;