import React from 'react';
export const MaketableHead = (tableHeadParams) => {
  const th = [];
  const keys = Object.keys(tableHeadParams);
  for (const key of keys) {
    th.push(<th key={`${key}${keys.indexOf(key)}`}>{key}</th>);
  }
  return <tr key={`${keys[1]}${keys[0]}`}>{th}</tr>;
};
