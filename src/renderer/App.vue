<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script></script>
<style type="text/css" lang="scss">
    *{
        padding: 0;
        margin: 0;
    }
    html{
        font-family: PingFang SC;
    }
    html,body,#app{
        height: 100%;
        overflow: hidden;
        min-width: 1440px;
        min-height: 862px;
    }
    button{
        outline: none;
        border: none;
        cursor: pointer;
    }
    /*!*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*!*/
    /*::-webkit-scrollbar {*/
    /*    width: 2px; !*滚动条宽度*!*/
    /*    !*height: 2px;  !*滚动条高度*!*!*/
    /*}*/

    /*!*定义滚动条轨道 内阴影+圆角*!*/
    /*::-webkit-scrollbar-track {*/
    /*    !*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);*!*/
    /*    !*border-radius: 10px;  !*滚动条的背景区域的圆角*!*!*/
    /*    !*background-color: red;!*滚动条的背景颜色*!*!*/
    /*}*/

    /*!*定义滑块 内阴影+圆角*!*/
    /*::-webkit-scrollbar-thumb {*/
    /*    border-radius: 99px; !*滚动条的圆角*!*/
    /*    !*-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);*!*/
    /*    !*background-color: green;  !*滚动条的背景颜色*!*!*/
    /*}*/

</style>
