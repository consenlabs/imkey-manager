<template>
    <el-dialog
            title="Operation Guide"
            :visible.sync="optionOneVisible"
            width="600px"
            @close="handleClose"
            top="10vh"
    >
        <div class="contentBox">
            <h3>特别提示：出现错误</h3>
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


    .text {
        text-align: left;
    }

    h3 {
        text-align: left;
    }

</style>