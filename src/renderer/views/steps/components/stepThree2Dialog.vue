<template>
    <el-dialog
            :title="$t('m.stepThree.operation_guide')"
            :visible.sync="optionTwoVisible"
            width="600px"
            @close="handleClose"
            top="10vh"
    >
        <div class="contentBox">
            <h3>{{$t('m.stepThree.create_a_wallet')}}</h3>
            <div class="text">
                <ul>
                    <li>1.{{$t('m.stepThree.create_a_wallet_1')}}</li>
                </ul>
            </div>
            <div>
                <img class="img" src="../../../assets/three.png" alt="">
            </div>
            <div class="text">
                <ul>
                    <li>2.{{$t('m.stepThree.create_a_wallet_2')}}</li>
                    <li>3.{{$t('m.stepThree.create_a_wallet_3')}}</li>
                </ul>
            </div>
            <div>
                <img class="img" src="../../../assets/four.png" alt="">
            </div>
            <div class="text">
                <ul>
                    <li>4.{{$t('m.stepThree.create_a_wallet_4')}}</li>
                </ul>
            </div>
            <div>
                <img class="img" src="../../../assets/five.png" alt="">
            </div>
            <div class="text">
                <ul>
                    <li>5.{{$t('m.stepThree.create_a_wallet_5')}}</li>
                </ul>
            </div>
            <div>
                <img class="img" src="../../../assets/six.png" alt="">
            </div>
            <div class="text">
                <ul>
                    <li>6.{{$t('m.stepThree.create_a_wallet_6')}}</li>
                </ul>
            </div>
            <div>
                <img class="img" src="../../../assets/seven.png" alt="">
            </div>
            <div class="text">
                <ul>
                    <li>7.{{$t('m.stepThree.create_a_wallet_7')}}</li>
                    <li>8.{{$t('m.stepThree.create_a_wallet_8')}}</li>
                </ul>
            </div>
            <div>
                <img class="img" src="../../../assets/eight.png" alt="">
            </div>
            <h3>{{$t('m.stepThree.recover_wallet')}}</h3>
            <div class="text">
                <ul>
                    <li>1.{{$t('m.stepThree.recover_wallet_1')}}</li>
                    <li>2.{{$t('m.stepThree.recover_wallet_2')}}</li>
                    <li>3.{{$t('m.stepThree.recover_wallet_3')}}</li>
                    <li>4.{{$t('m.stepThree.recover_wallet_4')}}</li>
                </ul>
            </div>
            <div>
                <img class="img" src="../../../assets/nine.png" alt="">
            </div>
            <div class="text">
                <ul>
                    <li>5.{{$t('m.stepThree.recover_wallet_5')}}</li>
                    <li>6.{{$t('m.stepThree.recover_wallet_6')}}</li>
                </ul>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    export default {
      name: 'checkBox',
      data () {
        return {}
      },
      props: {optionTwoVisible: Boolean},
      methods: {

        handleClose () {
          this.$emit('closeTwoBox', false)
        }
      }
    }
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