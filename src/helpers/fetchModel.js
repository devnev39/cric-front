const fetchModel = async (uri,setModelFunction) => {
    const reponse = await (await fetch(uri)).json();
    if(reponse.status !== 200){alert(reponse.data); return;}
    setModelFunction(reponse.data);
}

export default fetchModel; 