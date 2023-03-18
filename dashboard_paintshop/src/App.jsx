import "./App.css";
import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "antd";
import "antd/dist/reset.css";
import Chart from "./components/chart.jsx";
import axios from "axios";
import sockettIOClient from "socket.io-client";
import ChartColumn from "./components/ChartColumn.jsx";

function App() {

      ///ẩn hiện các biểu đồ  --- trạng thái
      const [change, setChange] = useState(false)
      const [dataWBS, setDataWBS] = useState([]);
      const [dataDPU, setDataDPU] = useState([]);
      const [dataPBS, setDataPBS] = useState([]);
      const [objectSocket, setObjectSocket] = useState([]);
      const host = "http://113.174.246.52:7798";
      const socketRef = React.useRef();
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
      var  numDays = parseInt(
            new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
      )
numDays=parseInt(new Date().getDate())
console.log(numDays)

      ////useState cập nhật chiều rộng của cửa sổ     
      //
      //const [windowWidth, setWindowWidth] = useState(window.innerWidth);

      ///// kiểm tra thay đổi chiều rộng của cửa sổ
      // useEffect(() => {
      //       function handleResize() {
      //             setWindowWidth(window.innerWidth);
      //       }
      //       window.addEventListener("resize", handleResize);
      //       return () => window.removeEventListener("resize", handleResize);
      // }, []);
      // useEffect(() => {
      //       getObjectSocket();
      //       //connect socket
      //       getData();
      // }, []);

      ////set ẩn hiện các biểu đồ

      useEffect(() => {
            // Chuyển đổi trạng thái hiển thị của các div sau 5 giây
            const timer = setTimeout(() => {
                  setChange((prev) => !prev);
            }, 10000);

            // Xóa bộ đếm khi component bị unmount hoặc trạng thái thay đổi
            return () => clearTimeout(timer);
      }, [change])

      useEffect(() => {
            socketRef.current = sockettIOClient.connect(host);
            // socketRef.current.on("connect", () => {});
            socketRef.current.on("connect", () => {
                  console.log("connect", socketRef.current.connected);
                  // automatically join the room
                  socketRef.current.emit("joined");
                  getData();
            });
            objectSocket.map((val) => {
                  socketRef.current.on(val.name, (dataGot) => {
                        if (val.name === "amountWBS" || val.name === "amountPBS") getData();
                        setShowAmount((showAmount) => ({
                              ...showAmount,
                              [val.name]: dataGot,
                        }));
                  });
            });
      }, [objectSocket]);
      // const countSumDataArray =async(array,coulumn)=>{
      //     var result
      //     for(let i = 0;i<array.length;i++){
      //         array[i][column]
      //     }
      // }
      const getData = async () => {
            setDataWBS([]);
            setDataPBS([]);
            setDataDPU([]);
        axios
                  .post("http://113.174.246.52:7798/api/returnDataChart")
                  .then(async (res) => {
                        var rawData = res.data;
                        for (let i = 1; i <= numDays; i++) {
                              let valueWBS = await getvalue(rawData, i, "amountWBS");

                              setDataWBS((dataWBS) => [
                                    ...dataWBS,
                                    {
                                          year: `${i}`,
                                          value: valueWBS.length === 0 ? 0 : valueWBS.amount,
                                          category: "Số lượng BODY",
                                    },
                              ]);
                              let valuePBS = await getvalue(rawData, i, "amountPBS");
                              setDataPBS((dataPBS) => [
                                    ...dataPBS,
                                    {
                                          year: `${i}`,
                                          value: valuePBS.length === 0 ? 0 : valuePBS.amount,
                                          category: "Số lượng BODY",
                                    },
                              ]);

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
                        Object.keys(rawData).map((val, index) => {
                              if (rawData[val].timeStamp.substring(0, 2) === new Date().getDate()) {
                                    setShowAmount((showAmount) => ({
                                          ...showAmount,
                                          [rawData[val].name]: rawData[val].amount,
                                    }));
                              }
                              return val
                        });
                  });
      };
      // dataWBS&&console.log(dataWBS)
      const getvalue = async (array, i, position) => {
            var value = [];
            Object.keys(array).map((val) => {
                  if (
                        parseInt(array[val].timeStamp.substring(0, 2)) === i &&
                        array[val].name === position
                  ) {
                        value = array[val];
                     
                  }
                  return val
            });

            return value;
      };
      // const getObjectSocket = () => {
      //       axios
      //             .post("http://113.174.246.52:7798/api/returnObjectSocket")
      //             .then((res) => {
      //                   setObjectSocket(res.data);
      //             });
      // };
      return (
            <div className="App">
                  <Row className="row">
                        <Col className="column" style={{ padding: 5 }}>
                              <Col className="Red">
                                    <div className="cards">
                                          <div className="site-card-border-less-wrapper card">
                                                <Card
                                                      title="CHUYỀN WBS"
                                                      bordered={true}
                                                      style={{
                                                            backgroundColor: "#f0e68c",
                                                      }}
                                                      className="detailCard"
                                                >
                                                      <p>
                                                            Tổng Body vào chuyền WBS:
                                                            <span className="result"> {showAmount.inWBS}</span>{" "}
                                                      </p>
                                                      <p>
                                                            Tổng Body ra chuyền WBS:{" "}
                                                            <span className="result"> {showAmount.outWBS}</span>
                                                      </p>
                                                      <p>
                                                            Tổng Body trên chuyền WBS:{" "}
                                                            <span className="result"> {showAmount.amountWBS}</span>
                                                      </p>
                                                      <p>
                                                            Tổng vị trí trống trên chuyền WBS:
                                                            <span className="result"> {showAmount.emptyWBS}</span>
                                                      </p>
                                                </Card>
                                          </div>
                                          <div className="site-card-border-less-wrapper card">
                                                <Card
                                                      title="CHUYỀN PT/ED"
                                                      bordered={true}
                                                      style={{
                                                            backgroundColor: "#f0e68c",
                                                      }}
                                                      className="detailCard"
                                                >
                                                      <p>
                                                            Tổng Body vào chuyền PT/ED:
                                                            <span className="result"> {showAmount.inPTED}</span>
                                                      </p>
                                                      <p>
                                                            Tổng Body trong chuyền PT/ED:
                                                            <span className="result"> {showAmount.amountPTED}</span>
                                                      </p>
                                                      <p>
                                                            Tổng Body Buffer ED Oven:
                                                            <span className="result"> {showAmount.bufferEDOVEN}</span>
                                                      </p>
                                                      <p>
                                                            Tổng Buffer trống ED Oven:
                                                            <span className="result">
                                                                  {showAmount.emptyBufferEDOVEN}
                                                            </span>
                                                      </p>
                                                </Card>
                                          </div>
                                          <div className="site-card-border-less-wrapper card">
                                                <Card
                                                      title="CHUYỀN PVC & SƠN MÀU"
                                                      bordered={true}
                                                      className="detailCard"
                                                      style={{
                                                            backgroundColor: "#f0e68c",
                                                      }}
                                                >
                                                      <p>
                                                            Tổng Body qua chuyền PVC:{" "}
                                                            <span className="result"> {showAmount.passPVC} </span>
                                                      </p>
                                                      {/* <p>
                                                            Tổng xe sơn lại trong Ngày:
                                                            <span className="result"> {showAmount.recoat}</span>
                                                      </p> */}
                                                      <p>
                                                            Tổng xe sơn lại trong Tháng:
                                                            <span className="result"> {showAmount.totalRecoat}</span>
                                                      </p>
                                                      <p>
                                                            Tổng xe tại chuyền sơn màu:{" "}
                                                            <span className="result"> {showAmount.amountPaint}</span>
                                                      </p>
                                                      <p>
                                                            Tổng xe lỗi:{" "}
                                                            <span className="result"> {showAmount.CarError}</span>
                                                      </p>
                                                      <p>
                                                            Tổng xe không lỗi:{" "}
                                                            <span className="result"> {showAmount.CarGood}</span>
                                                      </p>
                                                </Card>
                                          </div>
                                          <div className="site-card-border-less-wrapper card">
                                                <Card
                                                      title="CHUYỀN PBS"
                                                      bordered={true}
                                                      className="detailCard"
                                                      style={{
                                                            backgroundColor: "#f0e68c",
                                                            width: "100%",
                                                      }}
                                                >
                                                      <p>
                                                            Tổng Body vào line PBS:
                                                            <span className="result"> {showAmount.inPBS}</span>
                                                      </p>
                                                      <p>
                                                            Tổng Body ra line PBS:
                                                            <span className="result"> {showAmount.outPBS}</span>
                                                      </p>
                                                      <p>
                                                            Tổng Body màu cấp về Luxury:
                                                            <span className="result"> {showAmount.toLuxury}</span>
                                                      </p>
                                                      <p>
                                                            Tổng Body trên chuyền PBS:{" "}
                                                            <span className="result"> {showAmount.amountPBS}</span>
                                                      </p>
                                                </Card>
                                          </div>
                                    </div>
                              </Col>
                        </Col>
                  </Row>
                  {
                        change ? (<Row className="row1" style={{ display: change === true ? 'inline-block' : 'none' }}>
                              <Col className="column" style={{ padding: 5 }}>
                                    <Col className="Green">
                                          <Row
                                          className="chartAntd"
                                                // style={{ width: "100%", height: "100%", position: "relative" }}
                                          >
                                                <Col
                                                className="chart"
                                                      
                                                >
                                                      <div className="titleChart">
                                                            <h3 className="nameTittle">SỐ LƯỢNG BODY CHUYỀN WBS</h3>
                                                      </div>
                                                      <Chart values={dataWBS} type={"wbs"} />
                                                </Col>

                                                <Col
                                                   className="chart"
                                                     
                                                >
                                                      <div className="titleChart">
                                                            <h3 className="nameTittle">SỐ LƯỢNG BODY CHUYỀN PBS</h3>
                                                      </div>
                                                      <Chart values={dataPBS} type={"pbs"} />
                                                </Col>
                                          </Row>
                                    </Col>
                              </Col>
                        </Row>) : (<Row className="row2" style={{ display: change === false ? 'inline-block' : 'none' }}>
                              <Col className="column" style={{ padding: 5 }}>
                                    <Col className="Green">
                                          <Row
                                                className="chartAntd"
                                                style={{ width: "100%", height: "100%", position: "relative" }}
                                          >
                                                <Col
                                                      className="chartDPU"
                                                >
                                                      <div className="titleChart">
                                                            <h3 className="nameTittle">BIỂU ĐỒ DPU-FTT</h3>
                                                      </div>
                                                      <ChartColumn value={dataDPU} />
                                                </Col>

                                                {/* <Col
                                                      className="chart"
                                                >
                                                      <div className="titleChart">
                                                            <h3 className="nameTittle">BIỂU ĐỒ FTT</h3>
                                                      </div>
                                                      <Chart values={dataPBS} type={"pbs"} />
                                                </Col> */}
                                          </Row>
                                    </Col>
                              </Col>
                        </Row>
                        )
                  }


            </div>
      );
}

export default App;
