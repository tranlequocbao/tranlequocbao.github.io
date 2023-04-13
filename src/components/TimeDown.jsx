import React, { useEffect, useState } from "react";
import { Column } from "@ant-design/plots";
import "../styles/TimeDown.css";
function TimeDown(props) {
  const [data, setData] = useState([]);
  useEffect(() => {
    getData(props.value.dataTimeDown);
  }, [props.value]);
  const station = {
    timeDownQC1K1: "Time Down QC1K 1",
    timeDownQC1K2: "Time Down QC1K 2",
  };
  const getData = (data) => {
    let configdata = [];
    // let numDays = new Date(new Date().getDate(), new Date().getMonth() + 1, 0).getDate()
    let numDays = new Date().getDate();
    if (numDays < 15) numDays = 15;

    for (let i = 1; i <= numDays; i++) {
      let dataDraw = data.filter(
        (val) =>
          val.name.substring(0, 8) === "timeDown" &&
          new Date(val.timeStamp).getDate() === i
      );
      if (dataDraw.length > 0) {
        dataDraw.map((value) => {
          configdata.push({
            name: station[value.name],
            amount: parseInt((value.amount / 60).toFixed(0)),
            timeStamp: `${i}`,
          });
        });
      } else {
        configdata.push(
          {
            name: "Time Down QC1K 1",
            amount: 0,
            timeStamp: `${i}`,
          },
          {
            name: "Time Down QC1K 2",
            amount: 0,
            timeStamp: `${i}`,
          }
        );
      }
    }
    setData(configdata);
  };
  const config = {
    data,
    xField: "timeStamp",
    yField: "amount",
    seriesField: "name",
    isGroup: true,
    columnStyle: {
      radius: [20, 20, 0, 0],
    },

    xAxis: {
      title: {
        text: "DAY (IN CURRENT MONTH)",
        style: {
          fontSize: 16,
          fontWeight: "bold",
        },
      },
    },
    yAxis: {
      title: {
        text: "Minute",
        style: {
          fontSize: 16,
          fontWeight: "bold",
        },
      },
    },
    label: {
      formatter: (val) => (val.amount !== 0 ? val.amount : ""),
      style: {
        fontSize: 16,
      },
      offset: "-50%",

      position: "top",
      layout: [
        {
          type: "interval-adjust-position",
        },
        {
          // type: 'interval-hide-overlap',
        },
        {
          type: "adjust-color",
        },
      ],
    },
    legend: {
      itemName: {
        style: {
          fontSize: 16,
          fontWeight: "bold",
        },
      },
    },
  };
  return (
    <div className="child-board timeDown">
      <div className="title-timedown">TIME DOWN</div>
      <div className="dpu-timedown">
        <Column {...config} className="chartTimeDown" />
      </div>
    </div>
  );
}

export default TimeDown;

