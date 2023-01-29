import {PolarArea} from "react-chartjs-2"
import {Chart as ChartJS} from "chart.js/auto"

/**
 * 
 * @param {Object} props properties for polar chart
 * @returns 
 */
function PolarAreaChart(props) {
    const data = {
        labels : props.data.map(e => e[props.option.xkey]),
        datasets : [
            {
                label : props.option.ylabel,
                data : props.data.map(e => e[props.option.ykey])
            }
        ]
    }
    return (
        <>
        <PolarArea data={data} />
        </>
    )
}

export default PolarAreaChart;