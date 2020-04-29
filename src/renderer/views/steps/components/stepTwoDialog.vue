<template>
    <el-dialog
            title="Active&Bind"
            :visible.sync="boxVisible"
            width="400px"
            :before-close="handleClose"
            top="30vh"
    >
        <div class="sideBox">
            <div class="chooseBox">
                <div>
                    <span class="el-icon-magic-stick"></span>
                    <span>Activating your imKey</span>
                </div>
                <div v-loading="loading1" element-loading-spinner="el-icon-loading loading" v-if="loading1"></div>
                <div v-else :class="status1?'el-icon-check':'el-icon-close'"></div>
            </div>
            <div class="chooseBox secondChoose" v-show="bindShow">
                <div>
                    <el-input v-model="BindCode"
                              style="width:250px"
                              placeholder="enter bind code"
                              @blur="handleBlur"
                              :class="isError?'errorBorder':''"></el-input>
                </div>
                <div>
                    <el-button
                            type="primary"
                            size="mini"
                            @click="bind"
                            v-if="!isCorret"
                            :loading="loading"
                            :disabled="!status1"
                    >Bind
                    </el-button>
                    <span v-else :class="isCorret?'el-icon-check':'el-icon-close'"></span>
                </div>
                <p v-if="isError" class="errorNotice">{{notcieText}}</p>
            </div>
            <div class="chooseBox">
                <div>
                    <span class="el-icon-connection"></span>
                    <span>Binding your imKey</span>
                </div>
                <div v-if="showThree">
                    <span v-loading="loading3" element-loading-spinner="el-icon-loading" v-if="loading3"></span>
                    <span v-else :class="status3?'el-icon-check':'el-icon-close'"></span>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import {
        connect_device,
        activeDevice,
        deviceBindAcquire,
        deviceBindCheck,
        deviceBindDisplay,
        getUserPath
    } from "../../../../api/devicemanager";

    export default {
        name: "checkBox",
        data() {
            return {
                userPath: "",
                bindShow: false,
                status1: false,
                BindCode: "",
                status3: false,
                isCorret: false,
                loading: false,
                loading1: true,
                loading3: false,
                showTwo: false,
                showThree: false,
                isError: false,
                notcieText: ""

            };
        },
        props: {boxVisible: Boolean},
        watch: {
            boxVisible() {
                if (this.boxVisible) {
                    this.firstCheck();
                }
            }
        },
        mounted() {
            this.getUserPath();
        },
        methods: {
            handleBlur() {
                const reg = /^[A-HJ-NP-Z2-9]{8}$/;
                if (!reg.test(this.BindCode)) {
                    this.isError = true;
                    this.notcieText = "";
                } else {
                    this.isError = false;
                }
            },
            getUserPath() {
                getUserPath().then(result => {
                    if (result.code === 200) {
                        this.userPath = result.data;
                        console.log("this.userPath" + this.userPath)
                    }
                }).catch(err => {

                })
            },
            connect() {
                connect_device().then(result => {
                    if (result.code === 200) {
                        const res = result.data
                        if (res == "true") {
                            console.log("success res" + res)
                            // this.$emit("showTwo");
                        } else {
                            this.$message.warning(result.data);
                            // this.isOneChoose = false;
                            // this.isTwoChoose = false;
                        }
                    } else {
                        // this.isOneChoose = false;
                        // this.isTwoChoose = false;
                    }
                }).catch(err => {
                    // this.isOneChoose = false;
                    // this.isTwoChoose = false;
                })
            },
            getActiveDevice() {
                setTimeout(() => {
                    activeDevice().then(result => {
                        if (result.code === 200) {

                            if (result.data == "true") {
                                //激活成功
                                this.loading1 = false;
                                this.status1 = true;
                                this.showTwo = true;
                                //开始判断是否绑定
                                this.getBindDevice();
                            } else {
                                console.log("activeDevice:" + result.data)
                                //激活失败
                                this.handleClose();
                                this.$message.warning(result.data);
                            }
                        }
                    }).catch(err => {
                        //激活失败
                        this.handleClose();
                    })

                }, 200)

            },
            getBindDevice() {
                deviceBindCheck(this.userPath).then(result => {
                    if (result.code === 200) {
                        console.log("result.data:" + result.data);
                        if (result.data == "" || result.data == null) {
                            //失败的话
                            this.$emit("showTwo", false);
                            this.handleClose();
                        } else {
                            if (result.data == "bound_other") {
                                //弹出输入框
                                this.bindShow = true;

                            } else if (result.data == "unbound") {
                                //弹出输入框
                                this.bindShow = true;
                                //显示绑定码
                                this.DeviceBindDisplay();
                            } else if (result.data == "bound_this") {
                                this.isCorret = true;
                                this.showThree = true;
                                this.status3 = true;
                                this.loading3 = true;
                                setTimeout(() => {
                                    //已经绑定
                                    this.loading3 = false;
                                }, 2000);
                                setTimeout(() => {
                                    //第三部成功的话
                                    this.$emit("showTree", true);
                                    this.handleClose();
                                }, 3000);
                            }
                        }
                    }
                }).catch(err => {
                    //失败的话
                    this.$emit("showTwo", false);
                    this.handleClose();
                })

            },
            DeviceBindAcquire() {
                this.loading3 = true;
                deviceBindAcquire(this.BindCode).then(result => {
                    if (result.code === 200) {
                        if (result.data == "true") {
                            setTimeout(() => {
                                //已经绑定
                                this.loading3 = false;
                            }, 1000);
                            setTimeout(() => {
                                //第三部成功的话
                                this.$emit("showTree", true);
                                this.handleClose();
                            }, 2000);

                        } else {
                            this.$message.warning(result.data);
                            //失败的话
                            this.$emit("showTwo", false);
                            this.handleClose();
                        }
                    }
                }).catch(err => {
                    this.$message.warning(err);
                    //失败的话
                    this.$emit("showTwo", false);
                    this.handleClose();
                })
            },
            DeviceBindDisplay() {
                deviceBindDisplay().then(result => {
                    if (result.code === 200) {
                        console.log("deviceBindDisplay:" + result.data)
                        if (result.data == "true") {

                        } else {
                            //失败的话
                            this.$emit("showTwo", false);
                            this.handleClose();
                        }
                    }
                }).catch(err => {
                    //失败的话
                    this.$emit("showTwo", false);
                    this.handleClose();
                })
            },
            firstCheck() {
                this.connect();
                this.loading1 = true;
                //第一步成功的话，继续要一步操作
                setTimeout(() => {
                    this.getActiveDevice();
                }, 1000);
                //失败的话
                // this.$emit("showTree", false);
            },
            handleClose() {
                this.$emit("closeCheckBox", false);
                this.status1 = false;
                this.BindCode = "";
                this.status3 = false;
                this.isCorret = false;
                this.loading = false;
                this.loading1 = true;
                this.loading3 = false;
                this.showTwo = false;
                this.showThree = false;
                this.isError = false;
            },
            bind() {
                if (this.isError || !this.BindCode) {
                    this.isError = true;
                    this.notcieText = !this.BindCode ? "BindCode is Not Null" : "BindCode is not in correct format";
                    return;
                }

                this.connect();
                this.loading = true;
                this.isCorret = true;
                this.showThree = true;
                this.status3 = true;
                this.loading3 = true;
                setTimeout(() => {
                    this.DeviceBindAcquire();
                }, 500);
            }
        }
    };
</script>

<style lang="less" scoped>
    .chooseBox {
        display: flex;
        padding: 0 10px;
        height: 60px;
        align-items: center;
        font-size: 16px;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .secondChoose {
        border-top: 1px solid #dcdcdc;
        border-bottom: 1px solid #dcdcdc;
        height: 80px;
    }

    .sideBox {
        border: 1px solid #dcdcdc;
        border-radius: 5px;
    }

    .el-icon-check {
        color: green;
    }

    .el-icon-close {
        color: tomato;
    }

    .loading {
        margin-top: 20px;
        margin-right: 20px;
    }

    /deep/ .el-loading-spinner {
        top: 65%;
        margin-top: -7px;
        width: 100%;
        text-align: center;
        position: absolute;
        right: 10px;
    }

    .icon {
        margin-right: 10px;
    }
</style>