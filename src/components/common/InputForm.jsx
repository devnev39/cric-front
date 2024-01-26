import React from 'react';
/**
 *
 * @param {Object} props.dataSchema Dataschema object cotaning keys and types
 * @param {Array} props.neglects Neglects to neglect from dataschema
 * @param {Stringg} props.parentKey Parent component key
 * @returns
 */
function InputForm(props) {
  const makeRow = (label, type) => {
    return (
      <div className="row py-2" key={`label-${label}`}>
        <div className="col-3 font-weight-bold">{label}</div>
        <div className="col-3">:</div>
        <div className="col-6">
          <input
            type={type || 'text'}
            id={`input-${label}-${props.parentKey}`}
            className="w-100"
          />
        </div>
      </div>
    );
  };
  const makeInputRows = (dataSchema, neglects) => {
    if (!neglects) {
      neglects = [];
    }
    return Object.keys(dataSchema).map((key) => {
      if (neglects.indexOf(key) === -1) {
        return makeRow(key, dataSchema[key]);
      }
      return null;
    });
  };
  return <>{makeInputRows(props.dataSchema, props.neglects)}</>;
}

export default InputForm;
