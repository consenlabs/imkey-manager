<template>
    <div class="steps">
        <div class="stepBox">
            <el-steps
                    :space="200"
                    :active="activeIndex"
                    :finish-status="finishStatus"
                    :align-center="true"
            >
                <el-step :title="$t('m.step.connect')"></el-step>
                <el-step :title="$t('m.step.active_bind')"></el-step>
                <el-step :title="$t('m.step.set_pin_create_wallet')"></el-step>
                <!--        <el-step title="PIN code"></el-step>-->
            </el-steps>
        </div>
        <div>
            <One @showTwo="showTwos" v-if="showOne"></One>
            <Two @showThree="toshowThree" v-if="showTwo" @finishStatusTwo="finishStatusTwo($event)"></Two>
            <Three @finish="finish" v-if="showThree"></Three>
            <!--      <Four @finish="finish" v-if="showThree"></Four>-->
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
                title_connect:"",
                title_active_bind:"",
                title_set_pin_create_wallet:"",
                activeIndex: 0,
                showOne: true,
                showTwo: false,
                showThree: false,
                showFour: false,
                finishStatus: "success"
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
            // finishStatusOne(val) {
            //   this.finishStatus = val;
            // },
            finishStatusTwo(val) {
                this.finishStatus = val;
            },
            // finishStatusThree(val) {
            //   this.finishStatus = val;
            // },
            // finishStatusFour(val) {
            //   this.finishStatus = val;
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
            finish() {
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
