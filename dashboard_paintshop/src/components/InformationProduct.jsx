import React, { useEffect, useState } from "react"
import { Liquid } from '@ant-design/plots';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import VideoStableIcon from '@mui/icons-material/VideoStable';
import OpacityIcon from '@mui/icons-material/Opacity';
import DoneAllIcon from '@mui/icons-material/DoneAll';

function InformationProduct(props) {
   
      const [dataTarget, setDataTarget]=useState([])
      const [dataLineProduct,setDataLineProduct]=useState([])
      
       useEffect(()=>{
            setDataLineProduct(props.value.dataLineProduct)
            setDataTarget(props.value.dataTarget)
       },[props.value])

      /// return value of each Line 
      const returnValue = (line) => {
            let result = 0
                  if(dataLineProduct.length > 0){
                        let result = dataLineProduct.find(item => item.PROCESS_NO === line) !== undefined ? dataLineProduct.find(item => item.PROCESS_NO === line).COUNT : 0
                        return result
                  }
            else
                  return result
      }
            ///// Cấu hình biểu đồ
            const configPTED = {
                  percent: returnValue(20) / dataTarget.targetPTED,
                  outline: {
                        border: 4,
                        distance: 8,
                        style: {
                              stroke: '#76b583',
                              strokeOpacity: 0.65,
                        },
                  },
                  theme: {
                        styleSheet: {
                              brandColor: '#76b583',
                        },
                  },
                  wave: {
                        length: 128,
                  },
            };
            const configPVC = {
                  percent: returnValue(50) / dataTarget.targetPVC,
                  outline: {
                        border: 4,
                        distance: 8,
                        style: {
                              stroke: '#cdc77d',
                              strokeOpacity: 0.65,
                        },
                  },
                  theme: {
                        styleSheet: {
                              brandColor: '#cdc77d',
                        },
                  },
                  wave: {
                        length: 128,
                  },
            };
            const configPAINT = {
                  percent: returnValue(60) / dataTarget.targetPAINT,
                  //  shape: 'rect',
                  outline: {
                        border: 4,
                        distance: 8,
                        style: {
                              stroke: '#eb1e5d',
                              strokeOpacity: 0.65,
                        },
                  },
                  theme: {
                        styleSheet: {
                              brandColor: '#eb1e5d',
                        },
                  },
                  wave: {
                        length: 128,
                  },
      
            };
            const configPBS = {
                  percent: returnValue(90) / dataTarget.targetPBS,
                  outline: {
                        border: 4,
                        distance: 8,
                        style: {
                              stroke: '#FAAD14',
                              strokeOpacity: 0.65,
                        },
                  },
                  theme: {
                        styleSheet: {
                              brandColor: '#FAAD14',
                        },
                  },
                  wave: {
                        length: 128,
                  },
      
            };
      return (
            <div className="child-board quantity">
                  <div className="titleBoard">PRODUCTION INFORMATION BOARD</div>
                  <div className="content">
                        <div className="col name pted">
                              <div className="title title-column"><BookmarkBorderIcon style={{ marginRight: 10 }} /> PT/ED</div>
                              <div className="data-product">
                                    {`TARGET: ${dataTarget.targetPTED}  -  ACTUAL: ${returnValue(20)}`}
                              </div>
                              <div className="chartProductionDashboard" >
                                    <Liquid
                                          {...configPTED}
                                          statistic={{
                                                content: {
                                                      formatter({ percent }) {
                                                            return Math.round(percent * 100) + "%";
                                                      },
                                                },
                                          }} />
                              </div>
                        </div>
                        <div className="col target pvc">
                              <div className="title title-column"><VideoStableIcon style={{ marginRight: 10 }} />PVC</div>
                              <div className="data-product">
                                    {`TARGET: ${dataTarget.targetPVC}  -  ACTUAL: ${returnValue(50)}`}
                              </div>
                              <div className="chartProductionDashboard"  >
                                    <Liquid
                                          {...configPVC}
                                          statistic={{
                                                content: {
                                                      formatter({ percent }) {
                                                            return Math.round(percent * 100) + "%";
                                                      },
                                                },

                                          }}
                                    />
                              </div>
                        </div>
                        <div className="col actual paint">
                              <div className="title title-column"><OpacityIcon style={{ marginRight: 10 }} />PAINT</div>
                              <div className="data-product">
                                    {`TARGET: ${dataTarget.targetPAINT}  -  ACTUAL: ${returnValue(60)}`}
                              </div>
                              <div className="chartProductionDashboard">
                                    <Liquid {...configPAINT} statistic={{
                                          content: {
                                                formatter({ percent }) {
                                                      return Math.round(percent * 100) + "%";
                                                },
                                          },
                                    }} />
                              </div>
                        </div>
                        <div className="col actual pbs">
                              <div className="title title-column"><DoneAllIcon style={{ marginRight: 10 }} />IN PBS</div>
                              <div className="data-product">
                                    {`TARGET: ${dataTarget.targetPBS}  -  ACTUAL: ${returnValue(90)}`}
                              </div>
                              <div className="chartProductionDashboard">
                                    <Liquid {...configPBS} statistic={{
                                          content: {
                                                formatter({ percent }) {
                                                      return Math.round(percent * 100) + "%";
                                                },
                                          },
                                    }} />
                              </div>
                        </div>
                  </div>

            </div>
      )
}

export default InformationProduct