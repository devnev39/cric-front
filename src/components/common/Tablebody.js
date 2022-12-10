export const MaketableBody = (data,tableHeadParams) => {
    if(data){
        const keys = Object.keys(tableHeadParams);
        let tr = [];
        for(let each of data){
            let td = [];
            for(let key of keys){
                td.push(<td key={`${data.indexOf(each)}${keys.indexOf(key)}`}>{each[key]}</td>);
            }
            tr.push(<tr key={`${each[0]}${data.indexOf(each)}`}>{td}</tr>);
        }
        return tr;
    }
    return (<></>);
}