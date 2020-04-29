<template>
    <div class="connectdevice">
        <div class="logoview">
            <img style="height:100px" src="../assets/logo.png" alt="">
            <h2>Get start with yor imKey Pro device</h2>
        </div>
        <div class="bottomBox">
            <div class="selectBox">
                <deviceImage :middle="true" :line="true"></deviceImage>
            </div>
            <div class="textBox">
                <ul>
                    <li>1. Connect the imKey to your Computer</li>
                    <li>2. Click the connect button</li>
                    <li>3. Enter the PIN code on imKey</li>
                    <h5>*If you have not set the pin code of the imKey, you don't need to enter the pin code on
                        imKey</h5>
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
        connect_device,
    } from '../../api/devicemanager'

    export default {
        name: "ConnectDevice",
        data() {
            return {
                one: false,
                two: false,
                connectLoading: false,
                connectText: "Connect"
            };
        },
        components: {
            deviceImage
        },
        methods: {
            check() {
                //连接设备
                this.connect();
                //检查是否处于BL状态，如果是BL状态就更新COS
                this.checkIsBL();
                //检查是否激活
                this.checkIsActive();
                //检查是否绑定
                this.checkIsBind();
                //检查是否是否创建钱包
                this.checkIsCreateWallet();
                //如果都没有问题，就跳转到HOME 界面
                this.router.replace("/index");
            },
            checkIsBL() {
                setTimeout(() => {

                }, 200);
            },
            checkIsActive() {
                setTimeout(() => {

                }, 200);
            },
            checkIsBind() {
                setTimeout(() => {

                }, 200);
            },
            checkIsCreateWallet() {
                setTimeout(() => {

                }, 200);
            },
            connect() {
                this.connectLoading = true;
                this.connectText = "Connectting";
                setTimeout(() => {
                    connect_device().then(result => {

                        if (result.code === 200) {
                            const res = result.data
                            if (res == "true") {
                                console.log("success res " + res)
                                // this.$emit("finsh");
                                // this.connectText="Please wait for a moment,Checking your imKey";
                                this.connectText = "Connect success ";
                            } else {
                                this.$message.warning(result.data);
                                return;
                            }
                        } else {
                            return;
                        }
                    }).catch(err => {
                        return;
                    })
                }, 200);
            },
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
