import React, { useEffect, useState } from "react";
import { Column } from "@ant-design/plots";
import { each, groupBy } from "@antv/util";

function ChartColumn(props) {
      const [data, setData] = useState([]);
      useEffect(() => {
            setData(props.value);
      }, [props.value]);
      const annotations = [];

      each(groupBy(data, "year"), (values, k) => {
            const value = values.reduce((a, b) => a + b.value, 0);
            annotations.push({
                  type: "text",
                  position: [k, value],
                  content: `${value}`,
                  style: {
                        textAlign: "center",
                        fontSize: 18,
                        fill: "rgba(0,0,0,0.85)",
                  },
                  offsetY: -10,
            });
      });

      const config = {
            data,
            isStack: true,
            yField: "value",
            xField: "year",
            seriesField: "type",
            yAxis: {
                  label: {
                        style: {
                              fontWeight: "bold",
                              fontSize: 20,
                        },
                        // formatter: (v) =>v=parseInt(v)+5,
                  },

                  tickInterval: 30,
            },
            xAxis: {
                  label: {
                        style: {
                              //fontWeight: "bold",
                              fontSize: 14,
                        },
                        formatter: (v) => `Ngày ${v}`,
                  },
            },
            legend: {
                  position: "bottom",
                  itemName: {
                        style: {
                              fontSize: 18,
                        },
                  },
            },
            height: null,
            width: null,
            label: {
                  position: "middle",
                  layout: [
                        {
                              type: "interval-adjust-position",
                        },
                        {
                              type: "interval-hide-overlap",
                        },
                        {
                              type: "adjust-color",
                        },
                  ],
                  style: {
                        fontSize: 18,
                  },
            },
            point: {
                  size: 10,
                  shape: "custom-point",
                  style: {
                        fill: "white",
                        stroke: "#5B8FF9",
                        lineWidth: 2,
                  },
            },
            annotations,
      };

      return (
            <div>
                  <Column
                        {...config}
                        style={{
                              width: "100%",
                              // padding: 10,
                              height: "calc(55vh - 20px)",
                        }}
                  />
            </div>
      );
}

export default ChartColumn;
