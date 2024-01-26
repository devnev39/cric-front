export const MaketableHead = (tableHeadParams) => {
    let th = [];
    const keys = Object.keys(tableHeadParams);
    for(let key of keys) {
        th.push((<th key={`${key}${keys.indexOf(key)}`}>{key}</th>));
    }
    return (<tr key={`${keys[1]}${keys[0]}`}>{th}</tr>);
}