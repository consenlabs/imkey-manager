<template>
    <div>
        <div class="bannerBox">
            <img src="../assets/banner.png" alt/>
            <button class="bayBtn" @click="buy()">{{$t('m.home.buy_now')}}</button>
        </div>
        <div id="box" :style="{display:isShow}" align="center">
            <div id="box1">
                <p>
                    <a href="javascript:;" @click="close()" class="close">X</a>
                </p>
                <div :class="{btnBox,active:isActive1}" align="center">
                    <h2>{{$t('m.home.use_imToken_to_buy')}}</h2>
                    <img src="src/renderer/assets/erweimaAliWecat.png" alt/>
                </div>
                <div :class="{btnBox,active:isActive2}" align="center">
                    <h2>{{$t('m.home.use_WeChat_AliPay_to_buy')}}</h2>
                    <img src="src/renderer/assets/erweimaImtoken.png" alt/>
                </div>
                <div class="btnBar">
                    <div :class="{active:isActive1}" @click="btn_wechat_alipay()">{{$t('m.home.WeChat_AliPay')}}</div>
                    <div :class="{active:isActive2}" @click="btn_imtoken()">imToken</div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      isShow: 'none',
      isActive1: true,
      isActive2: false,
      btnBox: 'btnBox'
    }
  },

  methods: {

    close () {
      this.isShow = 'none'
    },
    buy () {
      this.isShow = 'block'
    },
    btn_wechat_alipay () {
      this.isActive1 = false
      this.isActive2 = true
    },
    btn_imtoken () {
      this.isActive1 = true
      this.isActive2 = false
    }
  }
}
</script>

<style lang="less" scoped>
    .bannerBox {
        position: relative;
        overflow: hidden;
        height: 100%;
        width: 100%;
    }

    .bayBtn {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 57%;
        left: 6%;
        border-radius: 30px;
        background: #000;
        color: #fff;
        text-align: center;
        width: 145px;
        height: 48px;
        line-height: 48px;
        border: none;
        outline: none;
        cursor: pointer;
    }

    #box {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        position: fixed;
        top: 0;
        left: 0;
    }

    #box1 {
        width: 400px;
        height: 480px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -200px;
        margin-top: -240px;
        background: #fff;
        border-radius: 10px;
    }

    .btnBox {
        display: none;
    }

    .btnBox.active {
        display: block;
    }

    .close {
        text-decoration: none;
        float: right;
        font-size: 30px;
        color: #e1e1e1;
        margin-right: 16px;
    }

    #box1 > p {
        height: 40px;
    }

    #box1 h2 {
        text-align: center;
        font-size: 18px;
        margin-top: -22px;
        font-weight: normal;
    }

    #box1 img {
        width: 260px;
        height: 260px;
        margin: 20px 0 0 8px;
    }

    .btnBar {
        display: flex;
        justify-content: center;
        align-items: center;
        display: flex;
        height: 60px;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
    }

    .btnBar div {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        color: #262f2e;
        height: 60px;
        line-height: 60px;
        cursor: pointer;
    }

    .btnBar div:first-child {
        border-radius: 0 0 0 10px;
    }

    .btnBar div:last-child {
        border-radius: 0 0 10px 0;
    }

    .btnBar .active {
        background: #ebebeb;
    }
</style>
