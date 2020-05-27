<template>
    <el-dialog
            :title="$t('m.stepThree.operation_guide')"
            :visible.sync="optionOneVisible"
            width="600px"
            @close="handleClose"
            top="10vh"
    >
        <div class="contentBox">
            <h3>{{$t('m.stepThree.how_to_set_pin')}}</h3>
            <div class="text">
                <ul>
                    <li>1.{{$t('m.stepThree.set_pin_1')}}</li>
                    <li>2.{{$t('m.stepThree.set_pin_2')}}</li>
                    <li>3.{{$t('m.stepThree.set_pin_3')}}</li>
                </ul>
            </div>
            <div>
                <img class="img" src="../../../assets/one.png" alt="">
            </div>
            <div class="text">
                <ul>
                    <li>4.{{$t('m.stepThree.set_pin_4')}}</li>
                    <li>5.{{$t('m.stepThree.set_pin_5')}}</li>
                </ul>
            </div>
            <div>
                <img class="img" src="../../../assets/two.png" alt="">
            </div>
            <h3>{{$t('m.stepThree.security_reminders')}}</h3>
            <div class="text">
                <ul>
                    <li>1.{{$t('m.stepThree.security_info_1')}}</li>
                    <li>2.{{$t('m.stepThree.security_info_2')}}</li>
                    <li>3.{{$t('m.stepThree.security_info_3')}}</li>
                </ul>
            </div>
            <h3>{{$t('m.stepThree.how_to_change_PIN')}}</h3>
            <div class="text">
                <ul>
                    <li>{{$t('m.stepThree.change_pin')}}</li>
                </ul>
            </div>
            <h3>{{$t('m.stepThree.special_notes')}}</h3>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "checkBox",
        data() {
            return {};
        },
        props: {optionOneVisible: Boolean},
        methods: {

            handleClose() {
                this.$emit("closeOneBox", false);
            },
        }
    };
</script>

<style lang="less" scoped>
    .contentBox {
        height: 500px;
        overflow: auto;
    }

    .img {
        width: 400px;
        height: auto;
    }

    .text {
        text-align: left;
    }

    h3 {
        text-align: left;
    }

</style>