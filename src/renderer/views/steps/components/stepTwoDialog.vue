<template>

    <el-dialog
            :title="$t('m.stepTwo.active_bind')"
            :visible.sync="boxVisible"
            width="400px"
            :before-close="handleClose"
            top="30vh"
    >
        <div class="sideBox">
            <div class="chooseBox">
                <div>
                    <span class="el-icon-magic-stick"></span>
                    <span>{{$t('m.stepTwo.activating_imKey')}}</span>
                </div>
                <div v-loading="loading1" element-loading-spinner="el-icon-loading loading" v-if="loading1"></div>
                <div v-else :class="status1?'el-icon-check':'el-icon-close'"></div>
            </div>
            <div class="chooseBox secondChoose" v-show="bindShow">
                <div class="inputBindCode">
                    <el-input v-model="BindCode"
                              style="width:250px"
                              :placeholder="$t('m.stepTwo.enter_bind_code')"
                              @blur="handleBlur"
                              :class="isError?'errorBorder':''"></el-input>
                    <el-button
                            type="primary"
                            size="mini"
                            @click="bind"
                            v-if="!isCorrect"
                            :loading="loading"
                            :disabled="!status1"
                    >{{$t('m.stepTwo.bind')}}
                    </el-button>
                    <span v-else :class="isCorrect?'el-icon-check':'el-icon-close'"></span>
                </div>

                <div class="inputBindCode">
                    <h1 v-if="isError" class="errorNotice">{{noticeText}}</h1>
                </div>
            </div>
            <div class="chooseBox">
                <div>
                    <span class="el-icon-connection"></span>
                    <span>{{$t('m.stepTwo.binding_imKey')}}</span>
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
    import constants from "../../../../common/constants";
    import {
        connectDevice,
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
                isCorrect: false,
                loading: false,
                loading1: true,
                loading3: false,
                showTwo: false,
                showThree: false,
                isError: false,
                noticeText: ""

            };
        },
        props: {boxVisible: Boolean},
        watch: {
            boxVisible() {
                if (this.boxVisible) {
                    this.checkActiveAndBind();
                }
            }
        },
        mounted() {
            this.connect();
        },
        methods: {
            handleBlur() {
                const reg = /^[a-hj-np-zA-HJ-NP-Z2-9]{8}$/;
                if (!reg.test(this.BindCode)) {
                    this.isError = true;
                    this.noticeText = "";
                } else {
                    this.isError = false;
                }
            },
            getUserPath() {
                getUserPath().then(result => {
                    if (result.code === 200) {
                        const electron = require('electron');
                        const dataPath = (electron.app || electron.remote.app).getPath('userData') + "/";
                        this.userPath = dataPath;
                    }
                }).catch(err => {
                    this.openErrorView(err);
                })
            },
            connect() {
                connectDevice().then(result => {
                    if (result.code === 200) {
                        const res = result.data
                        if (res == constants.RESULT_STATUS_SUCCESS) {
                            this.getUserPath();
                        } else {
                            this.openErrorView(res);
                        }
                    } else {
                        this.openErrorView(result.message);
                    }
                }).catch(err => {
                    this.openErrorView(err);
                })
            },
            activeDevice() {
                setTimeout(() => {
                    activeDevice().then(result => {
                        if (result.code === 200) {

                            if (result.data == constants.RESULT_STATUS_SUCCESS) {
                                //激活成功
                                this.loading1 = false;
                                this.status1 = true;
                                this.showTwo = true;
                                //开始判断是否绑定
                                this.bindDevice();
                            } else {
                                //激活失败
                                this.openErrorView(result.data);
                            }
                        } else {
                            this.openErrorView(result.message);
                        }
                    }).catch(err => {
                        //激活失败
                        this.openErrorView(err);
                    })

                }, 200)

            },
            bindDevice() {
                deviceBindCheck(this.userPath).then(result => {
                    if (result.code === 200) {
                        if (result.data == "" || result.data == null) {
                            //失败的话
                            this.openErrorView("bind fail: null ");
                        } else {
                            if (result.data == constants.BIND_STATUS_STRING_BOUND_OTHER) {
                                //弹出输入框
                                this.bindShow = true;

                            } else if (result.data == constants.BIND_STATUS_STRING_UNBOUND) {
                                //弹出输入框
                                this.bindShow = true;
                                //显示绑定码
                                this.bindDisplay();
                            } else if (result.data == constants.BIND_STATUS_STRING_BOUND_THIS) {
                                this.isCorrect = true;
                                this.showThree = true;
                                this.status3 = true;
                                this.loading3 = true;
                                setTimeout(() => {
                                    //已经绑定
                                    this.loading3 = false;
                                }, 500);
                                setTimeout(() => {
                                    //第三部成功的话
                                    this.$emit("showThree", true);
                                    this.handleClose();
                                }, 1000);
                            } else {
                                //如果其他错误，弹出提示框
                                this.openErrorView(result.data);
                            }
                        }
                    } else {
                        this.openErrorView(result.message);
                    }
                }).catch(err => {
                    //失败的话
                    this.openErrorView(err);
                })

            },
            bindAcquire() {
                this.loading3 = true;
                deviceBindAcquire(this.BindCode).then(result => {
                    if (result.code === 200) {
                        if (result.data == constants.RESULT_STATUS_SUCCESS) {
                            setTimeout(() => {
                                //已经绑定
                                this.loading3 = false;
                            }, 1000);
                            setTimeout(() => {
                                //第三部成功的话
                                this.$emit("showThree", true);
                                this.handleClose();
                            }, 2000);

                        } else {
                            this.openErrorView(result.data);
                        }
                    } else {
                        this.openErrorView(result.message);
                    }
                }).catch(err => {
                    this.openErrorView(err);
                })
            },
            bindDisplay() {
                deviceBindDisplay().then(result => {
                    if (result.code === 200) {
                        if (result.data == constants.RESULT_STATUS_SUCCESS) {

                        } else {
                            this.openErrorView(result.data);
                        }
                    } else {
                        this.openErrorView(result.message);
                    }
                }).catch(err => {
                    this.openErrorView(err);
                })
            },
            checkActiveAndBind() {
                this.connect();
                this.loading1 = true;
                setTimeout(() => {
                    //判断是否已激活
                    if (this.$store.state.activeStatus == "latest") {
                        //激活成功
                        this.loading1 = false;
                        this.status1 = true;
                        this.showTwo = true;
                        //开始判断是否绑定
                        this.bindDevice();
                    } else {
                        this.activeDevice();
                    }
                }, 200);
            },
            handleClose(msg) {
                this.status1 = false;
                this.BindCode = "";
                this.status3 = false;
                this.isCorrect = false;
                this.loading = false;
                this.loading1 = true;
                this.loading3 = false;
                this.showTwo = false;
                this.showThree = false;
                this.isError = false;
                this.$emit("closeCheckBox", msg);
            },
            bind() {
                if (this.isError || !this.BindCode) {
                    this.isError = true;
                    this.noticeText = !this.BindCode ? this.$t('m.stepTwo.bind_code_is_null') : this.$t('m.stepTwo.bind_code_is_correct');
                    return;
                }

                this.connect();
                this.loading = true;
                this.isCorrect = true;
                this.showThree = true;
                this.status3 = true;
                this.loading3 = true;
                setTimeout(() => {
                    this.bindAcquire();
                }, 200);
            },
            openErrorView(msg) {
                this.handleClose(msg);
            },
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
        height: 110px;
    }

    .inputBindCode {
        /*display: flex;*/
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .errorNotice {
        margin-top: -30px;
        font-size: 12px;
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