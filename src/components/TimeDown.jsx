import React, { useEffect, useState } from 'react'
import { Column } from '@ant-design/plots';
import '../styles/TimeDown.css'
function TimeDown(props) {

    const [data, setData] = useState([])
    useEffect(() => {
        getData(props.value.dataTimeDown)
    }, [props.value])
    const station = {
        'timeDownQC1K1': 'Time Down QC1K 1',
        'timeDownQC1K2': 'Time Down QC1K 2'
    }
    const getData = (data) => {
        let configdata = []
        let numDays = new Date(new Date().getDate(), new Date().getMonth() + 1, 0).getDate()
        for (let i = 1; i <= numDays; i++) {
            let dataDraw = data.filter((val) => val.name.substring(0, 8) === 'timeDown' && new Date(val.timeStamp).getDate() ===i)
            if (dataDraw.length > 0){
                dataDraw.map((value,ind)=>{
                    configdata.push({
                        name: station[value.name],
                        amount: parseInt((value.amount / 60).toFixed(0)),
                        timeStamp: `${i}`
                    })
                })
                
            }
            else{
                configdata.push({
                    name: 'Time Down QC1K 1',
                    amount: 0,
                    timeStamp: `${i}`
                }, {
                    name: 'Time Down QC1K 2',
                    amount: 0,
                    timeStamp: `${i}`
                })
            }
               
        }
        console.log(configdata)
        setData(configdata)
        // if (data.length > 0) {
        //     let configdata = []
        //     data.map((val, ind) => {
        //         configdata.push({
        //             name: station[val.name],
        //             amount: parseInt((val.amount / 60).toFixed(0)),
        //             timeStamp: `${new Date(val.timeStamp).getDate()}/${new Date(val.timeStamp).getMonth() + 1}/${new Date(val.timeStamp).getFullYear()}`
        //         })
        //     })
        //     setData(configdata)
        // }

        // else
        //     setData([{
        //         name: 'Time Down QC1K 1',
        //         amount: 0,
        //         timeStamp: `${new Date()}`
        //     }, {
        //         name: 'Time Down QC1K 2',
        //         amount: 0,
        //         timeStamp: `${new Date()}`
        //     }])
    }
    const config = {
        data,
        xField: 'timeStamp',
        yField: 'amount',
        seriesField: 'name',
        isGroup: true,
        columnStyle: {
            radius: [20, 20, 0, 0],
        },
        label: {
            style: {
                fontSize: 16
            },
            // 可手动配置 label 数据标签位置
            position: 'middle',
            // 'top', 'middle', 'bottom'
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
        <div className="child-board timeDown">
            <div className='titleChartTimeDown'>DPU</div>
            <div className='dpu-timedown'>
                <div className='title-timedown'>TIME DOWN</div>
                <Column {...config} className="chartTimeDown" />
            </div>

        </div>
    )

}

export default TimeDown