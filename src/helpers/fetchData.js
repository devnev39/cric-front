export default async function fetchData(uri,body){
    const req = {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(body)
    }
    const res = await (await fetch(uri,req)).json();
    return res;
}