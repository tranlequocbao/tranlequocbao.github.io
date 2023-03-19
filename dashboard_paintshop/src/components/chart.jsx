import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Line} from "@ant-design/plots";

function Chart(props) {
    //get width of window
    const targetRef = useRef();
    const [data, setData] = useState([]);
    useEffect(() => {
          setData(props.values);
    }, [props.values]);
    // console.log(data)
    const type = props.type;
    // const { InteractionAction, registerInteraction, registerAction } = G2;
    const [labels, setLabels] = useState(15);
    useLayoutEffect(() => {
        if (targetRef.current) {
            if (targetRef.current.offsetWidth > 945) {
                setLabels(20);
            }
            if (targetRef.current.offsetWidth > 1265) {
                setLabels(30);
            }
            console.log(targetRef.current.offsetWidth);
        }
    }, [labels]);
    // labels && console.log(labels)
    const config = {
        data,
        color: ["#000099", "#66ff33", "#ff0000"],
        xField: "year",
        xAxis: {
            label: {
                style: {
                    fontWeight: "bold",
                    fontSize: labels,
                },
            },
        },
        yAxis: {
            label: {
                style: {
                    fontWeight: "bold",
                    fontSize: labels,
                },
                // formatter: (v) =>v=parseInt(v)+5,
            },

            tickInterval: 30,
            max: type === "wbs" ? 250 : 400,
            grid: null,
        },
        yField: "value",
        seriesField: "category",
        legend: {
            position: "bottom",
            itemName: {
                style: {
                    fontSize: labels - 2,
                },
            },
        },
        height: null,
        width: null,
        options: {
            aspecRatio: 1,
        },
        lineStyle: {
            lineWidth: labels ===40 ? 15 : 5,
        },
        point: {
            size: 5,
            shape: "custom-point",
            style: {
                fill: "white",
                stroke: "#5B8FF9",
                lineWidth: 2,
            },
        },
        tooltip: {
            showMarkers: true,
            style: {
                color: "green",
            },
        },
        state: {
            active: {
                style: {
                    shadowBlur: 4,
                    stroke: "#000",
                    fill: "red",
                },
            },
        },
        interactions: [
            {
                type: "custom-marker-interaction",
            },
        ],
        label: {
            layout: [
                {
                    type: "hide-overlap",
                },
            ],
            formatter: ({ value }) => (value ===0 ? "" : value),
            //
            style: {
                textAlign: "left",
                fontSize: labels,
                fontWeight: "bolder",
            },
        },
        annotations: [
            {
                type: "region",
                start: ["min", type === "wbs" ? 50 : 100],
                end: ["max", "0"],
                color: "#fff000",
                style: {
                    fill: "l(0) 0:#05fc57 1:#05fc57",
                },
            },
            {
                type: "line",
                start: ["min", type === "wbs" ? 50 : 100],
                end: ["max", type === "wbs" ? 50 : 100],
                style: {
                    stroke: "#00FF00",
                    lineDash: [1, 1],
                    lineWidth: 1,
                },
            },

            {
                type: "line",
                start: ["min", type === "wbs" ? 150 : 250],
                end: ["max", type === "wbs" ? 150 : 250],
                style: {
                    stroke: "#F4664A",
                    lineDash: [1, 1],
                    lineWidth: 1,
                },
            },
            {
                type: "region",
                start: ["min", type === "wbs" ? 150 : 250],
                end: ["max", "max"],
                //color: '#fff000',
                style: {
                    fill: "l(0) 0:#fc0505 1:#eb071e",
                },
            },
            {
                type: "text",
                position: ["min", type === "wbs" ? 50 : 100],
                content: type === "wbs" ? "50" : "100",
                offsetY: -10,
                offsetX: 4,
                style: {
                    textBaseline: "bottom",
                    fontSize: labels - 2,
                },
            },
            {
                type: "text",
                position: ["min", type === "wbs" ? 150 : 250],
                content: type === "wbs" ? "150" : "250",
                offsetY: -20,
                offsetX: 4,
                style: {
                    textBaseline: "top",
                    fontSize: labels - 2,
                },
            },
        ],
    };
    return (
        <div ref={targetRef}>
            <Line
                {...config}
                style={{
                    width: "100%",
                    // padding: 10,
                    height: 'calc(55vh - 20px)',
                }}
            />
        </div>
    );
}

export default Chart;
