import React, { useEffect, useRef, useState } from "react"
import axios from "axios";
import '../styles/Dashboard.css'
import sockettIOClient from "socket.io-client";
import { FloatButton, Drawer, Divider, Form, Button, Input, notification, InputNumber } from 'antd';
import { SettingOutlined } from '@ant-design/icons'
import { Liquid } from '@ant-design/plots';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import VideoStableIcon from '@mui/icons-material/VideoStable';
import OpacityIcon from '@mui/icons-material/Opacity';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { valueToPercent } from "@mui/base";

function Dashboard() {
      const [dataLineProduct, setDataLineProduct] = useState([])
      const [dataDPU,setDataDPU]=useState([])
      const [dataFTT,setDataFTT]=useState([])
      const [objectSocket, setObjectSocket] = useState([]);
      const socketRef = React.useRef();
      const host = "http://113.174.246.52:7798"
      const [openDraw, setOpenDraw] = useState(false)
      const  [form] =Form.useForm()
      /// set type notification antd
      const [api, contextHolder] = notification.useNotification();
      // set ref for button out side form antd
      const formRef = useRef()
      const [dataTarget, setDataTarget] = useState({
            pted: 0,
            pvc: 0,
            paint: 0,
            pbs: 0
      })
      const [showAmount, setShowAmount] = useState({
            inWBS: 0,
            outWBS: 0,
            amountWBS: 0,
            emptyWBS: 0,
            inPTED: 0,
            amountPTED: 0,
            bufferEDOVEN: 0,
            EmptyBufferEDOVEN: 0,
            passPVC: 0,
            recoat: 0,
            amountPaint: 0,
            inPBS: 0,
            outPBS: 0,
            backLuxury: 0,
            amountPBS: 0,
            totalRecoat: 0,
            CarError: 0,
            CarGood: 0,
      });


      //notification antd  with type: success, info, warning, error
      const openNotificationWithIcon = (type, content) => {
            api[type]({
                  message: 'Notification ',
                  description:
                        content,
                  duration: 0,
            });
      };


      useEffect(() => {
            Promise.all([
                  getData(),
                  getObjectSocket(),
                  getDataDPUFTT()
                ])
                  .then(() => {
                 
                    // Tất cả các hàm đã thực thi xong
                    // Cập nhật state hoặc thực hiện các thao tác cần thiết ở đây
                  })
                  .catch((error) => {
                    console.log(error);
                  });
      }, [])
      //get Info from server by socket
      useEffect(() => {
            socketRef.current = sockettIOClient.connect(host);
            // socketRef.current.on("connect", () => {});
            socketRef.current.on("connect", () => {
                  console.log("connect", socketRef.current.connected);
                  //   // automatically join the room
                  //   socketRef.current.emit("joined");

            });
            objectSocket.map((val) => {
                  socketRef.current.on(val.name, (dataGot) => {
                        if (val.name == "inPTED" || val.name == "amountPTED" || val.name === 'amountPaint' || val.name === 'amountPBS') {
                              getData();
                        }
                        setShowAmount((showAmount) => ({
                              ...showAmount,
                              [val.name]: dataGot,
                        }));
                  });
            });
      }, [objectSocket]);

      const getObjectSocket = () => {
            axios
                  .post("http://113.174.246.52:7798/api/returnObjectSocket")
                  .then((res) => {
                        setObjectSocket(res.data);
                  });
      };

      React.useEffect(() => {
            if (dataTarget.length !== 0) {
                  let objectValue = {
                      targetPTED:dataTarget.targetPTED,
                      targetPVC:dataTarget.targetPVC,
                      targetPAINT:dataTarget.targetPAINT,
                      targetPBS:dataTarget.targetPBS
                  }
                  form.setFieldsValue(objectValue);
            }
      }, [dataTarget]);

      //xử lý dữ liệu từ server
      const getData = async () => {
            /// get Production form each Line in RFID Paint Shop
            const getTimeNow = new Date()
            axios.post(`${host}/api/returnLineProduct`, { getTimeNow })
                  .then(res => {

                        let newArray = res.data.reduce((acc, curr) => {
                              let found = acc.find(item => item.PROCESS_NO === curr.PROCESS_NO);
                              if (found) {
                                    found.COUNT++;
                              } else {
                                    acc.push({ PROCESS_NO: curr.PROCESS_NO, COUNT: 1 });
                              }
                              return acc;
                        }, []);
                        setDataLineProduct(newArray)
                        getDataTargetProduction()
                  })
                  .catch(error => {
                        openNotificationWithIcon('warning', error.toJSON().message)
                        
                  })
      }

      const getDataDPUFTT = async () => {
            let numDays=parseInt(new Date().getDate())
        axios
                  .post("http://113.174.246.52:7798/api/returnDataChart")
                  .then(async (res) => {
                        var rawData = res.data;
                        for (let i = 1; i <= numDays; i++) {
                              let valueError = await getvalue(rawData, i, "CarError");
                              setDataDPU((dataDPU) => [
                                    ...dataDPU,
                                    {
                                          year: `${i}`,
                                          value: valueError.length === 0 ? 0 : valueError.amount,
                                          type: "Số lượng BODY lỗi",
                                    },
                              ]);
                              let valueGood = await getvalue(rawData, i, "CarGood");
                              setDataDPU((dataDPU) => [
                                    ...dataDPU,
                                    {
                                          year: `${i}`,
                                          value: valueGood.length === 0 ? 0 : valueGood.amount,
                                          type: "Số lượng BODY KHÔNG lỗi",
                                    },
                              ]);
                        }
                  });
      };
      
      const getvalue = async (array, day, position) => {
            let value = [];
            for (const val of Object.values(array)) {
              if (parseInt(val.timeStamp.substring(0, 2)) === day && val.name === position) {
                value = val;
                break;
              }
            }
            return value;
          };
      /// return value of target production
      const getDataTargetProduction = async () => {
            axios.post(`${host}/api/getDataTargetProduction`)
                  .then(res => {
                        if (res.data !== 'null') {

                              const result = res.data.reduce((acc, curr) => {
                                    acc[curr.name] = curr.amount;
                                    return acc;
                              }, {});
                              setDataTarget(result)
                        }

                  })
      }



      /// return value of each Line 
      const returnValue = (line) => {
            let result = 0
            if (dataLineProduct.length > 0) {
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

      /// function Form antd
      const onFinish = (values) => {
            try {
                  axios.post(`${host}/api/saveTargetValue`, { values })
                        .then(res => {
                              if (res.data === 'ok')
                                    openNotificationWithIcon('success', 'Save data successfully')
                              else openNotificationWithIcon('error', 'Data save failed')
                              getData()
                        })
                        .catch(error => {
                              openNotificationWithIcon('warning', error.toJSON().message)
                       
                        })
            } catch (error) {

                  openNotificationWithIcon('error', error.toJSON().message)
            
            }

      };
      const onFinishFailed = (errorInfo) => {
       
      };
      const handleSubmit = () => {
            formRef.current.submit();
      }
      return (
            <div className="container">
                  {contextHolder}
                  <div className="board">
                        <div className="child-board dpu">

                        </div>
                  </div>
                  <div className="board">
                        <div className="child-board ftt">

                        </div>
                  </div>
                  <div className="board">
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

                                          {/* <div className="title">PT/ED</div>
                            <div className="title">PVC</div>
                            <div className="title">SƠN MÀU</div>
                            <div className="title">PBS</div> */}

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
                                          {/* <div className="title number">{dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 20).COUNT : 0}</div>
                            <div className="title number">{dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 50).COUNT : 0}</div>
                            <div className="title number">{dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 60).COUNT : 0}</div>
                            <div className="title number">{dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 90).COUNT : 0}</div> */}

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
                  </div>
                  <div className="board ">
                        <div className="child-board downtime">

                        </div>
                  </div>
                  <FloatButton icon={<SettingOutlined />} style={{ bottom: 10, right: 10 }} onClick={() => setOpenDraw(true)} />
                  <Drawer title="Configure display information" placement="right" onClose={() => setOpenDraw(false)} open={openDraw} width={400} className="drawer">
                        <div className="submitForm">
                              <Button type="primary" htmlType="submit" htmlFor="config" onClick={handleSubmit}>
                                    Submit
                              </Button>
                        </div>
                        <Divider className="divider" orientation="left">Production Target</Divider>

                        <div className="production">
                              <Form
                                    name="config"
                                    ref={formRef}
                                    id="config"
                                    form={form}
                                    labelCol={{
                                          span: 8,
                                    }}
                                    wrapperCol={{
                                          span: 16,
                                    }}
                                    style={{
                                          maxWidth: 600,

                                    }}
                                    initialValues={{
                                          remember: true,
                                    }}
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                    autoComplete="off"
                              >
                                    <Form.Item
                                          label="Target PT/ED"
                                          name="targetPTED"
                                          defaultValue='2321'
                                          rules={[
                                                {
                                                      required: true,
                                                      message: 'Please! Input number of production target',
                                                },
                                          ]}

                                    >
                                          <InputNumber style={{ width: 100 }} />
                                    </Form.Item>

                                    <Form.Item
                                          label="Target PVC"
                                          name="targetPVC"
                                          rules={[
                                                {
                                                      required: true,
                                                      message: 'Please! Input number of production target',
                                                },
                                          ]}

                                    >
                                          <InputNumber style={{ width: 100 }} />
                                    </Form.Item>
                                    <Form.Item
                                          label="Target PAINT"
                                          name="targetPAINT"
                                          rules={[
                                                {
                                                      required: true,
                                                      message: 'Please! Input number of production target',
                                                },
                                          ]}

                                    >
                                          <InputNumber style={{ width: 100 }} />
                                    </Form.Item>
                                    <Form.Item
                                          label="Target PBS"
                                          name="targetPBS"
                                          rules={[
                                                {
                                                      required: true,
                                                      message: 'Please! Input number of production target',
                                                },
                                          ]}

                                    >
                                          <InputNumber style={{ width: 100 }} type />
                                    </Form.Item>

                              </Form>
                        </div>

                  </Drawer>
            </div>
      )
}

export default Dashboard
