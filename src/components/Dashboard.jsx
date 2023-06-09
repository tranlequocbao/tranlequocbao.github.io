import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../styles/Dashboard.css";
import sockettIOClient from "socket.io-client";
import {
      FloatButton,
      Drawer,
      Divider,
      Form,
      Button,
      notification,
      InputNumber,
} from "antd";
import { SettingOutlined } from "@ant-design/icons";
import ChartDPU from "./ChartDPU";
import InformationProduct from "./InformationProduct";
import TimeDown from "./TimeDown";
import ChartFTT from "./ChartFTT";


function Dashboard() {
      const [dataLineProduct, setDataLineProduct] = useState([]);
      const [dataDPU, setDataDPU] = useState([]);
      const [dataDPUNoDirt, setDataDPUNoDirt] = useState([])
     
      // const [dataFTT, setDataFTT] = useState([])
      const [objectSocket, setObjectSocket] = useState([]);
      const socketRef = React.useRef();
      const host = "http://113.174.246.52:7798";
      const hostMysql = "http://113.174.246.52:3005";
      // const host = "http://10.40.12.4:7798";
      // const hostMysql = "http://10.40.12.4:3005";
      const [openDraw, setOpenDraw] = useState(false);
      const [form] = Form.useForm();
      /// set type notification antd
      const [api, contextHolder] = notification.useNotification();
      // set ref for button out side form antd
      const formRef = useRef();
      const [socketFTT, setSocketFTT] = useState('')
      const [dataTarget, setDataTarget] = useState({
            pted: 0,
            pvc: 0,
            paint: 0,
            pbs: 0,
      });

      //notification antd  with type: success, info, warning, error
      const openNotificationWithIcon = (type, content) => {
            api[type]({
                  message: "Notification ",
                  description: content,
                  duration: 0,
            });
      };

      useEffect(() => {
            getData();
            getObjectSocket();
            getDataDPU();
            // getDataTimDown();
      }, []);
      //get Info from server by socket
      useEffect(() => {
            socketRef.current = sockettIOClient.connect(host);
            // socketRef.current.on("connect", () => {});
            socketRef.current.on("connect", () => {

            });
            objectSocket.map((val) => {
                  socketRef.current.on(val.name, (dataGot) => {
       
                        if (
                              val.name === "inPTED" ||
                              val.name === "amountPTED" ||
                              val.name === "amountPaint" ||
                              val.name === "amountPBS" ||
                              val.name === "targetProduction"
                        ) {
                              if (val.name === "targetProduction") getDataTargetProduction();
                              if (val.name === "amountPBS") getDataDPU();
                              getData();
                        }

                        if (val.name === "timeDownQC1K2" || val.name === "timeDownQC1K1")
                             
                        if (val.name === 'straightaway' || val.name === 'toRepair')
                              setSocketFTT(val.name)
                  });
            });
      }, [objectSocket]);

      const getObjectSocket = () => {
            axios
                  .post(`${host}/api/returnObjectSocket`)
                  .then((res) => {
                        res.data.push({ name: "targetProduction" });
                        setObjectSocket(res.data);
                  });
      };

      React.useEffect(() => {
            if (dataTarget.length !== 0) {
                  let objectValue = {
                        targetPTED: dataTarget.targetPTED,
                        targetPVC: dataTarget.targetPVC,
                        targetPAINT: dataTarget.targetPAINT,
                        targetPBS: dataTarget.targetPBS,
                        targetDPU: dataTarget.targetDPU,
                  };
                  form.setFieldsValue(objectValue);
            }
      }, [dataTarget]);

      const getData = async () => {
            /// get Production form each Line in RFID Paint Shop
            const getTimeNow = new Date();
            axios
                  .post(`${host}/api/returnLineProduct`, { getTimeNow })
                  .then((res) => {
                        let newArray = res.data.reduce((acc, curr) => {
                              let found = acc.find((item) => item.PROCESS_NO === curr.PROCESS_NO);
                              if (found) {
                                    found.COUNT++;
                              } else {
                                    acc.push({ PROCESS_NO: curr.PROCESS_NO, COUNT: 1 });
                              }
                              return acc;
                        }, []);
                        setDataLineProduct(newArray);
                        getDataTargetProduction();
                  })
                  .catch((error) => {
                        openNotificationWithIcon("warning", error.toJSON().message);
                  });
      };

      //chat gpt
      const getDataDPU = async () => {
            try {
                  const time = new Date();
                  const response1 = await axios.post(`${hostMysql}/api/getDataErrorCarv1`);
                  if(response1.data !=='null' && response1.data.length>0)
                  setDataDPU(response1.data);
                  else
                  setDataDPU([])
                  // const data = response1.data;
                  // const response2 = await axios.post(`${hostMysql}/api/getDataErrorCar`, {
                  //       data,

                  // });
                  // const listCarError = response2.data;
                  
                  // const dpuNoDirt = await axios.post(`${hostMysql}/api/getDataErrorNoDirt`, { data })
                  // const listCarErrorNoDirt = dpuNoDirt.data
                  // const newArray = [];
                  // const newArrayNoDirt = []
                  // const vinCodes = [];
                  // const vinCodesNoDirt = []
                  // for (let item of data) {
                  //       if (!vinCodes.includes(item.VIN_CODE)) {
                  //             const errorItem = listCarError.find(
                  //                   (error) => error.error_code === item.VIN_CODE
                  //             );
                  //             if (errorItem) {
                  //                   item.error_type = errorItem.error_type;
                  //                   item.error_type_count = errorItem.error_type_count;
                  //                   newArray.push(item);
                  //                   vinCodes.push(item.VIN_CODE);
                  //             }
                  //       }
                  // }
                  // for (let item of data) {
                  //       if (!vinCodesNoDirt.includes(item.VIN_CODE)) {
                  //             const errorItem = listCarErrorNoDirt.find(
                  //                   (error) => error.error_code === item.VIN_CODE
                  //             );
                  //             if (errorItem) {
                  //                   item.error_type = errorItem.error_type;
                  //                   item.error_type_count = errorItem.error_type_count;
                  //                   newArrayNoDirt.push(item);
                  //                   vinCodesNoDirt.push(item.VIN_CODE);
                  //             }
                  //       }
                  // }
                  // console.log(newArray)
        
                  //setDataDPUNoDirt(newArrayNoDirt)
            } catch (error) {
                   console.log(error)
            }
      };

      /// return value of target production
      const getDataTargetProduction = async () => {
            axios.post(`${host}/api/getDataTargetProduction`).then((res) => {
                  if (res.data !== "null") {
                        const result = res.data.reduce((acc, curr) => {
                              acc[curr.name] = curr.amount;
                              return acc;
                        }, {});
                        setDataTarget(result);
                  }
            });
      };
  
      /// function Form antd
      const onFinish = (values) => {
            try {
                  axios
                        .post(`${host}/api/saveTargetValue`, { values })
                        .then((res) => {
                              if (res.data === "ok")
                                    openNotificationWithIcon("success", "Save data successfully");
                              else openNotificationWithIcon("error", "Data save failed");
                              socketRef.current = sockettIOClient.connect(host);
                              socketRef.current.emit("targetProduction");
                              getData();
                        })
                        .catch((error) => {
                              openNotificationWithIcon("warning", error.toJSON().message);
                        });
            } catch (error) {
                  openNotificationWithIcon("error", error.toJSON().message);
            }
      };
      const onFinishFailed = (errorInfo) => {

      };
      const handleSubmit = () => {
            formRef.current.submit();
      };
      return (
            <div className="container">
                  {contextHolder}
                  <div className="board">
                        <InformationProduct value={{ dataTarget, dataLineProduct }} />
                  </div>
                  <div className="board">
                        <ChartDPU value={{ dataDPU, dataTarget, dataDPUNoDirt }} />
                  </div>
                  <div className="board">
                        <TimeDown  />
                  </div>
                  <div className="board ">
                        <ChartFTT socket={{ socketFTT }} />
                  </div>
                  <FloatButton
                        icon={<SettingOutlined />}
                        style={{ bottom: 10, right: 10 }}
                        onClick={() => setOpenDraw(true)}
                  />
                  <Drawer
                        title="Configure display information"
                        placement="right"
                        onClose={() => setOpenDraw(false)}
                        open={openDraw}
                        width={400}
                        className="drawer"
                  >
                        <div className="submitForm">
                              <Button type="primary" htmlFor="config" onClick={handleSubmit}>
                                    Submit
                              </Button>
                        </div>
                        <Divider className="divider" orientation="left">
                              Production Target
                        </Divider>

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
                                          defaultValue="2321"
                                          rules={[
                                                {
                                                      required: true,
                                                      message: "Please! Input number of production target",
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
                                                      message: "Please! Input number of production target",
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
                                                      message: "Please! Input number of production target",
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
                                                      message: "Please! Input number of production target",
                                                },
                                          ]}
                                    >
                                          <InputNumber style={{ width: 100 }} />
                                    </Form.Item>
                                    <Form.Item
                                          label="Target DPU"
                                          name="targetDPU"
                                          rules={[
                                                {
                                                      required: true,
                                                      message: "Please! Input number of DPU target",
                                                },
                                          ]}
                                    >
                                          <InputNumber style={{ width: 100 }} />
                                    </Form.Item>
                              </Form>
                        </div>
                  </Drawer>
            </div>
      );
}

export default Dashboard;
