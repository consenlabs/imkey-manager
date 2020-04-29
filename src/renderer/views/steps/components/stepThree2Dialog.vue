<template>
    <el-dialog
            title="Operation Guide"
            :visible.sync="optionTwoVisible"
            width="600px"
            @close="handleClose"
            top="10vh"
    >
        <div class="contentBox">
            <h3>创建钱包：</h3>
            <div class="text">
                <ul>
                    <li>1.根据 imKey 界面显示，使用上下按钮移动光标至「创建钱包」，点击 OK。。</li>
                </ul>
            </div>
            <div>
                <img class="img" src="../../../assets/three.png" alt="">
            </div>
            <div class="text">
                <ul>
                    <li>2.阅读提醒后点击 OK 确认</li>
                    <li>3.准确按顺序抄写单词</li>
                </ul>
            </div>
            <div>
                <img class="img" src="../../../assets/four.png" alt="">
            </div>
            <div class="text">
                <ul>
                    <li>4.重复此过程直到 12 个单词全部保存（助记词是恢复钱包的唯一方式，只能在创建钱包的时候备份备份，请务必离线妥善保管）</li>
                </ul>
            </div>
            <div>
                <img class="img" src="../../../assets/five.png" alt="">
            </div>
            <div class="text">
                <ul>
                    <li>5.备份助记词结束后 imKey 会显示「请确认助记词」</li>
                </ul>
            </div>
            <div>
                <img class="img" src="../../../assets/six.png" alt="">
            </div>
            <div class="text">
                <ul>
                    <li>6.上下按钮选择对应位置正确的单词，点击 OK 确认」</li>
                </ul>
            </div>
            <div>
                <img class="img" src="../../../assets/seven.png" alt="">
            </div>
            <div class="text">
                <ul>
                    <li>7.重复此过程直到 12 个单词全部验证」</li>
                    <li>8.验证完成后提示「钱包创建中，预计 2 分钟完成」。创建完成后，即可开始使用。</li>
                </ul>
            </div>
            <div>
                <img class="img" src="../../../assets/eight.png" alt="">
            </div>
            <h3>恢复钱包：</h3>
            <div class="text">
                <ul>
                    <li>1.根据 imKey 界面显示，使用上下按钮移动光标至「恢复钱包」，点击 OK。</li>
                    <li>2.选择要导入助记词的单词数量，imKey 目前支持导入 12、18、24 个单词的助记词。</li>
                    <li>3.选择助记词对应位置单词的字母，上下按钮切换，OK 确认，C 取消。</li>
                    <li>4.重复此操作，直到 imKey 显示可供选择的建议单词，上下按钮移动光标，点击 OK 选择正确的单词。（因为 BIP39 词库的 2048
                        个单词各不相同。每个单词只需要前几位字母即可确定，所以输入前几位字母后即可跳转到选择备选单词界面）
                    </li>
                </ul>
            </div>
            <div>
                <img class="img" src="../../../assets/nine.png" alt="">
            </div>
            <div class="text">
                <ul>
                    <li>5.完成助记词导入后，点击 OK 。开始导入钱包后进入提示界面「钱包恢复中，预计 2 分钟完成」。</li>
                    <li>6.导入完成，即可开始使用。</li>
                </ul>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "checkBox",
        data() {
            return {};
        },
        props: {optionTwoVisible: Boolean},
        methods: {

            handleClose() {
                this.$emit("closeTwoBox", false);
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