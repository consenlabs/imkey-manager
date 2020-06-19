<template>
    <div class="stepOne">
        <NoticeBox :noticeVisible="noticeVisible"
                   @closeNotice="closeErrorView"></NoticeBox>
        <h2>{{$t('m.stepOne.connect_imKey')}}</h2>
        <div>
            <div :class="['selectBox',isTwoChoose?'active':'','deviceBox']" :loading="connectLoading"
                 @click="choose(2)">
                <div class="choose el-icon-check" :loading="connectLoading" v-if="isTwoChoose"></div>
                <p></p>
                <deviceImage :small="true"></deviceImage>
                <p>imKey Pro</p>
            </div>
        </div>
    </div>
</template>

<script>
import deviceImage from '../../../components/deviceImage'
import constants from '../../../../common/constants'
import NoticeBox from '@/components/noticeDialog'
import { ipcRenderer } from 'electron'

export default {
  name: 'Home',
  data () {
    return {
      connectLoading: false,
      isConnect: false,
      isOneChoose: false,
      isTwoChoose: false,
      isTreeChoose: false,
      noticeVisible: false
    }
  },
  destroyed () {
    // 移除事件监听
    ipcRenderer.removeAllListeners('connectDeviceResult')
  },
  components: {
    deviceImage,
    NoticeBox
  },
  mounted () {
    // 禁止主页面滑动
    this.noScroll()
    this.choose(2)
  },
  methods: {
    connect () {
      ipcRenderer.send('connectDevice')
      ipcRenderer.on('connectDeviceResult', (event, result) => {
        event.sender.removeAllListeners('connectDeviceResult')
        const response = result.result
        if (result.isSuccess) {
          if (response === constants.RESULT_STATUS_SUCCESS) {
            this.$emit('showTwo')
          } else {
            this.openErrorView(response)
          }
        } else {
          this.openErrorView(response)
        }
      })
    },
    choose (index) {
      switch (index) {
        case 1:
          this.isOneChoose = true
          this.isTwoChoose = false
          this.isThreeChoose = false
          break
        case 2:
          this.isTwoChoose = true
          this.isOneChoose = false
          this.isThreeChoose = false
          break
        case 3:
          this.isTwoChoose = false
          this.isOneChoose = false
          this.isThreeChoose = true
          break
      }
      this.connectLoading = true
      setTimeout(() => {
        this.connect()
      }, 500)
    },
    openErrorView (msg) {
      this.isOneChoose = false
      this.isTwoChoose = false
      this.connectLoading = false
      this.$store.state.message = msg
      this.noticeVisible = true
    },
    closeErrorView (msg) {
      this.noticeVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
    .stepOne {
        display: flex;
        justify-content: center;
        flex-direction: column;

        .selectBox {
            width: 150px;
            height: 150px;
            border: 1px solid #666666;
            margin: 60px 30px;
            border-radius: 5px;
            position: relative;
            cursor: pointer;

            svg {
                margin-top: 30px;
            }

            .choose {
                position: absolute;
                right: 10px;
                top: 10px;
                background: #409EFF;
                color: white;
                border-radius: 50%;
            }
        }

        > div {
            display: flex;
            justify-content: center;
            margin: 40px 0;
        }

        .active {
            border: 1px solid #409EFF;
        }
    }

    .deviceBox {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
    }
</style>
