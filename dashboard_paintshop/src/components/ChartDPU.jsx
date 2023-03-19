import React, { useEffect, useState } from 'react'

function ChartDPU(props) {
      // console.log(props.value)
  const [dataTarget,setDataTarget]=useState([])
  const [dataDPU, setDataDPU]=useState([])
useEffect(()=>{
      if(props.value){
            console.log(props.value)
            setDataDPU(props.value.dataDPU)
            setDataTarget(props.value.dataTarget)
      }
},[props.value])
      return (
      <div className="child-board ftt">
           CharDPU
      </div>
  )
}
export default ChartDPU
