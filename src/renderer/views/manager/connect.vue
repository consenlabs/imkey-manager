<template>
    <div class="connect" style="-webkit-user-select: none;-webkit-app-region: drag">
        <NoticeBox :noticeVisible="noticeVisible"
                   @closeNotice="closeErrorView"></NoticeBox>
        <h1 class="deviceImg">
            <deviceImage :large="true"></deviceImage>
        </h1>
        <h1>{{$t('m.connect.connect_imKey')}}</h1>
        <p class="sideTtile">{{$t('m.connect.follow_steps')}}</p>
        <div class="deviceBox">
            <ul>
                <li :class="activeOne?'active':''">
          <span>
            <i class="el-icon-setting"></i>
            {{$t('m.connect.connect_imKey_to_computer')}}
          </span>
                </li>
                <li :class="activeTwo?'active':''">
          <span>
            <i class="el-icon-news"></i>
            {{$t('m.connect.click_connect')}}
          </span>
                </li>
                <li :class="activeThree?'active':''">
          <span>
            <i class="el-icon-set-up"></i>
            {{$t('m.connect.enter_pin_imKey')}}
          </span>
                </li>
            </ul>
            <el-button type="primary" @click="connect" :loading="connectLoading" style="width:100%">
                {{$t('m.connect.connect')}}
            </el-button>
        </div>
    </div>
</template>

<script>
import deviceImage from '../../components/deviceImage'
import constants from '../../../common/constants'
import {
  connectDevice
} from '../../../api/devicemanager'
import NoticeBox from '@/components/noticeDialog'

export default {
  name: 'connect',
  data () {
    return {
      connectLoading: false,
      activeOne: false,
      activeTwo: false,
      activeThree: false,
      noticeVisible: false
    }
  },
  components: {
    deviceImage,
    NoticeBox
  },
  mounted () {
  },
  methods: {
    connect () {
      this.connectLoading = true
      setTimeout(() => {
        connectDevice().then(result => {
          if (result.code === 200) {
            const res = result.data
            if (res === constants.RESULT_STATUS_SUCCESS) {
              console.log('success res ' + res)
              this.router.replace('/manager/device')
            } else {
              this.openErrorView(res)
            }
          } else {
            this.openErrorView(result.message)
          }
        }).catch(err => {
          this.openErrorView(err)
        })
      }, 200)
    },
    openErrorView (msg) {
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
    .connect {
        padding-top: 10px;
        width: 600px;
        margin: 0 auto;
        margin-bottom: 30px;
        text-align: center;
    }

    h1 {
        font-size: 20px;
        margin: 10px 0 20px;
    }

    .sideTtile {
        margin: 0 0 40px;
        color: #666666;
    }

    .deviceBox {
        width: 600px;

        ul {
            li {
                height: 60px;
                line-height: 60px;
                border: 1px solid #dcdcdc;
                border-radius: 5px;
                margin: 10px 0;
                font-size: 16px;
                display: flex;
                justify-content: space-between;
                padding: 0 20px;
                align-items: center;
                cursor: pointer;

                i {
                    margin-right: 10px;
                }

                .el-icon-close {
                    color: tomato;
                }
            }
        }

        .active {
            border: 1px solid #409eff;
            border-radius: 5px;
        }
    }

    .deviceImg {
        display: flex;
        justify-content: center;
        height: 200px;
    }
</style>
