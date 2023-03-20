import React, { useEffect, useState } from 'react'
import '../styles/Dpu.css'
import { Line } from '@ant-design/plots';
import { ContactSupportOutlined } from '@mui/icons-material';
function ChartDPU(props) {
      // console.log(props.value)
      const [dataTarget, setDataTarget] = useState([])
      const [dataDPU, setDataDPU] = useState([])
      const [chartData, setChartData] = useState([])
      // const [dataChart,setDataChart]=useState([])
      useEffect(() => {
            if (props.value.dataDPU.length > 0) {
                
                  getData(props.value.dataDPU)
                  setDataDPU(props.value.dataDPU)
                  setDataTarget(props.value.dataTarget)

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

     const getData =(data)=>{
      let mazda=[]
         let va=   data.filter(val=>val.TYPE==='MAZDA'&&new Date(val.PASS_DATETIME).getDate()==='3')
            console.log(va)
     }
      ///config chart Line with dpu chart main
      const configChartMain = {
            data: chartData,
            xField: 'date',
            yField: 'totalRatio',
            seriesField: 'TYPE',
            yAxis: {
                  label: {
                        formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
                  },
            },
            color: COLOR_PLATE_10,
            point: {
                  shape: ({ category }) => {
                        return category === 'MAZDA' ? 'square' : 'circle';
                  },
                  style: ({ year }) => {
                        return {
                              r: Number(year) % 4 ? 0 : 3, // 4 个数据示一个点标记
                        };
                  },
            },
      }
      return (
            <div className="child-board dpu">
                  <div className='dpu-chart-main'>
                        {chartData.length > 0 ? <Line {...configChartMain} className='chart-dpu' /> : ''}

                  </div>
                  <div className='dpu-chart-color'>
                        <div className='dpu-chart-mount-color'>
                              sdq
                        </div>
                        <div className='dpu-chart-ratio-color'>
                              dsqdsqd
                        </div>
                  </div>
            </div>
      )
}
export default ChartDPU
