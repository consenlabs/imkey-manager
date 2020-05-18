<template>
    <div class="manager">
        <NoticeBox  :noticeVisible="noticeVisible"
                    @closeNotice="closeErrorView"></NoticeBox>
        <h1>Manager</h1>
        <p class="notice">
            <span>Install or unstall apps on your device</span>
            <span>
        Need Help?
        <i class="el-icon-connection" @click="help"></i>
      </span>
        </p>
        <div class="deviceBox">
            <div class="contentBox">
                <!-- <img src="../../assets/miniDevice.png" style="width:40px;height:auto" alt /> -->
                <deviceImage :mini="true" :line="false"></deviceImage>
                <div class="deviceName">
                    <h3>imKey Pro</h3>
                    <p>firmware version {{oldVersionData}}</p>
                </div>
            </div>
            <div v-if="!updateSuccess">
                <span class="updateMsg">firmware is {{newVersionData}} avaliable</span>
                <el-button type="primary" @click="updateVersion" size="small" :loading="loading">update</el-button>
            </div>
        </div>
        <div class="appBox">
            <h1>App catalog</h1>
            <el-input prefix-icon="el-icon-search" v-model="appName" placeholder="search app"></el-input>
            <div class="appContent">
                <div v-for="(item,index) in getApps" :key="item.id" class="appItem">
                    <div class="leftContent">
                        <img :src="item.icon" alt="/"/>
                        <div>
                            <h4>{{item.name}}</h4>
                            <p>{{item.desc}}</p>
                        </div>
                    </div>
                    <div class="rightContent">
                        <div v-if="!isSuccess" class="roate">
                            <span class="el-icon-refresh"></span>
                        </div>
                        <div v-else>
                            <el-button
                                    plain
                                    type="primary"
                                    size="small"
                                    :disabled="item.installDis"
                                    :loading="item.installLoding"
                                    @click="intall(item,index)"
                            >Install
                            </el-button>
                            <el-button
                                    type="danger"
                                    size="small"
                                    @click="delet(item,index)"
                                    :disabled="item.deletDis"
                                    :loading="item.deletLoding"
                                    class="el-icon-delete"
                            ></el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import deviceImage from "../../components/deviceImage";
    import {
        connect_device, cosUpdate, cosCheckUpdate,getAppList, downloadApplet, deleteApplet, getFirmwareVersion
    } from '../../../api/devicemanager'
    import NoticeBox from "@/components/noticeDialog";
    export default {
        name: "manager",
        data() {
            return {
                appName: "",
                isSuccess: false,
                oldVersionData: "",
                newVersionData: "",
                updateSuccess: false,
                loading: false,
                apps: [],
                noticeVisible:false,
                isLatest:false,
                updateType:"",
                description:""
            };
        },
        components: {
            deviceImage,
            NoticeBox
        },
        computed: {
            getApps() {
                let arr = [];
                arr = this.appName
                    ? this.apps.filter(ele => {
                        if (ele.name.match(this.appName)) {
                            return ele;
                        }
                    })
                    : this.apps;
                return arr;
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init(){
                connect_device().then(result => {

                    if (result.code === 200) {
                        const res = result.data
                        console.log("res:" + res)
                        if (res == "true") {
                            console.log("success res " + res)
                            this.getFirmwareVersion();
                        } else {
                            console.log("redwdsdss" + res)
                            this.router.replace("/manager/connect");

                        }
                    } else {
                        this.router.replace("/manager/connect");
                    }
                }).catch(err => {
                    this.router.replace("/manager/connect");
                })
            },
            compareByFirmwareVersion(){
                //如果cos版本不一致，提示用户更新
                if(this.oldVersionData == this.newVersionData){
                    this.updateSuccess=true;
                }else{
                    //显示要更新的按钮
                    this.updateSuccess=false;
                    //提示更新信息
                    this.openErrorView(this.description)


                }
                //加载应用
                this.AppsList();

            },
            getFirmwareVersion() {
                getFirmwareVersion().then(result => {
                    if (result.code === 200) {
                        this.oldVersionData = result.data;
                        this.getCheckCosUpdate();
                    }else{
                        this.openErrorView(result.message);
                    }
                }).catch(err => {
                    this.openErrorView(err);
                })
            },
            getCheckCosUpdate() {
                cosCheckUpdate().then(result => {
                    if (result.code === 200) {
                        this.newVersionData = result.data.latestCosVersion;
                        this.isLatest = result.data.isLatest;
                        this.updateType = result.data.updateType;
                        this.description = result.data.description;
                        //对比COS版本，提示用户是否升级
                        this.compareByFirmwareVersion();
                    }else{
                        this.openErrorView(result.message);
                    }
                }).catch(err => {
                    this.openErrorView(err);
                })
            },
            getcosupdate() {
                // this.connect();
                cosUpdate().then(result => {
                    if (result.code === 200) {
                        if (result.data == "true") {
                            this.loading = false;
                            this.updateSuccess = true;
                            this.oldVersionData = this.newVersionData;
                        } else {
                            this.loading = false;
                            this.openErrorView(result.data);
                        }
                    }else{
                        this.loading = false;
                        this.openErrorView(result.message);
                    }
                }).catch(err => {
                    this.loading = false;
                    this.openErrorView(err);
                })
            },
            connect() {
                connect_device().then(result => {

                    if (result.code === 200) {
                        const res = result.data
                        console.log("res:" + res)
                        if (res == "true") {
                            console.log("success res " + res)
                        } else {
                            console.log("redwdsdss" + res)
                            this.router.replace("/manager/connect");

                        }
                    } else {
                        this.router.replace("/manager/connect");
                    }
                }).catch(err => {
                    this.router.replace("/manager/connect");
                })
            },
            AppsList() {
                // this.connect();
                getAppList().then(result => {
                    if (result.code === 200) {
                        this.apps = result.data.list
                        this.isSuccess = true;
                        // const total = result.data.total
                    } else {
                        this.openErrorView(result.message);
                    }
                }).catch(err => {
                    this.openErrorView(err);
                })
            },
            updateVersion() {
                this.loading = true;
                setTimeout(() => {
                    this.getcosupdate();
                }, 200);

            },
            intall(item, index) {
                this.connect();
                this.apps[index].installLoding = true;
                this.apps[index].deletLoding = false;

                setTimeout(() => {
                    downloadApplet(item.name).then(result => {
                        if (result.code === 200) {

                            if (result.data == "true") {
                                this.apps[index].deletDis = false;
                                this.apps[index].installDis = true;
                                this.apps[index].installLoding = false;
                            } else {
                                this.apps[index].installLoding = false;
                                this.openErrorView(result.data);
                            }
                        }else{
                            this.apps[index].installLoding = false;
                            this.openErrorView(result.message);
                        }
                    }).catch(err => {
                        this.apps[index].installLoding = false;
                        this.openErrorView(err);

                    })
                }, 200);
            },
            delet(item, index) {
                this.connect();
                this.apps[index].deletLoding = true;
                this.apps[index].installLoding = false;
                setTimeout(() => {
                    deleteApplet(item.name).then(result => {
                        if (result.code === 200) {

                            if (result.data == "true") {
                                this.apps[index].deletDis = true;
                                this.apps[index].installDis = false;
                                this.apps[index].deletLoding = false;
                            } else {
                                this.apps[index].deletLoding = false;
                                this.openErrorView(result.data);
                            }
                        }else{
                            this.openErrorView(result.message);
                        }
                    }).catch(err => {
                        this.apps[index].deletLoding = false;
                        this.openErrorView(err);
                    })
                }, 200);
            },
            help() {
                window.open(
                    "https://support.imkey.im/hc/zh-cn/articles/360019656954-如何设置与修改-PIN-码",
                    "_blank",
                    "scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes"
                );
            },
            openErrorView(msg) {
                this.$store.state.message=msg
                this.noticeVisible = true;

            },
            closeErrorView(msg) {
                this.noticeVisible = false;
            }
        }
    };
</script>

<style lang="less" scoped>
    .manager {
        padding-top: 10px;
        margin-bottom: 100px;
    }

    .contentBox {
        display: flex;
        align-items: center;
    }

    .notice {
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
    }

    .deviceBox {
        height: 100px;
        background: #fff;
        margin: 30px 0;
        padding: 0 30px;
        border-radius: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .updateMsg {
            margin: 0 20px;
        }

        .deviceName {
            margin-left: 10px;

            p {
                color: #dcdcdc;
                margin-top: 10px;
            }
        }
    }

    .appBox {
        .el-input {
            margin: 10px 0;
        }
    }

    .appContent {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;

        .appItem {
            width: 45%;
            height: 70px;
            background: #fff;
            border-radius: 5px;
            margin: 10px 20px;
            box-sizing: border-box;
            padding: 0 20px;
            display: flex;
            /*justify-content: space-between;*/
            align-items: center;

            p {
                color: #dcdcdc;
            }

            img {
                width: 40px;
                height: 40px;
                margin-right: 10px;
                /*margin-top: 30px;*/
            }

            .leftContent,
            .rightContent {
                flex: 1;
            }

            .rightContent {
                text-align: right;

            }

            .leftContent {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                /*margin:20px;*/
            }
        }
    }

    .el-icon-connection {
        color: blue;
        cursor: pointer;
    }
</style>