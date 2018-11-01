import React, {Component} from 'react'
import {Modal, Carousel, Button} from 'antd'
import {parseURL} from './utils'
// import {  } from 'antd/lib/radio';
export default class Dialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            iframs: false,
            url: null,
            images: [],
            curPage: 0
        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyPress)
    }

    onKeyPress = (e) => {
        if (e.keyCode === 39 || e.keyCode === 40) {
            this.onNext()
        } else if (e.keyCode === 37 || e.keyCode === 38) {
            this.onPrev()
        }
    }

    // 下一个操作
    onNext() {
        this.refs.carousel && this.refs.carousel.next()
    }

    // 上一个操作
    onPrev() {
        this.refs.carousel && this.refs.carousel.prev()
    }

    setData(data) {
        let images = data.imgSrcData != '' ? JSON.parse(data.imgSrcData) : []
        this.setState({
            visible: true,
            url: data.originalSrc,
            iframs: data.type == 2 ? data.htmlUrl : false,
            images
        })
    }

    handleCancel = (e) => {
        e.stopPropagation();
        this.setState({
            visible: false
        })
    }

    setControl(type, data) {
        let sArgName = "type=" + type + "&data=" + data;
        this.exec_iframe(sArgName);
    }

    exec_iframe(sArgName) {
        let myURL = parseURL(document.getElementById('ifr').getAttribute('src'));
        let url = myURL.protocol + "://" + myURL.host + '/execSetControl.html?' + sArgName + "&r=" + Math.random();
        if (typeof(exec_obj) == 'undefined') {
            exec_obj = document.createElement('iframe');
            exec_obj.name = 'tmp_frame';
            exec_obj.src = url;
            exec_obj.style.display = 'none';
            document.body.appendChild(exec_obj);
        } else {
            exec_obj.src = url;
        }
    }

    componentWillMount() {
        window.removeEventListener('keydown', this.onKeyPress)
    }

    render() {
        const {visible, images, iframs, url, curPage} = this.state
        let element = (
            <div>
                <Button
                    type="primary"
                    icon="download"
                    href={`http://dev.api.3tclass.3ttech.cn/netdisk/download?fileUrl=${url}`}>
                    点击下载
                </Button>
            </div>
        )
        return (
            <Modal
                destroyOnClose={true}
                title="查看文件"
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={element}
                centered={true}
            >
                <div>
                    {
                        iframs ? (<div style={{width: 470, height: 300, overflow: 'scroll'}}>
                                    <iframe
                                        id="ifr"
                                        style={{width: '100%', height: '100%'}}
                                        frameBorder="0"
                                        scrolling="no"
                                        name="myframe"
                                        src={iframs}/>
                                </div>
                            )
                            : (<div>
                                    <div style={{width: 470, height: 300, overflow: 'scroll'}}>
                                        <Carousel dots={false}
                                                  effect="fade"
                                                  ref={ref => this.carousel = ref}
                                                  afterChange={(e) => {
                                                      this.setState({
                                                          curPage: e
                                                      })
                                                  }}
                                        >
                                            {
                                                images.map((src, count) => <img src={src} key={count}
                                                                                style={{width: 450, height: 'auto'}}/>)
                                            }
                                        </Carousel>
                                    </div>
                                    {images.length < 2 ? null : <div style={{display: "flex", margin: "10px 135px"}}>
                                        <Button
                                            disabled={curPage === 0 ? true : false}
                                            onClick={() => {
                                                this.carousel.prev();
                                            }}><img style={{width: 16, height: 16}}
                                                    src={require("@/assets/imgs/icons/icon_left.jpg")} alt=""/></Button>
                                        <div style={{margin: "0 15px", textAlign: "center"}}>
                                            <span>第{curPage + 1}页</span>
                                            <span>&nbsp;/&nbsp;</span>
                                            <span>共{images.length}页</span>
                                        </div>
                                        <Button
                                            disabled={curPage === images.length - 1 ? true : false}
                                            onClick={() => {
                                                this.carousel.next();
                                            }}><img style={{width: 16, height: 16}}
                                                    src={require("@/assets/imgs/icons/icon_right.jpg")} alt=""/></Button>
                                    </div>}
                                </div>
                            )
                    }
                </div>
            </Modal>
        )
    }
}