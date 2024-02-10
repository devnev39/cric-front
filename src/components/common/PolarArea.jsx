import React from 'react';
import {PolarArea} from 'react-chartjs-2';

/**
 *
 * @param {Object} props properties for polar chart
 * @returns
 */
function PolarAreaChart(props) {
  const data = {
    labels: props.data.map((e) => e[props.option.xkey]),
    datasets: [
      {
        label: props.option.ylabel,
        data: props.data.map((e) => e[props.option.ykey]),
      },
    ],
  };

  const option = {
    plugins: {
      title: {
        display: props.option.chartTitle || false,
        text: props.option.chartTitle,
        font: {
          size: props.option.chartTitleSize,
        },
        position: props.option.chartTitlePosition,
      },
    },
  };
  return (
    <>
      <PolarArea data={data} options={option} />
    </>
  );
}

export default PolarAreaChart;
