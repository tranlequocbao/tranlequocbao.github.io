import React, { useEffect, useState } from "react"
import axios from "axios";
import '../styles/Dashboard.css'
import sockettIOClient from "socket.io-client";
import { FloatButton, Drawer, Divider } from 'antd';
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
    const [dataTarget,setDataTarget]=useState({
        pted:0,
        pvc:0,
        paint:0,
        pbs:0
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
                        pted:100,
                        pvc:100,
                        paint:100,
                        pbs:100
                    }
                )
                // let data = res.data.map((val,index)=>{
                console.log(newArray)
                // })
            })
    }
    
    const formatter = (val) => `${new Intl.NumberFormat().format(val * 100)}%`;
    ///// Cấu hình biểu đồ
    const configPTED = {
        percent: (dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 20).COUNT : 0)/dataTarget.pted,
       formatter:(val)=>console.log(val),
        outline: {
          border: 4,
          distance: 8,
        },
        wave: {
          length: 128,
        },
      };
      const configPVC = {
        percent: (dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 50).COUNT : 0)/dataTarget.pvc,
        shape: 'diamond',
        outline: {
          border: 4,
          distance: 8,
        },
        wave: {
          length: 128,
        },
      };
      const configPAINT = {
        percent: (dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 60).COUNT : 0)/dataTarget.paint,
        shape: 'rect',
        outline: {
          border: 4,
          distance: 8,
        },
        wave: {
          length: 128,
        },
        format: (value) => `${(value * 100).toFixed(0)}%`,
      };
      const configPBS = {
        percent: (dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 90).COUNT : 0)/dataTarget.pbs,
        shape: (x, y, width, height) => {
            const path = [];
            const w = Math.min(width, height);
      
            for (let i = 0; i < 5; i++) {
              path.push([
                i === 0 ? 'M' : 'L',
                (Math.cos(((18 + i * 72) * Math.PI) / 180) * w) / 2 + x,
                (-Math.sin(((18 + i * 72) * Math.PI) / 180) * w) / 2 + y,
              ]);
              path.push([
                'L',
                (Math.cos(((54 + i * 72) * Math.PI) / 180) * w) / 4 + x,
                (-Math.sin(((54 + i * 72) * Math.PI) / 180) * w) / 4 + y,
              ]);
            }
      
            path.push(['Z']);
            return path;
          },
        outline: {
          border: 4,
          distance: 8,
        },
        wave: {
          length: 128,
        },
      };
    return (
        <div className="container">
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
                    <div className="titleBoard">BẢNG SẢN LƯỢNG</div>
                    <div className="content">
                        <div className="col name pted">
                            <div className="title title-column"><BookmarkBorderIcon style={{ marginRight: 10 }} /> PT/ED</div>
                            <div className="data-product">
                            {`KH: ${dataTarget.pted}  -  SL: ${dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 20).COUNT : 0}`}
                            </div>
                            <div className="chartProductionDashboard">
                                <Liquid {...configPTED} />
                            </div>

                            {/* <div className="title">PT/ED</div>
                            <div className="title">PVC</div>
                            <div className="title">SƠN MÀU</div>
                            <div className="title">PBS</div> */}

                        </div>
                        <div className="col target"pvc>
                            <div className="title title-column"><VideoStableIcon style={{ marginRight: 10 }} />PVC</div>
                            <div className="data-product">
                            {`KH: ${dataTarget.pvc}  -  SL: ${dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 50).COUNT : 0}`}
                            </div>
                            <div className="chartProductionDashboard">
                                <Liquid {...configPVC} />
                            </div>
                            {/* <div className="title number">{dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 20).COUNT : 0}</div>
                            <div className="title number">{dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 50).COUNT : 0}</div>
                            <div className="title number">{dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 60).COUNT : 0}</div>
                            <div className="title number">{dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 90).COUNT : 0}</div> */}

                        </div>
                        <div className="col actual paint">
                            <div className="title title-column"><OpacityIcon style={{ marginRight: 10 }}/>PAINT</div>
                            <div className="data-product">
                            {`KH: ${dataTarget.paint}  -  SL: ${dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 60).COUNT : 0}`}
                            </div>
                            <div className="chartProductionDashboard">
                                <Liquid {...configPAINT}/>
                            </div>
                            {/* <div className="title number">{dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 20).COUNT : 0}</div>
                            <div className="title number">{dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 50).COUNT : 0}</div>
                            <div className="title number">{dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 60).COUNT : 0}</div>
                            <div className="title number">{dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 90).COUNT : 0}</div>
                        */}
                        </div> 
                        <div className="col actual pbs">
                            <div className="title title-column"><DoneAllIcon style={{ marginRight: 10 }} />IN PBS</div>
                            <div className="data-product">
                            {`KH: ${dataTarget.pbs}  -  SL: ${dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 90).COUNT : 0}`}
                            </div>
                            <div className="chartProductionDashboard">
                                <Liquid {...configPBS}/>
                            </div>
                            {/* <div className="title number">{dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 20).COUNT : 0}</div>
                            <div className="title number">{dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 50).COUNT : 0}</div>
                            <div className="title number">{dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 60).COUNT : 0}</div>
                            <div className="title number">{dataLineProduct.length > 0 ? dataLineProduct.find(item => item.PROCESS_NO === 90).COUNT : 0}</div>
                        */}
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
                <Divider className="divider" orientation="left">Nhập KH sản lượng</Divider>
                <div className="name"></div>
            </Drawer>
        </div>
    )
}

export default Dashboard
