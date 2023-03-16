import React, { useEffect, useRef, useState } from "react"
import axios from "axios";
import '../styles/Dashboard.css'
import sockettIOClient from "socket.io-client";
import { FloatButton, Drawer, Divider, Form, Button, Input, notification,InputNumber } from 'antd';
import { SettingOutlined } from '@ant-design/icons'
import { Liquid } from '@ant-design/plots';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import VideoStableIcon from '@mui/icons-material/VideoStable';
import OpacityIcon from '@mui/icons-material/Opacity';
import DoneAllIcon from '@mui/icons-material/DoneAll';

function Dashboard() {
      const [dataLineProduct, setDataLineProduct] = useState([])
      const [objectSocket, setObjectSocket] = useState([]);
      const socketRef = React.useRef();
      const host = "http://113.174.246.52:7798"
      const [openDraw, setOpenDraw] = useState(false)
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
            getData()
            getObjectSocket()
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
                        console.log(val.name)
                        if (val.name == "inPTED" || val.name == "amountPTED" || val.name === 'amountPaint' || val.name === 'amountPBS') {
                              getData();
                              console.log(val.name)
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
      //xử lý dữ liệu từ server
      const getData = () => {
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
                        setDataTarget(
                              {
                                    pted: 100,
                                    pvc: 100,
                                    paint: 100,
                                    pbs: 100
                              }
                        )
                        // let data = res.data.map((val,index)=>{
                        console.log(newArray)
                        // })
                  })
                  .catch(error=>{
                        openNotificationWithIcon('warning', error.toJSON().message)
                        console.log(error.toJSON().message)
                  })
      }

      ///// Cấu hình biểu đồ
      const configPTED = {
            percent: (dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 20).COUNT : 0) / dataTarget.pted,
            outline: {
                  border: 4,
                  distance: 8,
                  style: {
                        stroke: 'blue',
                        strokeOpacity: 0.65,
                  },
            },
            theme: {
                  styleSheet: {
                        brandColor: 'blue',
                  },
            },
            wave: {
                  length: 128,
            },
      };
      const configPVC = {
            percent: (dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 50).COUNT : 0) / dataTarget.pvc,
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
            percent: (dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 60).COUNT : 0) / dataTarget.paint,
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
            percent: (dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 90).COUNT : 0) / dataTarget.pbs,

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
                  })
                  .catch(error=>{
                        openNotificationWithIcon('warning', error.toJSON().message)
                        console.log(error.toJSON().message)
                  })
            } catch (error) {

              openNotificationWithIcon('error', error.toJSON().message)
                  // console.log(error)
            }
         

      };
      const onFinishFailed = (errorInfo) => {
            console.log('Failed:', errorInfo);
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
                                                {`TARGET: ${dataTarget.pted}  -  ACTUAL: ${dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 20).COUNT : 0}`}
                                          </div>
                                          <div className="chartProductionDashboard" style={{ color: 'white' }}>
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
                                    <div className="col target" pvc>
                                          <div className="title title-column"><VideoStableIcon style={{ marginRight: 10 }} />PVC</div>
                                          <div className="data-product">
                                                {`TARGET: ${dataTarget.pvc}  -  ACTUAL: ${dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 50).COUNT : 0}`}
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
                                                {`TARGET: ${dataTarget.paint}  -  ACTUAL: ${dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 60).COUNT : 0}`}
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
                                                {`TARGET: ${dataTarget.pbs}  -  ACTUAL: ${dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 90).COUNT : 0}`}
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
                  <Drawer title="Cấu hình thông tin hiển thị" placement="right" onClose={() => setOpenDraw(false)} open={openDraw} width={400} className="drawer">
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
                                          <InputNumber style={{ width: 100 }}  type/>
                                    </Form.Item>

                              </Form>
                        </div>

                  </Drawer>
            </div>
      )
}

export default Dashboard
