import React, { useEffect, useState } from 'react'
import '../styles/Dpu.css'
import { Line } from '@ant-design/plots';
function ChartDPU(props) {
      // console.log(props.value)
      const [dataTarget, setDataTarget] = useState([])
      const [dataDPU, setDataDPU] = useState([])
      useEffect(() => {
            if (props.value) {
                  let e= props.value.dataDPU.filter(val=>val.TYPE==='MAZDA')
                  console.log(e)
                  console.log(props.value)
                  setDataDPU(props.value.dataDPU)
                  setDataTarget(props.value.dataTarget)
            }
      }, [props.value])

      const processedData = () => {
            const result = [];
            const counts = {};

            dataDPU.forEach(item => {
                  const { TYPE, error_type_count, PASS_DATETIME} = item;
                  const datetime = new Date(PASS_DATETIME).toISOString().substring(0, 16);

                  if (!counts[datetime]) {
                        counts[datetime] = {};
                  }

                  if (!counts[datetime][TYPE]) {
                        counts[datetime][TYPE] = {
                              count: 0,
                              ratio: 0
                        };
                  }

                  counts[datetime][TYPE].count += 1;
                  counts[datetime][TYPE].ratio = error_type_count / counts[datetime][TYPE].count;
            });

            // Object.keys(counts).forEach(datetime => {
            //       Object.keys(counts[datetime]).forEach(TYPE => {
            //             result.push({
            //                   TYPE,
            //                   ratio: counts[datetime][TYPE].ratio,
            //                   date: datetime
            //             });
            //       });
            // });

            console.log(counts);
      }
      dataDPU.length>0&&processedData()
      ///config chart Line with dpu chart main
      // const configChartMain={
      //       dataDPU,
      //       xField: 'year',
      //       yField: 'value',
      //       seriesField: 'category',
      //       yAxis: {
      //         label: {
      //           // 数值格式化为千分位
      //           formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      //         },
      //       },
      //       color: COLOR_PLATE_10,
      //       point: {
      //         shape: ({ category }) => {
      //           return category === 'Gas fuel' ? 'square' : 'circle';
      //         },
      //         style: ({ year }) => {
      //           return {
      //             r: Number(year) % 4 ? 0 : 3, // 4 个数据示一个点标记
      //           };
      //         },
      //       },
      // }
      return (
            <div className="child-board dpu">
                  <div className='dpu-chart-main'>

                        {/* <Line {...config} /> */}
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
