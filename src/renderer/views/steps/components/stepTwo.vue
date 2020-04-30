<template>
    <div class="stepTwo">
        <NoticeBox  :noticeVisible="noticeVisible"
                    @closeNotice="closeErrorView"></NoticeBox>
        <h2>Active&Bind</h2>
        <p>Please active and bind your imKey </p>
        <div>
            <div class="selectBox">
                <p class="text">
                    <span class="sort">1.</span>
                    <span>Activate your imKey</span>
                </p>
                <!--        <div>-->
                <!--          <el-button-group>-->
                <!--            <el-button :type="yesOneType" @click="changeOneType(1)">Yes</el-button>-->
                <!--            <el-button :type="noOneType" @click="changeOneType(2)">No</el-button>-->
                <!--          </el-button-group>-->
                <!--        </div>-->
            </div>
            <div class="selectBox">
                <p class="text">
                    <span class="sort">2.</span>
                    <span>Bind your imKey</span>
                </p>
                <!--        <div>-->
                <!--          <el-button-group>-->
                <!--            <el-button :type="yesTowType" @click="changeTowType(1)">Yes</el-button>-->
                <!--            <el-button :type="noTowType" @click="changeTowType(2)">No</el-button>-->
                <!--          </el-button-group>-->
                <!--        </div>-->
            </div>
            <div class="selectBox">
                <p class="text">
                    <!--          <span class="sort"></span>-->
                    <span>Start active and bind your imKey</span>
                </p>
                <div>
                    <el-button type="primary" style="width:123px" @click="check">Start</el-button>
                </div>
            </div>
        </div>
        <CheckBox
                :boxVisible="boxVisible"
                @closeCheckBox="closeCheckBox($event)"
                @showTree="toShowTree"
        ></CheckBox>
    </div>
</template>

<script>
    import CheckBox from "./stepTwoDialog";
    import NoticeBox from "@/components/noticeDialog";
    export default {
        name: "Home",
        data() {
            return {
                yesOneType: "primary",
                yesTowType: "primary",
                noOneType: "",
                noTowType: "",
                boxVisible: false,
                noticeVisible:false
            };
        },
        components: {
            CheckBox,
            NoticeBox
        },
        mounted() {
            //禁止主页面滑动
            this.noScroll();
            this.check();
        },
        methods: {
            changeOneType(type) {
                if (type === 1) {
                    this.yesOneType = "primary";
                    this.noOneType = "";
                } else {
                    this.yesOneType = "";
                    this.noOneType = "primary";
                }
            },
            changeTowType(type) {
                if (type === 1) {
                    this.yesTowType = "primary";
                    this.noTowType = "";
                } else {
                    this.yesTowType = "";
                    this.noTowType = "primary";
                }
            },
            check() {
                this.boxVisible = true;
            },
            closeCheckBox(msg) {
                //取消显示进度的窗口，弹出错误窗口
                this.boxVisible = false;
                setTimeout(() => {
                this.openErrorView(msg)
                }, 200)
            },
            toShowTree(val) {
                if (val) {
                    this.$emit("showThree", true);
                } else {
                    this.$emit("finshStatusTwo", "error");
                }
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
    .stepTwo {
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
            line-height: 60px;
            border-radius: 5px;
            border: 1px solid #dcdcdc;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 15px 0;
            padding: 0 15px;

            .text {
                span {
                    display: inline-block;
                    height: 100%;
                    font-size: 16px;
                    margin-top: 60px;
                }

                .sort {
                    color: #409eff;
                    width: 12px;
                }
            }
        }
    }
</style>
