<template>
    <div class="stepThree">
        <NoticeBox :noticeVisible="noticeVisible"
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
                    <el-checkbox v-model="isSeeOne" label></el-checkbox>
                </div>
            </div>
            <div class="selectBox">
                <div class="text">
                    <span class="sort">2.</span>
                    <span>{{$t('m.stepThree.create_wallet')}}</span>
                    <span class="el-icon-link" @click="seeTwo"></span>
                </div>
                <div>
                    <el-checkbox v-model="isSeeTwos" label></el-checkbox>
                </div>
            </div>
            <el-button type="primary" style="width:100%" :loading="nextLoading" @click="connect">
                {{$t('m.stepThree.next')}}
            </el-button>
        </div>
        <OptionOne :optionOneVisible="optionOneVisible" @closeOneBox="closeOneBox($event)"></OptionOne>
        <OptionTwo :optionTwoVisible="optionTwoVisible" @closeTwoBox="closeTwoBox($event)"></OptionTwo>
    </div>
</template>

<script>
    import OptionOne from './stepThreeDialog'
    import OptionTwo from './stepThree2Dialog'
    import constants from '../../../../common/constants'
    import {
        getBTCXpub
    } from '../../../../api/walletapi'
    import {connectDevice} from '../../../../api/devicemanager'
    import NoticeBox from '@/components/noticeDialog'

    export default {
        name: 'Home',
        data() {
            return {
                optionOneVisible: false,
                optionTwoVisible: false,
                isSeeOne: true,
                isSeeTwos: true,
                nextLoading: false,
                noticeVisible: false
            }
        },
        components: {
            OptionOne,
            OptionTwo,
            NoticeBox
        },
        mounted() {
            // 禁止主页面滑动
            this.noScroll()
            this.connect()
        },
        methods: {
            connect() {
                connectDevice().then(result => {
                    if (result.code === 200) {
                        const res = result.data
                        if (res === constants.RESULT_STATUS_SUCCESS) {
                            this.checkWalletExist()
                        } else {
                            this.openErrorView(res)
                        }
                    } else {
                        this.openErrorView(result.message)
                    }
                }).catch(err => {
                    this.openErrorView(err)
                })
            },
            seeOne() {
                this.optionOneVisible = true
            },
            seeTwo() {
                this.optionTwoVisible = true
            },
            checkWalletExist() {
                if (this.isSeeOne && this.isSeeTwos) {
                    this.nextLoading = true
                    // 判断是否创建钱包
                    setTimeout(() => {
                        getBTCXpub().then(result => {
                            if (result.code === 200) {
                                if (result.data !== '' || result.data != null) {
                                    if (result.data.match('xpu')) {
                                        this.$emit('finish')
                                    } else {
                                        this.openErrorView('please create wallet')
                                    }
                                } else {
                                    this.openErrorView('please create wallet')
                                }
                            }
                        }).catch(err => {
                            this.openErrorView(err)
                        })
                    }, 300)
                } else {
                    this.openErrorView('please click option')
                }
            },
            closeOneBox() {
                this.optionOneVisible = false
            },
            closeTwoBox() {
                this.optionTwoVisible = false
            },
            toShowThree() {
                this.$emit('showThree', true)
            },
            openErrorView(msg) {
                this.nextLoading = false
                this.$store.state.message = msg
                this.noticeVisible = true
                this.isSeeOne = false
                this.isSeeTwos = false
            },
            closeErrorView(msg) {
                this.noticeVisible = false
            }
        }
    }
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
