<template>
    <el-dialog
            title="Operation Guide"
            :visible.sync="optionOneVisible"
            width="600px"
            @close="handleClose"
            top="10vh"
    >
        <div class="contentBox">
            <h3>设置方式：</h3>
            <div class="text">
                <ul>
                    <li>1.imKey 的 PIN 码设置要求为 6 - 8 位数字，不支持相同或连续的数字组合。</li>
                    <li>2.imKey 上显示「设置 PIN 」进入设置流程。</li>
                    <li>3.设置每一位的数字，上下按钮切换，点击「OK」确认，点击「C」取消</li>
                </ul>
            </div>
            <div>
                <img class="img" src="../../../assets/one.png" alt="">
            </div>
            <div class="text">
                <ul>
                    <li>4.重复此过程，直到选择了 PIN 码的所有数字。（如果你想设置 6 位 PIN 码，在第 7 位出现「✔️」符号时点击「OK」按钮即可完成设置。如果你想设置 7 位或者 8 位 PIN
                        码，在显示「✔️」符号时，通过切换按钮切换成数字并确认即可。）
                    </li>
                    <li>5.再次输入 PIN 码进行确认</li>
                </ul>
            </div>
            <div>
                <img class="img" src="../../../assets/two.png" alt="">
            </div>
            <h3>安全提示：</h3>
            <div class="text">
                <ul>
                    <li>1.PIN 码用于解锁 imKey，丢失无法找回，请妥善保管；</li>
                    <li>2.不支持相同或连续的数字组合。</li>
                    <li>3.切勿使用随机 PIN 码和第三方工具提供的 PIN 码。</li>
                </ul>
            </div>
            <h3>修改 PIN 码：</h3>
            <div class="text">
                <ul>
                    <li>输入 PIN 开启 imKey，点击「OK」进入钱包设置界面，选择「设置」—「修改 PIN」，输入原 PIN 码进行身份确认，然后重新设置 PIN 码即可。；</li>
                </ul>
            </div>
            <h3>特别提示：为保证钱包资产安全，连续五次输入错误的 PIN 码，imKey 会被强制重置。请用户务必记牢设置的 PIN 码，PIN 码一旦遗失没有任何办法能够重置或者找回。</h3>
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