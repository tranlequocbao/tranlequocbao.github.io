import React, { useEffect, useRef, useState } from "react";
import "../styles/ChartFTT.css";
import { Column } from "@ant-design/plots";
import socketIoClient from "socket.io-client";
import axios from "axios";
function ChartFTT(props) {
    const [data, setData] = useState([]);
    const [objectSocket, setObjectSocket] = useState([]);
    const socketRef = useRef();
    const host = "http://113.174.246.52:7798";
    useEffect(() => {
        getObjectSocket();
        getData();

    }, []);
    useEffect(() => {
        socketRef.current = socketIoClient.connect(host);
        objectSocket.map((val) => {
            socketRef.current.on(val.name, () => {
                if (val.name === "straightaway" || val.name === "toRepair") {
                    getData();

                }
            });
        });
    }, [props.socket.socketFTT]);
    const getData = () => {
        axios.post(`${host}/api/getFTT`).then((res) => {
            let array = res.data;

            let numDays = new Date().getDate();
            if (numDays < 15) numDays = 15;
            for (let i = 1; i <= numDays; i++) {
                let straightaway = array.filter(
                    (val) =>
                        val.name === "straightaway" &&
                        new Date(val.timeStamp).getDate() === i
                );

                let toRepair = array.filter(
                    (val) =>
                        val.name === "toRepair" && new Date(val.timeStamp).getDate() === i
                );

                data.push(
                    {
                        name: "Body OK",
                        amount: straightaway.length > 0 ? straightaway[0].amount : 0,
                        timeStamp: `${i}`,
                    },
                    {
                        name: "Body need Repair",
                        amount: toRepair.length > 0 ? toRepair[0].amount : 0,
                        timeStamp: `${i}`,
                    }
                );
            }

            setData(data);
        });
    };
    const getObjectSocket = () => {
        axios
            .post("http://113.174.246.52:7798/api/returnObjectSocket")
            .then((res) => {
                res.data.push({ name: "targetProduction" });
                setObjectSocket(res.data);
            });
    };
    const config = {
        data,
        xField: "timeStamp",
        yField: "amount",
        seriesField: "name",
        isPercent: true,
        isStack: true,
        xAxis: {},

        label: {
            position: "middle",
            content: (val) => {
                return val.amount !== 0 ? val.amount.toFixed(2) * 100 + "%" : "";
            },
            style: {
                fill: "#fff",
                fontSize: 14,
                color: "black",
            },
            layout: [
                {
                    type: "hide-overlap",
                },
            ],
        },
        xAxis: {
            label: {
                style: {
                    fontSize: 15,
                },
            },
            title: {
                text: "DAY (IN CURRENT MONTH)",
                style: {
                    fontSize: 16,
                    fontWeight: "bold",
                },
            },
        },
        yAxis: {
            label: {
                style: {
                    fontSize: 15,
                },
            },
            title: {
                text: "PERCENT",
                style: {
                    fontSize: 16,
                    fontWeight: "bold",
                },
            },
        },
        legend: {
            position: "top-left",
            itemName: {
                style: {
                    fontSize: 18,
                    fontWeight: "bold",
                },
            },
        },
    };

    return (
        <div className="child-board FTT">
            <div className="title-FTT-Chart">FTT</div>
            <div className="dpu-FTT">
                <Column {...config} />
            </div>
        </div>
    );
}

export default ChartFTT;
