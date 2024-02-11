import React from 'react';
import {Bar} from 'react-chartjs-2';
/**
 *
 * @param {Object} props.option options for chart
 * @returns
 */

function LineBarChart(props) {
  const data = {
    labels: props.data.map((obj) => obj[props.option.xkey]),
    datasets: [
      {
        type: 'line',
        label: props.option.ylinelabel,
        data: props.data.map((obj) => obj[props.option.ylinekey]),
      },
      {
        type: 'bar',
        label: props.option.ybarlabel,
        data: props.data.map((obj) => obj[props.option.ybarkey]),
      },
    ],
  };
  const max = () => {
    const m1 = props.data
        .map((obj) => obj[props.option.ylinekey])
        .sort(function(a, b) {
          return b - a;
        })[0];
    const m2 = props.data
        .map((obj) => obj[props.option.ybarkey])
        .sort(function(a, b) {
          return b - a;
        })[0];
    return m1 > m2 ? m1 : m2;
  };
  const option = {
    indexAxis: props.option.indexAxis || 'x',
    aspectRatio: props.option.aspectRatio,
    scales: {
      y: {
        suggestedMax: max() + 10,
        title: {
          display: true,
          text: [props.option.ylinelabel, props.option.ybarlabel],
          font: {
            weight: 500,
          },
          color: 'black',
        },
      },
      x: {
        title: {
          display: true,
          text: props.option.xlabel,
          font: {
            weight: 500,
          },
          color: 'black',
        },
      },
    },
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
  console.log(data);
  console.log(option);
  return (
    <>
      <Bar data={data} options={option} />
    </>
  );
}

export default LineBarChart;
