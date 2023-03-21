import React, { useEffect, useState } from 'react'
import '../styles/Dpu.css'
import { Line, Pie, Column, G2 } from '@ant-design/plots';
import { ContactSupportOutlined } from '@mui/icons-material';
import { red } from '@mui/material/colors';
function ChartDPU(props) {
      // console.log(props.value)
      const [chartData, setChartData] = useState([])
      const [colorData, setColorData] = useState([])
      const [colorDataRatio, setColorDataRatio] = useState([])
      // const [dataChart,setDataChart]=useState([])
      useEffect(() => {
            if (props.value.dataDPU.length > 0) {

                  getDataDPU(props.value.dataDPU, props.value.dataTarget.targetDPU)
                  getDataColor(props.value.dataDPU)
                  getDataColorRatio(props.value.dataDPU)
            }
      }, [props.value])

      const COLOR_PLATE_10 = [
            '#5B8FF9',
            '#5AD8A6',
            '#5D7092',
            '#F6BD16',
            '#E8684A',
            '#6DC8EC',
            '#9270CA',
            '#FF9D4D',
            '#269A99',
            '#FF99C3',
      ];

      const COLOR_COLOR = {
            '25D1': '#f2faf4',
            '46V': '#d60d0d',
            '42M': '#2c2b63',
            '41W': '#202021',
            '47S': '#979985',
            '46G': '#40434a',
            '47C': '#4054db'
      }
      const getDataDPU = (data, targetDPU) => {
            let mazda = []
            let peugeot = []
            let target = []
            let numDays = new Date().getDate()
            for (let i = 1; i <= numDays; i++) {
                  let dataMazda = data.filter(val => val.TYPE === 'MAZDA' && new Date(val.PASS_DATETIME).getDate() === i)
                  if (dataMazda.length > 0) {
                        let amount = parseInt((dataMazda.reduce((total, nexval) => total + parseInt(nexval.error_type_count), 0) / dataMazda.length).toFixed(2))
                        mazda.push({
                              date: `${i}`,
                              type: 'MAZDA',
                              amount: amount,
                        })
                  }
                  else {
                        mazda.push({
                              date: `${i}`,
                              type: 'MAZDA',
                              amount: 0,
                        })
                  }
                  let dataPeugeot = data.filter(val => val.TYPE === 'PEUGEOT' && new Date(val.PASS_DATETIME).getDate() === i)
                  if (dataPeugeot.length > 0) {
                        let amount = parseInt((dataPeugeot.reduce((total, nexval) => total + parseInt(nexval.error_type_count), 0) / dataPeugeot.length).toFixed(2))
                        mazda.push({
                              date: `${i}`,
                              type: 'PEUGEOT',
                              amount: amount,
                        })
                  }
                  else {
                        mazda.push({
                              date: `${i}`,
                              type: 'PEUGEOT',
                              amount: 0,
                        })
                  }
                  target.push({
                        date: `${i}`,
                        type: 'TARGET',
                        amount: targetDPU,
                  })
            }
            setChartData(mazda.concat(peugeot.concat(target)))
      }
      const getDataColor = (data) => {
            const colorLib = [...new Set(data.filter(val => val.COLOR !== "").map(val => val.COLOR.trim()))]
            let colorData = []
            let amountColor = 0;
            colorLib.map((val, ind) => {
                  amountColor = data.filter((value) => value.COLOR === val).length
                  colorData.push({
                        name: val,
                        amount: amountColor
                  })
            })
            setColorData(colorData)
      }
      const getDataColorRatio = (data) => {
            const colorLib = [...new Set(data.filter(val => val.COLOR !== "").map(val => val.COLOR.trim()))]
            let colorData = []
            let amountColor = 0;
            let amountErrorDirt = 0
            let numDays = new Date().getDate()

            for (let i = 1; i <= numDays; i++) {
                  colorLib.map((val, ind) => {

                        amountColor = data.filter(value => value.COLOR === val && new Date(value.PASS_DATETIME).getDate() === i).length
                        amountErrorDirt = data.filter((value) => value.COLOR === val && new Date(value.PASS_DATETIME).getDate() === i).reduce((total, nextval) => total + parseInt(nextval.error_type_count), 0)
                        // console.log(amountColor)
                        //      console.log(amountErrorDirt)

                        let ratio = () => {
                              if (amountColor > 0)
                                    return parseInt(amountErrorDirt / amountColor).toFixed(0)
                              else return 0
                        }
                        colorData.push({
                              name: `${val}`,
                              amount: parseInt(amountErrorDirt / amountColor),
                              date: `${i}`
                        })
                        return val
                  })
            }
            console.log(colorData)
            setColorDataRatio(colorData)
      }
      const configColor = {
            appendPadding: 10,
            data: colorData,
            angleField: 'amount',
            colorField: 'name',
            radius: 1,
            innerRadius: 0.6,
            label: {
                  type: 'inner',
                  offset: '-50%',
                  content: '{value}',
                  style: {
                        textAlign: 'center',
                        fontSize: 14,
                        fontWeight: 'bold',
                 },
                  layout: [
                        // // 柱形图数据标签位置自动调整
                        // {
                        //       type: 'interval-adjust-position',
                        // }, // 数据标签防遮挡
                        // {
                        //       type: 'interval-hide-overlap',
                        // }, // 数据标签文颜色自动调整
                        {
                              type: 'adjust-color',
                        },
                  ],

            },
            color: val => COLOR_COLOR[`${val.name}`],
            interactions: [
                  {
                        type: 'element-selected',
                  },
                  {
                        type: 'element-active',
                  },
            ],
            legend: {
                  itemName: {
                        style: {
                              fontSize: 15,
                              fill:'white'
                        },
                  },
               
                  
            },
            statistic: {
                  title: false,
                  position:'center',
                  content: {
                        style: {
                              whiteSpace: 'pre-wrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              fontSize: 15,
                              color:'white'
                        },
                        content: 'Amount\nColor',
                  },
            },
      };
      ///config chart Line with dpu chart main
      const configChartMain = {
            data: chartData,
            xField: 'date',
            yField: 'amount',
            seriesField: 'type',
            yAxis: {
                  label: {
                        formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),

                  },
            },
            color: COLOR_PLATE_10,
            point: {
                  size: 10,
                  shape: ({ type }) => {
                        return type === 'MAZDA' ? 'square' : 'circle';
                  },
                  style: ({ date }) => {
                        return {
                              r: Number(date) % 4 ? 0 : 3, // 4 个数据示一个点标记
                        };
                  },
            },
            label: {
                  layout: [
                        {
                              type: 'hide-overlap',
                        },
                  ],
                  // 隐藏重叠label
                  style: {
                        textAlign: 'left',
                        fontSize: 15
                  },
                  formatter: (item) => item.amount,
            },
      }

      const configColorRatio = {
            data: colorDataRatio,
            isStack: true,
            xField: 'date',
            yField: 'amount',
            seriesField: 'name',
            
            xAxis: {
                  title: {
                        text: 'DIRT RATE TO EACH COLOR',
                        style: {
                              fontSize: 16,
                              fontWeight: 'bold'
                        },
                  },
            },
            label: {
                  // 可手动配置 label 数据标签位置
                  position: 'middle',
                  // 'top', 'bottom', 'middle'
                  // 可配置附加的布局方法
                  layout: [
                        // 柱形图数据标签位置自动调整
                        {
                              type: 'interval-adjust-position',
                        }, // 数据标签防遮挡
                        {
                              type: 'interval-hide-overlap',
                        }, // 数据标签文颜色自动调整
                        {
                              type: 'adjust-color',
                        },
                  ],
            },
      };

      return (
            <div className="child-board dpu">
                  <div className='titleChartDPU'>DPU</div>
                  <div className='dpu-chart-main'>
                        <div className='titleDPUChart'>DPU CHART</div>
                        <Line {...configChartMain} className='chart-dpu' />
                  </div>
                  <div className='dpu-chart-color'>
                        <div className='dpu-chart-mount-color'>
                              <Pie {...configColor} className='chart-color'>
                              </Pie>
                        </div>
                        <div className='dpu-chart-ratio-color'>
                              {/* <div className='title-color-ratio'>COLOR RATIO</div> */}
                              <Column {...configColorRatio} className='chart-color-ratio' />
                        </div>
                  </div>
            </div>
      )
}
export default ChartDPU
