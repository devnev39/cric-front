export default async function fetchData(uri,body){
    const req = {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(body),
        credentials : "include"
    }
    return await (await fetch(uri,req)).json();
}