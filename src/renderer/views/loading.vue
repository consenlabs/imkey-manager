<template>
    <div class="loading">
        <div class="loadingBox">
            <span class="el-icon-loading"></span>
            <span>页面加载中，请稍等...</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "loading",
        mounted() {
            this.goHome();
        },
        methods: {
            goHome() {
                setTimeout(() => {
                    this.router.replace("/home");
                }, 1500);
            }
        }
    };
</script>

<style lang="less" scoped>
    .loading {
        width: 100%;
        height: 100%;
        text-align: center;
        box-sizing: border-box;
        overflow: hidden;

        .el-icon-loading {
            color: blue;
            font-size: 28px;
        }

        .loadingBox {
            border: 1px solid blue;
            border-radius: 3px;
            width: 300px;
            height: 60px;
            line-height: 60px;
            margin: 0 auto;
            margin-top: 170px;
        }
    }
</style>