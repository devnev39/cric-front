import React from 'react';
import {Bar} from 'react-chartjs-2';
import {Chart, registerables} from 'chart.js';
Chart.register(...registerables);

function BarChart(props) {
  const tooltip = {
    displayColors: false,
    callbacks: {
      label: (context) => {
        const text = [];
        for (const key of props.option.tooltipInfoKeys) {
          text.push(
              `${key} : ${props.data.find((obj) => obj.Name === context.label)[key]}`,
          );
        }
        return text;
      },
    },
  };
  const option = {
    indexAxis: props.option.indexAxis || 'x',
    plugins: {
      tooltip: props.option.tooltipInfoKeys ? tooltip : {},
    },
    scales: {
      y: {
        suggestedMax: props.data.map((obj) => obj[props.option.ykey])[0] + 10,
        title: {
          display: true,
          text: props.option.ylabel,
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
  };
  const data = {
    labels: props.data.map((obj) => obj[props.option.xkey]),
    datasets: [
      {
        label: props.option.label,
        data: props.data.map((obj) => obj[props.option.ykey]),
      },
    ],
  };
  return <Bar data={data} options={option} />;
}

export default BarChart;
