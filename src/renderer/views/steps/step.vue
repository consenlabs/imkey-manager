<template>
    <div class="steps">
        <div class="stepBox">
            <el-steps
                    :space="200"
                    :active="activeIndex"
                    :finish-status="finshStatus"
                    :align-center="true"
            >
                <el-step title="Connect"></el-step>
                <el-step title="Active&Bind"></el-step>
                <el-step title="Set PIN&Create Wallet"></el-step>
                <!--        <el-step title="PIN code"></el-step>-->
            </el-steps>
        </div>
        <div>
            <One @showTwo="showTwos" v-if="showOne"></One>
            <Two @showThree="toshowThree" v-if="showTwo" @finshStatusTwo="finshStatusTwo($event)"></Two>
            <Three @finsh="finsh" v-if="showThree"></Three>
            <!--      <Four @finsh="finsh" v-if="showThree"></Four>-->
        </div>
    </div>
</template>
<script>
    import One from "./components/stepOne";
    import Two from "./components/stepTwo";
    import Three from "./components/stepThree";
    import Four from "./components/stepFour";

    export default {
        name: "step",
        data() {
            return {
                activeIndex: 0,
                showOne: true,
                showTwo: false,
                showThree: false,
                showFour: false,
                finshStatus: "success"
            };
        },
        mounted() {
            this.showStep();
        },
        components: {
            One,
            Two,
            Three,
            // Four
        },
        methods: {
            showStep() {
                let index = this.$route.query.index;
                switch (index) {
                    case 1:
                        this.showOne = true;
                        break;
                    case 2:
                        this.showOne = false;
                        this.showTwo = true;
                        this.activeIndex = 1;
                        break;
                    case 3:
                        this.showOne = false;
                        this.showTwo = false;
                        this.showThree = true;
                        this.activeIndex = 2;
                        break;
                }
            },
            // finshStatusOne(val) {
            //   this.finshStatus = val;
            // },
            finshStatusTwo(val) {
                this.finshStatus = val;
            },
            // finshStatusThree(val) {
            //   this.finshStatus = val;
            // },
            // finshStatusFour(val) {
            //   this.finshStatus = val;
            // },
            showTwos() {
                this.showOne = false;
                this.showTwo = true;
                this.activeIndex = 1;
            },
            toshowThree() {
                this.showOne = false;
                this.showTwo = false;
                this.showThree = true;
                this.activeIndex = 2;
            },
            // showFours() {
            //   this.showOne = false;
            //   this.showTwo = false;
            //   this.showThree = false;
            //   this.showFour = true;
            //   this.activeIndex = 3;
            // },
            finsh() {
                setTimeout(() => {
                    this.router.replace("/index");
                }, 1000);
            }
        }
    };
</script>
<style lang="less" scoped>
    .steps {
        text-align: center;

        .stepBox {
            width: 80%;
            margin: 80px auto;
        }

        .el-step {
            flex-basis: 500px !important;
        }
    }
</style>
