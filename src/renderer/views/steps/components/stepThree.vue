<template>
    <div class="stepThree">
        <NoticeBox  :noticeVisible="noticeVisible"
                    @closeNotice="closeErrorView"></NoticeBox>
        <h2>{{$t('m.stepThree.set_pin_create_wallet')}}</h2>
        <p>{{$t('m.stepThree.please_disconnect')}}</p>
        <div>
            <div class="selectBox">
                <div class="text">
                    <span class="sort">1.</span>
                    <span>{{$t('m.stepThree.set_modify_pin')}}</span>
                    <span class="el-icon-link" @click="seeOne"></span>
                </div>
                <div>
                    <el-checkbox v-model="IseeOnes" label></el-checkbox>

                    <!-- <span v-if="IseeOnes" class="el-icon-check"></span>
                    <el-button v-else type="primary" size="small" @click="IseeOne">I See</el-button>-->
                </div>
            </div>
            <div class="selectBox">
                <div class="text">
                    <span class="sort">2.</span>
                    <span>{{$t('m.stepThree.create_wallet')}}</span>
                    <span class="el-icon-link" @click="seeTwo"></span>
                </div>
                <div>
                    <el-checkbox v-model="IseeTwos" label></el-checkbox>

                    <!-- <span v-if="IseeTwos" class="el-icon-check"></span>
                    <el-button v-else type="primary" size="small" @click="IseeTwo">I See</el-button>-->
                </div>
            </div>
            <el-button type="primary" style="width:100%" :loading="nextLoading" @click="connect">{{$t('m.stepThree.next')}}</el-button>
            <!-- <div class="selectBox"> -->

            <!-- <p class="text">
                <span class="sort"></span>
                <span>To Next</span>
              </p>
              <div>
                <el-button type="primary" style="width:123px" @click="next">Next</el-button>
            </div>-->
            <!-- </div> -->
        </div>
        <OptionOne :optionOneVisible="optionOneVisible" @closeOneBox="closeOneBox($event)"></OptionOne>
        <OptionTwo :optionTwoVisible="optionTwoVisible" @closeTwoBox="closeTwoBox($event)"></OptionTwo>
    </div>
</template>

<script>
    import OptionOne from "./stepThreeDialog";
    import OptionTwo from "./stepThree2Dialog";
    import {
        getBTC_Xpub_,
    } from '../../../../api/walletapi'
    import {connect_device, deleteApplet} from "../../../../api/devicemanager";
    import NoticeBox from "@/components/noticeDialog";
    export default {
        name: "Home",
        data() {
            return {
                optionOneVisible: false,
                optionTwoVisible: false,
                IseeOnes: true,
                IseeTwos: true,
                nextLoading: false,
                noticeVisible:false

            };
        },
        components: {
            OptionOne,
            OptionTwo,
            NoticeBox
        },
        mounted() {
            //禁止主页面滑动
            this.noScroll();
            this.connect();
        },
        methods: {
            connect() {
                connect_device().then(result => {
                    if (result.code === 200) {
                        const res = result.data
                        if (res == "true") {
                            this.next();
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
            seeOne() {
                this.optionOneVisible = true;
            },
            seeTwo() {
                this.optionTwoVisible = true;
            },
            next() {
                if (this.IseeOnes && this.IseeTwos) {
                    this.nextLoading = true;
                    //判断是否创建钱包
                    setTimeout(() => {
                        getBTC_Xpub_().then(result => {
                            if (result.code === 200) {
                                console.log("getBTC_Xpub_:" + result.data)
                                if (result.data != "" || result.data != null) {
                                    if (result.data.match("xpu")) {
                                        console.log("getBTC_Xpub_:" + result.data)
                                        // this.$emit("showFour", true);
                                        this.$emit("finish");
                                    } else {
                                        this.openErrorView("please create wallet");
                                    }
                                } else {
                                    this.openErrorView("please create wallet");
                                }
                            }
                        }).catch(err => {
                            this.openErrorView(err);
                        })
                    }, 300);

                } else {
                    this.openErrorView("please click option");
                }

            },
            closeOneBox() {
                this.optionOneVisible = false;
            },
            closeTwoBox() {
                this.optionTwoVisible = false;
            },
            toShowTree() {
                this.$emit("showThree", true);
            },
            IseeOne() {
                this.IseeOnes = true;
            },
            IseeTwo() {
                this.IseeTwos = true;
            },
            openErrorView(msg) {
                this.nextLoading=false;
                this.$store.state.message=msg;
                this.noticeVisible = true;
                this.IseeOnes=false;
                this.IseeTwos=false;
            },
            closeErrorView(msg) {
                this.noticeVisible = false;
            }
        }
    };
</script>
<style lang="less" scoped>
    .stepThree {
        text-align: center;
        width: 600px;
        margin: 0 auto;

        h2 {
            margin: 30px 0;
        }

        p {
            font-size: 18px;
            color: #555555;
            margin-bottom: 60px;
        }

        .selectBox {
            height: 60px;
            box-sizing: border-box;
            border-radius: 5px;
            border: 1px solid #dcdcdc;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 15px 0;
            padding: 0 15px;

            .text {
                display: flex;
                justify-content: flex-start;
                align-items: center;

                span {
                    display: inline-block;
                    height: 100%;
                    font-size: 16px;
                }

                .sort {
                    color: #409eff;
                    width: 12px;
                }
            }
        }
    }

    .el-icon-link {
        margin-left: 10px;
        color: #409eff;
    }

    .el-icon-check {
        color: green;
    }
</style>
