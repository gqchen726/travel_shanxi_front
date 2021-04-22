import { Steps } from 'antd';
import { UserOutlined, SolutionOutlined, LoadingOutlined, SmileOutlined } from '@ant-design/icons';
import React from "react";
import Card from "antd/es/card";
import Button from "antd/es/button";
import {MyDescriptions} from "./MyDescriptions";
import {withRouter} from "react-router";
import axios from "axios";
import {urlsUtil} from "../public/ApiUrls/UrlsUtil";
import "./../public/css/OrderStep.css"

const { Step } = Steps;
import {notification} from "antd/es";

export class OrderDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: {
                PayStatus: "process",
                ViewDetail: "wait"
            },
            orderDetail: {},
        }
    }

    componentWillMount() {
        let {orderId} = this.props.match.params;
        axios.get(`${urlsUtil.order.getOrderUrl}?orderId=${orderId}`).then((response) => {
            let {data} = response;
            if (data.code) {
                let orderDetail = data.body;
                console.log(orderDetail)
                if (orderDetail.order.status === "generated") {
                    setTimeout(() => {
                        this.setState({
                            orderDetail: orderDetail,
                            status: {
                                PayStatus: "process",
                                ViewDetail: "wait"
                            },
                        })
                    },0)
                } else if(orderDetail.order.status === "paid") {
                    setTimeout(() => {
                        this.setState({
                            orderDetail: orderDetail,
                            status: {
                                PayStatus: "finish",
                                ViewDetail: "process"
                            },
                        })
                    },0)
                }
            } else {
                notification.open({
                    message: 'orderDetail tips',
                    description: data.message
                });
            }
        })


    }


    next = () => {
        let {status, orderDetail} = this.state;
        console.log(orderDetail)
        if ("process" == status.ViewDetail) {
            return ;
        }
        if ("process" == status.PayStatus) {


            axios.get(`${urlsUtil.order.updateOrderStatus}?mobileNumber=${this.props.user.mobileNumber}&orderId=${orderDetail.order.orderId}&status=paid`)
                .then((response) => {
                    let data = response.data;
                    if (data.code) {
                        let orderDetail = data.body;
                        status.PayStatus = "finish";
                        status.ViewDetail = "finish";
                        this.setState({
                            status: status,
                            orderDetail: orderDetail
                        })
                    } else {
                        notification.open({
                            message: 'register tips',
                            description: data.message
                        });
                    }
                })
            this.setState({
                status: status
            })
        }
    }

    returnOrderCard = (status,orderDetail) => {
        console.log(orderDetail)
        if (!orderDetail.order) {
            return ;
        }
        if (status.PayStatus == "process") {

            if (!orderDetail) return <div>data is null</div>

            return (
                <div>
                    <br />
                    <div className={"OrderCode"}>
                        {
                            orderDetail.order.orderId ? orderDetail.order.orderId : null
                        }
                    </div>
                    <div className={"OrderDetail"}>
                        <br />
                        <MyDescriptions
                            descriptered={orderDetail.order}
                            title={"订单信息"}
                            bordered={true}
                            layout={"horizontal"}
                        />
                        <br />
                        <MyDescriptions
                            descriptered={orderDetail.product}
                            title={"产品信息"}
                            bordered={true}
                            layout={"horizontal"}
                        />
                    </div>
                </div>
            );
        }
        if (status.ViewDetail == "process") {
            if (!orderDetail) return <div>data is null</div>

            return (
                <div>
                    <br />
                    <div className={"OrderCode"}>
                        {
                            orderDetail.order.orderId ? orderDetail.order.orderId : null
                        }
                    </div>
                    <div className={"OrderDetail"}>
                        <br />
                        <MyDescriptions
                            descriptered={orderDetail.order}
                            title={"订单信息"}
                            bordered={true}
                            layout={"horizontal"}
                        />
                        <br />
                        <MyDescriptions
                            descriptered={orderDetail.product}
                            title={"产品信息"}
                            bordered={true}
                            layout={"horizontal"}
                        />
                    </div>
                </div>
            );
        }
    }
    render() {
        let {status, orderDetail} = this.state;
        return (
            <Card>
                <Steps>
                    <Step status={status.PayStatus}
                          title="Pay"
                          icon={status.PayStatus == "process" ? <LoadingOutlined /> :<UserOutlined />}
                    />
                    <Step status={status.ViewDetail}
                          title="ViewDetail"
                          icon={<SmileOutlined />}
                    />
                </Steps>
                {/*1.订单生成卡片*/}
                {/*2.支付卡片*/}
                {/*3.订单完成卡片*/}
                {
                    this.returnOrderCard(status, orderDetail)
                }
                {
                    status.ViewDetail === "process" ? null: (
                        <div>
                            <Button
                                type={"primary"}
                                style={{width:'10%'}}
                                onClick={this.next}
                            >
                                下一步
                            </Button>
                        </div>
                    )
                }
            </Card>
        );
    }
}
export const OrderDetailW = withRouter(OrderDetail)