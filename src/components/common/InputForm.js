function InputForm(props) {
    const makeRow = (label,type) => {
        return (
            <div className="row py-2" key={`label-${label}`}>
                <div className="col-3 font-weight-bold">
                    {label}
                </div>
                <div className="col-3">
                    :
                </div>
                <div className="col-6">
                    <input type={type ? type : 'text'} id={`input-${label}`} className="w-100" />
                </div>
            </div>
        )
    }
    const makeInputRows = (dataSchema,neglects) => {
        if(!neglects) neglects = [];
        return Object.keys(dataSchema).map(key => {if(neglects.indexOf(key) === -1) return makeRow(key,dataSchema[key]);return null;});
    }
    return (
        <>
            {makeInputRows(props.dataSchema,props.neglects)}
        </>
    )
}

export default InputForm;