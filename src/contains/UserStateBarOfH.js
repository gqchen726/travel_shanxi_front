import React from "react";
import {
    Modal,
} from "antd/es";
import {SimpleLogin} from "./SimpleLogin";
import PropTypes from "prop-types"
import "./../public/css/UseStatusBar.css"
import {urlsUtil} from "../public/ApiUrls/UrlsUtil";
import localContext from "../cache/localContext";
// import Avatar from "antd/es/avatar";
import {
    Menu,
    Avatar
} from "grommet";
import {Link} from "react-router-dom";
import sessionContext from "../cache/sessionContext";
export class UserStateBarOfH extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            visible: false,
            pageHeader: null,
            modalContent: null,
            avatarImg: !!props.user ? (!!props.user.avatar ? props.user.avatar : null):null
        };
    }

    componentDidMount() {
        let {user, mode} = this.props;
        this.returnPageHandler(user, mode);
        this.getLoginCard();
    }

    getLoginCard = () => {
        this.setState({
            modalContent:<SimpleLogin getUser={this.getUser} />,
        })
    }



    getUser = (here,result) => {
        if (here && result) {
            let modalContent = result.result;
            this.setState({
                modalContent:modalContent
            })
            if(result.stateMsg === 'loginSuccess') {
                setTimeout(() => this.props.getUser(here,result.user),2000)
            }

            setTimeout(() => {
                if (result.stateMsg === 'registerSuccess') {
                    this.getLoginCard();
                }
            },1000)
        }
    }

    returnButtons = (buttons) => {
        if(buttons && buttons.length > 0) {
            return buttons.map((obj,index) => {
                return (
                    obj.linkPath?
                    { label: <Link to={obj.linkPath}>{obj.content}</Link>}:
                        { label: obj.content,onClick: obj.handleClick}
                );
            })
        }
        return null;
    }


    hideModal = () => {
        let {user, mode} = this.props;
        this.setState({visible: false})
        this.returnPageHandler(user, mode);
    }
    showModal = () => {
        this.setState({
            visible: true,
        })
    }




    returnLoginConversationBox = () => {
        return (
            <Modal
                title= "用户面板"
                visible= {this.state.visible}
                onOk= {this.hideModal}
                onCancel= {this.hideModal}
                closable= {false}
                okText= '确认'
                cancelText= '关闭'

            >

                {this.state.modalContent}
            </Modal>
        );
    }

    returnPageHandler = (user,mode) => {
        let {avatarImg} = this.state;
        let isLogin = !!user;
        let logined = [
            {
                type: 'primary',
                content: '登出',
                handleClick: () => {
                    localContext.remove('user');
                    sessionContext.remove('user');
                    window.location.reload();
                }
            },
            {
                type: 'primary',
                content: '修改密码',
                linkPath: "/userPasswordOfUpdate"
            }
        ];
        let noLogin = [
            {
                type: 'primary',
                content: '去登录',
                handleClick: this.showModal
            }
        ];
        let buttonsPara = isLogin ? logined:noLogin;


        let pageHeader;
        if (mode == "Icon") {
            pageHeader =  (
                <div>
                    {this.returnExtraButton(buttonsPara,true)}
                </div>
            );
        } else {
            pageHeader = (
                <div>
                    <Menu
                        dropProps={{
                            align: { top: 'bottom', left: 'left' },
                            // color: "#7d4acf",
                            elevation: 'xlarge',
                        }}
                        label={
                            <Avatar src={!!user? `${urlsUtil.image.get}${avatarImg}`:'http://avatars1.githubusercontent.com/u/8186664?s=460&v=4'} />
                        }
                        items={this.returnButtons(buttonsPara)}
                    />
                </div>
            );
        }
        this.setState({pageHeader:pageHeader})
    }

    render() {
        let {pageHeader} = this.state;
        return (
            <div>
                {this.returnLoginConversationBox()}
                {pageHeader}
            </div>
        );
    }
}
UserStateBarOfH.propTypes = {
    mode: PropTypes.string,
    user: PropTypes.object,
    getUser: PropTypes.func
}