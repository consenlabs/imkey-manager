<template>
    <div class="connectdevice">
        <NoticeBox :noticeVisible="noticeVisible"
                   @closeNotice="closeErrorView"></NoticeBox>
        <div class="logoview">
            <img style="height:100px" src="../assets/logo.png" alt="">
            <h2>{{$t('m.connectDevice.get_start_imKey')}}</h2>
<!--            <h2>{{this.$i18n.messages[this.$i18n.locale].m.connectDevice.get_start_imKey}}</h2>-->
        </div>
        <div class="bottomBox">
            <div class="selectBox">
                <deviceImage :middle="true" :line="true"></deviceImage>
            </div>
            <div class="textBox">
                <ul>
                    <li>1. {{$t('m.connectDevice.info_connect_imKey')}}</li>
                    <li>2. {{$t('m.connectDevice.info_click_button')}}</li>
                    <li>3. {{$t('m.connectDevice.info_enter_pin')}}</li>
                    <h5>*{{$t('m.connectDevice.info_if_pin')}}</h5>
                </ul>
            </div>
        </div>
        <div class="btns">
            <el-button
                    style="width:100%"
                    :loading="connectLoading"
                    :type="one?'success':'primary'"
                    @click="check()"
            >{{connectText}}
            </el-button>
        </div>
        <!-- <div class="btns">
          <el-button
            style="width:100%"
            :type="two?'success':'primary'"
            @click="choose(2)"
          >Connect</el-button>
        </div>-->
    </div>
</template>

