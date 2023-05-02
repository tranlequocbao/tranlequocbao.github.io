import React, { useEffect, useState } from "react";
import "../styles/Dpu.css";
import { Line, Pie, Column, G2 } from "@ant-design/plots";
import { ContactSupportOutlined } from "@mui/icons-material";
import { red } from "@mui/material/colors";
function ChartDPU(props) {

     let data=props.value.dataDPUNoDirt
    

      const [chartData, setChartData] = useState([]);
      const [chartDataNoDirt,setChartDataNoDirt]=useState([])
      const [colorData, setColorData] = useState([]);
      const [colorDataRatio, setColorDataRatio] = useState([]);
      // const [dataChart,setDataChart]=useState([])
      useEffect(() => {
                 getDataDPU(props.value.dataDPU, props.value.dataTarget.targetDPU);
                  getDataColor(props.value.dataDPU);
                  getDataColorRatio(props.value.dataDPU);
                 // getDataDPUNoDirt(data, props.value.dataTarget.targetDPU)
                  //setChartData(dataVirtual)
            
      }, [props.value]);

      const COLOR_PLATE_10 = [
            "#5B8FF9",
            "#5AD8A6",
            "#5D7092",
            "#F6BD16",
            "#E8684A",
            "#6DC8EC",
            "#9270CA",
            "#FF9D4D",
            "#269A99",
            "#FF99C3",
      ];
    
      const COLOR_COLOR = {
            "25D1": "#f2faf4",
            "46V": "#d60d0d",
            "42M": "#151E2E",
            "41W": "#0E0E0E",
            "47S": "#979985",
            "46G": "#6A6B6D",
            "47C": "#4054db",
            M6MY: "#900C12",
            KWE: "#f2faf4",
            ELG: "#7A381B",
            KTV: "#060708",
            EVL: "#272B2E",
            EDZ: "#00497B",
            KCM: "#A56549",
            KLS: "#D16B00",
            EEG: "#225F8F",
      };

      const getDataDPUNoDirt=(data,targetDPU)=>{
            let mazda = [];
            let peugeot = [];
            let target = [];
            let numDays = new Date().getDate();
            if (numDays < 15) numDays = 15;
            for (let i = 1; i <= numDays; i++) {
                  let dataMazda = data.filter(
                        (val) =>
                              val.TYPE === "MAZDA" && new Date(val.PASS_DATETIME).getDate() === i
                  );
                  if (dataMazda.length > 0) {
                        let amount = parseInt(
                              (
                                    dataMazda.reduce(
                                          (total, nexval) => total + parseInt(nexval.error_type_count),
                                          0
                                    ) / dataMazda.length
                              ).toFixed(2)
                        );
                        mazda.push({
                              date: `${i}`,
                              type: "MAZDA",
                              amount: amount,
                        });
                  } else {
                        mazda.push({
                              date: `${i}`,
                              type: "MAZDA",
                              amount: 0,
                        });
                  }
                  let dataPeugeot = data.filter(
                        (val) =>
                              val.TYPE === "PEUGEOT" && new Date(val.PASS_DATETIME).getDate() === i
                  );
                  if (dataPeugeot.length > 0) {
                        let amount = parseInt(
                              (
                                    dataPeugeot.reduce(
                                          (total, nexval) => total + parseInt(nexval.error_type_count),
                                          0
                                    ) / dataPeugeot.length
                              ).toFixed(2)
                        );
                        mazda.push({
                              date: `${i}`,
                              type: "PEUGEOT",
                              amount: amount,
                        });
                  } else {
                        mazda.push({
                              date: `${i}`,
                              type: "PEUGEOT",
                              amount: 0,
                        });
                  }
                  target.push({
                        date: `${i}`,
                        type: "TARGET",
                        amount: targetDPU,
                  });
            }
            setChartDataNoDirt(mazda.concat(peugeot.concat(target)));
      }
      const getDataDPU = (data, targetDPU) => {
            let mazda = [];
            let peugeot = [];
            let target = [];
            let numDays = new Date().getDate();
            if (numDays < 15) numDays = 15;
            for(let i=1;i<=numDays;i++){
                  let dataMazda=[]
                  let dataPeugeot=[]
                  if(data.length>0){
                        dataMazda = data.filter(val=>val.type_export==='old' && new Date(val.updated_at).getDate()===i)
                        if(dataMazda.length>0){
                              mazda.push({
                                    date:`${i}`,
                                    type:'MAZDA',
                                    amount:dataMazda.reduce((total,nval)=>total+parseInt(nval.amount))
                              })
                        }
                        dataPeugeot = data.filter(val=>val.type_export==='new' && new Date(val.updated_at).getDate()===i)
                        if(dataPeugeot.length>0){
                              peugeot.push({
                                    date:`${i}`,
                                    type:'PEUGEOT',
                                    amount:dataPeugeot.reduce((total,nval)=>total+parseInt(nval.amount))
                              })
                        }
                  }
                  else{
                              mazda.push({
                                    date:`${i}`,
                                    type:'MAZDA',
                                    amount:0
                              })
                              peugeot.push({
                                    date:`${i}`,
                                    type:'PEUGEOT',
                                    amount:0
                              })
                  }
                  
            }
            // if (numDays < 15) numDays = 15;
            // for (let i = 1; i <= numDays; i++) {
            //       let dataMazda = data.filter(
            //             (val) =>
            //                   val.TYPE === "MAZDA" && new Date(val.PASS_DATETIME).getDate() === i
            //       );
            //       if (dataMazda.length > 0) {
                    
            //             let amount = parseInt(
            //                   (
            //                         dataMazda.reduce(
            //                               (total, nexval) => total + parseInt(nexval.error_type_count),
            //                               0
            //                         ) / dataMazda.length
            //                   ).toFixed(2)
            //             );
                    
            //             if(amount>parseInt(targetDPU)) amount =amount-5
            //             mazda.push({
            //                   date: `${i}`,
            //                   type: "MAZDA",
            //                   amount: amount,
            //             });
            //       } else {
            //             mazda.push({
            //                   date: `${i}`,
            //                   type: "MAZDA",
            //                   amount: 0,
            //             });
            //       }
            //       let dataPeugeot = data.filter(
            //             (val) =>
            //                   val.TYPE === "PEUGEOT" && new Date(val.PASS_DATETIME).getDate() === i
            //       );
            //       if (dataPeugeot.length > 0) {
            //             let amount = parseInt(
            //                   (
            //                         dataPeugeot.reduce(
            //                               (total, nexval) => total + parseInt(nexval.error_type_count),
            //                               0
            //                         ) / dataPeugeot.length
            //                   ).toFixed(2)
            //             );
            //             if(i===15){
            //                   console.log(i)
            //                   console.log(amount)
            //                   console.log(dataPeugeot)
            //             }

            //             if(amount>parseInt(targetDPU)) amount = amount-5
            //             mazda.push({
            //                   date: `${i}`,
            //                   type: "PEUGEOT",
            //                   amount: amount,      
            //             });
            //       } else {
            //             mazda.push({
            //                   date: `${i}`,
            //                   type: "PEUGEOT",
            //                   amount: 0,
            //             });
            //       }
            //       target.push({
            //             date: `${i}`,
            //             type: "TARGET",
            //             amount: targetDPU,
            //       });
            // }
           setChartData(mazda.concat(peugeot.concat(target)));
      };
      const getDataColor = (data) => {
            let colorData = [];
            let amountColor = 0;

            if(data.length===0){
                 
                  colorData.push({
                        name: 'No Color',
                        amount: 0
                  });
            }
            else{
                  data = data.filter(val=>val.updated_at=== new Date().getDate())
                  const colorLib = [
                        ...new Set(
                              data.filter((val) => val.color !== "").map((val) => val.color.trim())
                        ),
                  ];
                  colorLib.map((val, ind) => {
                        amountColor = data.filter((value) => value.COLOR === val).length;
                        colorData.push({
                              name: val,
                              amount: amountColor!=0?amountColor:0,
                        });
                  });
            }
       
            setColorData(colorData);
      };
      const getDataColorRatio = (data) => {
            let colorData = [];
            let amountColor = 0;
            let amountErrorDirt = 0;
            if(data.length===0){
                  let numDays = new Date().getDate();
                  if (numDays < 15) numDays = 15;
                  for (let i = 1; i <= numDays; i++) {
                        colorData.push({
                              name: `No Color`,
                              amount:0,
                              date: `${i}`,
                        });
                  }
            }
                
            else{
                  data = data.filter(val=>val.updated_at=== new Date().getDate())
                  const colorLib = [
                        ...new Set(
                              data.filter((val) => val.color !== "").map((val) => val.color.trim())
                        ),
                  ];
               
                  let numDays = new Date().getDate();
                  if (numDays < 15) numDays = 15;
      
                  for (let i = 1; i <= numDays; i++) {
                        colorLib.map((val, ind) => {
                              amountColor = data.filter(
                                    (value) =>
                                          value.color === val && new Date(value.updated_at).getDate() === i
                              ).length;
                              amountErrorDirt = data
                                    .filter(
                                          (value) =>
                                                value.color === val &&
                                                new Date(value.updated_at).getDate() === i
                                    )
                                    .reduce(
                                          (total, nextval) => total + parseInt(nextval.error_type_count),
                                          0
                                    );
                              let result = amountErrorDirt / amountColor;
      
                              colorData.push({
                                    name: `${val}`,
                                    amount: !result ? 0 : parseInt(amountErrorDirt / amountColor),
                                    date: `${i}`,
                              });
                              return val;
                        });
                  }
            }
            
            
            setColorDataRatio(colorData);
      };

      // const dataVirtual =
      //       [
      //             {
      //               "date": "1",
      //               "type": "MAZDA",
      //               "amount": 9
      //             },
      //             {
      //               "date": "1",
      //               "type": "PEUGEOT",
      //               "amount": 8
      //             },
      //             {
      //               "date": "2",
      //               "type": "MAZDA",
      //               "amount": 7
      //             },
      //             {
      //               "date": "2",
      //               "type": "PEUGEOT",
      //               "amount": 6
      //             },
      //             {
      //               "date": "3",
      //               "type": "MAZDA",
      //               "amount": 10
      //             },
      //             {
      //               "date": "3",
      //               "type": "PEUGEOT",
      //               "amount": 8
      //             },
      //             {
      //               "date": "4",
      //               "type": "MAZDA",
      //               "amount": 7
      //             },
      //             {
      //               "date": "4",
      //               "type": "PEUGEOT",
      //               "amount": 8
      //             },
      //             {
      //               "date": "5",
      //               "type": "MAZDA",
      //               "amount": 10
      //             },
      //             {
      //               "date": "5",
      //               "type": "PEUGEOT",
      //               "amount": 9
      //             },
      //             {
      //               "date": "6",
      //               "type": "MAZDA",
      //               "amount": 6
      //             },
      //             {
      //               "date": "6",
      //               "type": "PEUGEOT",
      //               "amount": 5
      //             },
      //             {
      //               "date": "7",
      //               "type": "MAZDA",
      //               "amount": 10
      //             },
      //             {
      //               "date": "7",
      //               "type": "PEUGEOT",
      //               "amount": 6
      //             },
      //             {
      //               "date": "8",
      //               "type": "MAZDA",
      //               "amount": 5
      //             },
      //             {
      //               "date": "8",
      //               "type": "PEUGEOT",
      //               "amount": 3
      //             },
      //             {
      //               "date": "9",
      //               "type": "MAZDA",
      //               "amount": 7
      //             },
      //             {
      //               "date": "9",
      //               "type": "PEUGEOT",
      //               "amount": 6
      //             },
      //             {
      //               "date": "10",
      //               "type": "MAZDA",
      //               "amount": 8
      //             },
      //             {
      //               "date": "10",
      //               "type": "PEUGEOT",
      //               "amount": 10
      //             },
      //             {
      //               "date": "11",
      //               "type": "MAZDA",
      //               "amount": 5
      //             },
      //             {
      //               "date": "11",
      //               "type": "PEUGEOT",
      //               "amount": 7
      //             },
      //             {
      //               "date": "12",
      //               "type": "MAZDA",
      //               "amount": 10
      //             },
      //             {
      //               "date": "12",
      //               "type": "PEUGEOT",
      //               "amount": 9
      //             },
      //             {
      //               "date": "13",
      //               "type": "MAZDA",
      //               "amount": 7
      //             },
      //             {
      //               "date": "13",
      //               "type": "PEUGEOT",
      //               "amount": 6
      //             },
      //             {
      //               "date": "14",
      //               "type": "MAZDA",
      //               "amount": 8
      //             },
      //             {
      //               "date": "14",
      //               "type": "PEUGEOT",
      //               "amount": 9
      //             },
      //             {
      //               "date": "15",
      //               "type": "MAZDA",
      //               "amount": 5
      //             },
      //             {
      //               "date": "15",
      //               "type": "PEUGEOT",
      //               "amount": 7
      //             },
      //             {
      //               "date": "16",
      //               "type": "MAZDA",
      //               "amount": 6
      //             },
      //             {
      //               "date": "16",
      //               "type": "PEUGEOT",
      //               "amount": 10
      //             },
      //             {
      //               "date": "17",
      //               "type": "MAZDA",
      //               "amount": 8
      //             },
      //             {
      //               "date": "17",
      //               "type": "PEUGEOT",
      //               "amount": 8
      //             },
      //             {
      //               "date": "18",
      //               "type": "MAZDA",
      //               "amount": 8
      //             },
      //             {
      //               "date": "18",
      //               "type": "PEUGEOT",
      //               "amount": 6
      //             },
      //             {
      //               "date": "19",
      //               "type": "MAZDA",
      //               "amount": 9
      //             },
      //             {
      //               "date": "19",
      //               "type": "PEUGEOT",
      //               "amount": 1
      //             },
      //             {
      //               "date": "20",
      //               "type": "MAZDA",
      //               "amount": 10
      //             },
      //             {
      //               "date": "20",
      //               "type": "PEUGEOT",
      //               "amount": 0
      //             },
      //             {
      //               "date": "21",
      //               "type": "MAZDA",
      //               "amount": 7
      //             },
      //             {
      //               "date": "21",
      //               "type": "PEUGEOT",
      //               "amount": 9
      //             },
      //             {
      //               "date": "22",
      //               "type": "MAZDA",
      //               "amount": 6
      //             },
      //             {
      //               "date": "22",
      //               "type": "PEUGEOT",
      //               "amount": 8
      //             },
      //             {
      //               "date": "23",
      //               "type": "MAZDA",
      //               "amount": 4
      //             },
      //             {
      //               "date": "23",
      //               "type": "PEUGEOT",
      //               "amount": 6
      //             },
      //             {
      //               "date": "24",
      //               "type": "MAZDA",
      //               "amount": 6
      //             },
      //             {
      //               "date": "24",
      //               "type": "PEUGEOT",
      //               "amount": 9
      //             },
      //             {
      //               "date": "25",
      //               "type": "MAZDA",
      //               "amount": 6
      //             },
      //             {
      //               "date": "25",
      //               "type": "PEUGEOT",
      //               "amount": 8
      //             },
      //             {
      //               "date": "26",
      //               "type": "MAZDA",
      //               "amount": 9
      //             },
      //             {
      //               "date": "26",
      //               "type": "PEUGEOT",
      //               "amount": 0
      //             },
      //             {
      //               "date": "27",
      //               "type": "MAZDA",
      //               "amount": 8
      //             },
      //             {
      //               "date": "27",
      //               "type": "PEUGEOT",
      //               "amount": 6
      //             },
      //             {
      //               "date": "1",
      //               "type": "TARGET",
      //               "amount": 11
      //             },
      //             {
      //               "date": "2",
      //               "type": "TARGET",
      //               "amount": 11
      //             },
      //             {
      //               "date": "3",
      //               "type": "TARGET",
      //               "amount": 11
      //             },
      //             {
      //               "date": "4",
      //               "type": "TARGET",
      //               "amount": 11
      //             },
      //             {
      //               "date": "5",
      //               "type": "TARGET",
      //               "amount": 11
      //             },
      //             {
      //               "date": "6",
      //               "type": "TARGET",
      //               "amount": 11
      //             },
      //             {
      //               "date": "7",
      //               "type": "TARGET",
      //               "amount": 11
      //             },
      //             {
      //               "date": "8",
      //               "type": "TARGET",
      //               "amount": 11
      //             },
      //             {
      //               "date": "9",
      //               "type": "TARGET",
      //               "amount": 11
      //             },
      //             {
      //               "date": "10",
      //               "type": "TARGET",
      //               "amount": 11
      //             },
      //             {
      //               "date": "11",
      //               "type": "TARGET",
      //               "amount": 11
      //             },
      //             {
      //               "date": "12",
      //               "type": "TARGET",
      //               "amount": 11
      //             },
      //             {
      //               "date": "13",
      //               "type": "TARGET",
      //               "amount": 11
      //             },
      //             {
      //               "date": "14",
      //               "type": "TARGET",
      //               "amount": 11
      //             },
      //             {
      //               "date": "15",
      //               "type": "TARGET",
      //               "amount": 11
      //             },
      //             {
      //               "date": "16",
      //               "type": "TARGET",
      //               "amount": 11
      //             },
      //             {
      //               "date": "17",
      //               "type": "TARGET",
      //               "amount": 11
      //             },
      //             {
      //               "date": "18",
      //               "type": "TARGET",
      //               "amount": 11
      //             },
      //             {
      //               "date": "19",
      //               "type": "TARGET",
      //               "amount": 11
      //             },
      //             {
      //               "date": "20",
      //               "type": "TARGET",
      //               "amount": 11
      //             },
      //             {
      //               "date": "21",
      //               "type": "TARGET",
      //               "amount": 11
      //             },
      //             {
      //               "date": "22",
      //               "type": "TARGET",
      //               "amount": 11
      //             },
      //             {
      //               "date": "23",
      //               "type": "TARGET",
      //               "amount": 11
      //             },
      //             {
      //               "date": "24",
      //               "type": "TARGET",
      //               "amount": 11
      //             },
      //             {
      //               "date": "25",
      //               "type": "TARGET",
      //               "amount": 11
      //             },
      //             {
      //               "date": "26",
      //               "type": "TARGET",
      //               "amount": 11
      //             },
      //             {
      //               "date": "27",
      //               "type": "TARGET",
      //               "amount": 11
      //             }
      //           ]
      
      const configColor = {
            appendPadding: 10,
            data: colorData,
            angleField: "amount",
            colorField: "name",
            radius: 1,
            innerRadius: 0.6,
            label: {
                  type: "inner",    
                  offset: "-50%",
                  content: "{value}",
                  style: {
                        textAlign: "center",
                        fontSize: 14,
                        fontWeight: "bold",
                  },
                  layout: [
                        {
                              type: "adjust-color",
                        },
                  ],
            },
            color: (val) => COLOR_COLOR[`${val.name}`],
            interactions: [
                  {
                        type: "element-selected",
                  },
                  {
                        type: "element-active",
                  },
            ],
            legend: {
                  itemName: {
                        style: {
                              fontSize: 15,
                              fill: "white",
                        },
                  },
            },
            statistic: {
                  title: false,
                  position: "center",
                  content: {
                        style: {
                              whiteSpace: "pre-wrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              fontSize: 15,
                              color: "white",
                        },
                        content: "Amount\nColor",
                  },
            },
      };
      ///config chart Line with dpu chart main

 
      const configChartMain = {
            data: chartData,
            xField: "date",
            yField: "amount",
            seriesField: "type",
            yAxis: {
                  label: {
                        formatter: (v) =>
                              `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
                  },
            },
            color: COLOR_PLATE_10,
            point: {
                  size: 10,
                  shape: ({ type }) => {
                        return type === "MAZDA" ? "square" : "circle";
                  },
                  style: ({ date }) => {
                        return {
                              r: Number(date) % 4 ? 0 : 3,
                        };
                  },
            },
            label: {
                  layout: [
                        {
                              type: "hide-overlap",
                        },
                  ],

                  style: {
                        textAlign: "left",
                        fontSize: 15,
                  },
                  formatter: (item) => item.amount,
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

      const configColorRatio = {
            data: colorDataRatio,
            isStack: true,
            xField: "date",
            yField: "amount",
            seriesField: "name",

            xAxis: {
                  title: {
                        text: "DIRT RATE OF EACH COLOR",
                        style: {
                              fontSize: 16,
                              fontWeight: "bold",
                        },
                  },
            },
            label: {
                  formatter: (val) => (val.amount !== 0 ? val.amount : ""),

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
            },
      };

      return (
            <div className="child-board dpu">
                  <div className="titleChartDPU">DPU</div>
                  <div className="dpu-chart-main">
                        <div className="titleDPUChart">DPU CHART</div>
                        <Line {...configChartMain} className="chart-dpu" />
                  </div>
                  <div className="dpu-chart-color">
                        <div className="dpu-chart-mount-color">
                              <Pie {...configColor} className="chart-color"></Pie>
                        </div>
                        <div className="dpu-chart-ratio-color">
                              {/* <div className='title-color-ratio'>COLOR RATIO</div> */}
                              <Column {...configColorRatio} className="chart-color-ratio" />
                        </div>
                  </div>
            </div>
      );
}
export default ChartDPU;
