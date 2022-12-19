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
        return Object.keys(dataSchema).map(key => makeRow(key,dataSchema[key]));
    }
    return (
        <>
            {makeInputRows(props.dataSchema,props.neglects)}
        </>
    )
}

export default InputForm;