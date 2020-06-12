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
            </el-steps>
        </div>
        <div>
            <One @showTwo="toShowTwos" v-if="showOne"></One>
            <Two @showThree="toShowThree" v-if="showTwo" @finishStatusTwo="finishStatusTwo($event)"></Two>
            <Three @finish="finish" v-if="showThree"></Three>
        </div>
    </div>
</template>
<script>
    import One from "./components/stepOne";
    import Two from "./components/stepTwo";
    import Three from "./components/stepThree";

    export default {
        name: "step",
        data() {
            return {
                activeIndex: 0,
                showOne: true,
                showTwo: false,
                showThree: false,
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

            finishStatusTwo(val) {
                this.finishStatus = val;
            },
            toShowTwos() {
                this.showOne = false;
                this.showTwo = true;
                this.activeIndex = 1;
            },
            toShowThree() {
                this.showOne = false;
                this.showTwo = false;
                this.showThree = true;
                this.activeIndex = 2;
            },
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