<script>
    import deviceImage from "../components/deviceImage";
    import {
        checkUpdate,
        connect_device, cosUpdate, deviceBindCheck, getUserPath, getSeid
    } from '../../api/devicemanager'
    import {getBTC_Xpub_} from "../../api/walletapi";
    import NoticeBox from "@/components/noticeDialog";

    export default {
        name: "ConnectDevice",
        data() {
            return {
                userPath: "",
                one: false,
                two: false,
                connectLoading: false,
                connectText: this.$t('m.connectDevice.connect'),
                connectStatus: false,
                BLStatus: false,
                activeStatus: false,
                bindStatus: false,
                createWalletStatus: false,
                noticeVisible: false
            };
        },
        components: {
            deviceImage,
            NoticeBox
        },
        mounted() {
            this.getUserPath();
            //禁止主页面滑动
            this.noScroll();
        },
        methods: {
            check() {
                // //连接设备
                this.connect();
                // //检查是否处于BL状态，如果是BL状态就更新COS
                // this.checkIsBL();
                // //检查是否激活
                // this.checkIsActive();
                // //检查是否绑定
                // this.checkIsBind();
                // //检查是否是否创建钱包
                // this.checkIsCreateWallet();
                // //如果都没有问题，就跳转到HOME 界面
                // this.router.replace("/index");

            },
            checkIsBL() {
                // this.connectText = "check BL";
                this.connectText = this.$t('m.connectDevice.check_BL');
                setTimeout(() => {
                    //通过getseid来判断是否处于BL状态
                    getSeid().then(result => {
                        if (result.code === 200) {
                            let res = result.data
                            if (res == "" || res == null) {
                                //更新COS
                                this.getcosupdate();
                            } else {
                                //无需更新COS
                                this.BLStatus = true;
                                this.checkIsActive();
                            }
                        } else {
                            this.openErrorView(result.message);
                        }
                    }).catch(err => {
                        this.openErrorView(err);
                    })
                }, 100)
            },
            checkIsActive() {
                this.connectText = this.$t('m.connectDevice.check_active');
                setTimeout(() => {
                    checkUpdate().then(result => {
                        if (result.code === 200) {
                            let activeStatus = result.data.status
                            if (activeStatus == "latest") {
                                console.log("activeStatus:" + activeStatus);
                                this.connectText = this.$t('m.connectDevice.active_success');
                                this.checkIsBind();
                            } else {
                                //还没有激活，跳转到激活界面
                                this.goStep(2);
                            }
                        } else {
                            this.openErrorView(result.message);
                        }
                    }).catch(err => {
                        this.openErrorView(err);
                    })
                }, 200)
            },
            checkIsBind() {
                this.connectText = this.$t('m.connectDevice.check_bind');
                setTimeout(() => {
                    deviceBindCheck(this.userPath).then(result => {
                        if (result.code === 200) {
                            console.log("result.data:" + result.data);
                            if (result.data == "" || result.data == null) {
                                //失败的话
                                this.openErrorView("bind error: null");
                            } else {
                                if (result.data == "bound_other") {
                                    //跳转到绑定界面
                                    this.goStep(2);
                                } else if (result.data == "unbound") {
                                    //跳转到绑定界面
                                    this.goStep(2);
                                } else if (result.data == "bound_this") {
                                    //成功绑定 继续
                                    this.bindStatus = true;
                                    this.checkIsCreateWallet();
                                }else{
                                    this.goStep(2);
                                }
                            }
                        } else {
                            this.openErrorView(result.message);
                        }
                    }).catch(err => {
                        //失败的话
                        this.openErrorView(err);

                    })
                }, 200)
            },
            checkIsCreateWallet() {
                this.connectText = this.$t('m.connectDevice.check_create_wallet');
                setTimeout(() => {
                    getBTC_Xpub_().then(result => {
                        if (result.code === 200) {
                            console.log("getBTC_Xpub_:" + result.data)
                            if (result.data != "" || result.data != null) {
                                if (result.data.match("xpu")) {
                                    console.log("getBTC_Xpub_:" + result.data)
                                    //成功 继续
                                    this.createWalletStatus = true;
                                    this.router.replace("/index");
                                } else {
                                    //跳转到创建钱包界面
                                    this.goStep(3);
                                }
                            } else {
                                //跳转到创建钱包界面
                                this.goStep(3);
                            }
                        } else {
                            this.openErrorView(result.message);
                        }
                    }).catch(err => {
                        //失败
                        this.openErrorView(err);
                    })
                }, 200)
            },
            connect() {
                this.connectLoading = true;
                // this.connectText = "Connecting";
                this.connectText = this.$t('m.connectDevice.connecting');
                setTimeout(() => {
                    connect_device().then(result => {
                        const res = result.data
                        if (res == "true") {
                            console.log("success res " + res)
                            // this.connectText="Please wait for a moment,Checking your imKey";
                            // this.connectText = "Connect success ";
                            this.connectText = this.$t('m.connectDevice.connect_success');
                            this.connectStatus = true;
                            this.checkIsBL();
                        } else {
                            this.openErrorView("connect:"+res);
                        }

                    }).catch(err => {
                        this.openErrorView(err);
                    })
                }, 200)
            },
            getcosupdate() {
                this.connectText = this.$t('m.connectDevice.upgrading_firmware');
                setTimeout(() => {
                cosUpdate().then(result => {
                    if (result.code === 200) {
                        if (result.data == "true") {
                            //cos更新成功检查是否激活
                            this.BLStatus = true;
                            this.checkIsActive();
                        } else {
                            this.openErrorView(result.data);
                        }
                    } else {
                        this.openErrorView(result.message);
                    }
                }).catch(err => {
                    this.openErrorView(err);
                })
                }, 200)
            },
            getUserPath() {

                getUserPath().then(result => {
                    if (result.code === 200) {
                        const electron = require('electron');
                        const dataPath = (electron.app || electron.remote.app).getPath('userData')+"/";
                        console.log("dataPath:"+dataPath)
                        this.userPath = dataPath;
                        console.log("this.userPath" + dataPath)
                    }
                }).catch(err => {

                })
            },
            goStep(index) {
                switch (index) {
                    case 1:
                        this.router.push({
                            path: "/deviceStep",
                            query: {
                                index: 1
                            }
                        });
                        break;
                    case 2:
                        this.router.push({
                            path: "/deviceStep",
                            query: {
                                index: 2
                            }
                        });
                        break;
                    case 3:
                        this.router.push({
                            path: "/deviceStep",
                            query: {
                                index: 3
                            }
                        });
                        break;
                }

            },
            openErrorView(msg) {
                this.connectLoading = false;
                this.$store.state.message = msg
                this.noticeVisible = true;

            },
            closeErrorView(msg) {
                this.connectText=this.$t('m.connectDevice.connect')
                this.noticeVisible = false;
                if(msg.toString().indexOf("connect:") !== -1 ){
                    this.connect();
                }
            }
        }
    };
</script>
<style lang="less" scoped>
    .connectdevice {
        text-align: center;
        width: 600px;
        margin: 80px auto;

        h2 {
            margin: 30px 0;
        }

        .bottomBox {
            margin: 100px 20px;
            display: flex;
        }

        .textBox {
            text-align: left;
            margin: -80px 20px;

            ul {
                li {
                    height: 50px;
                    line-height: 50px;
                    border: 1px solid #dcdcdc;
                    margin: 20px 0;
                    padding: 0 20px;
                    border-radius: 5px;
                }
            }
        }

        .btns {
            margin-top: 20px;
            margin-left: -30px;
        }
    }
</style>
