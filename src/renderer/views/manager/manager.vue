<template>
    <div class="manager">
        <NoticeBox :noticeVisible="noticeVisible"
                   @closeNotice="closeErrorView"></NoticeBox>
        <h1>{{$t('m.manager.manager')}}</h1>
        <p class="notice">
            <span>{{$t('m.manager.install_uninstall_apps')}}</span>
        </p>
        <div class="deviceBox">
            <div class="contentBox">
                <deviceImage :mini="true" :line="false"></deviceImage>
                <div class="deviceName">
                    <h3>imKey Pro</h3>
                    <p>{{$t('m.manager.firmware_version')}} {{oldVersionData}}</p>
                </div>
            </div>
            <div v-if="updateSuccess">
                <span class="updateMsg">{{$t('m.manager.firmware_is')}} {{newVersionData}} {{$t('m.manager.available')}}</span>
                <el-button type="primary" @click="updateFirmware" size="small" :loading="loading">
                    {{$t('m.manager.update')}}
                </el-button>
            </div>
        </div>
        <div class="appBox">
            <h1>{{$t('m.manager.app_catalog')}}</h1>
            <el-input prefix-icon="el-icon-search" v-model="appName"
                      :placeholder="$t('m.manager.search_app')"></el-input>
            <div class="appContent">
                <div v-for="(item,index) in getApps" :key="item.id" class="appItem">
                    <div class="leftContent">
                        <img :src="item.icon" alt="/"/>
                        <div>
                            <h4>{{item.name}}</h4>
                            <p>{{item.desc}}</p>
                        </div>
                    </div>
                    <div class="rightContent">
                        <div v-if="!isSuccess" class="roate">
                            <span class="el-icon-refresh"></span>
                        </div>
                        <div v-else>
                            <el-button
                                    plain
                                    type="primary"
                                    size="small"
                                    :disabled="item.installDis"
                                    :loading="item.installLoading"
                                    @click="installApp(item,index)"
                            >{{item.buttonTexts}}
                            </el-button>
                            <el-button
                                    type="danger"
                                    size="small"
                                    @click="deleteApp(item,index)"
                                    :disabled="item.deleteDis"
                                    :loading="item.deleteLoading"
                                    class="el-icon-delete"
                            ></el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import deviceImage from '../../components/deviceImage'
import constants from '../../../common/constants'
import {
  connectDevice,
  cosUpdate,
  cosCheckUpdate,
  checkUpdate,
  downloadApplet,
  updateApplet,
  deleteApplet,
  getFirmwareVersion
} from '../../../api/devicemanager'
import NoticeBox from '@/components/noticeDialog'

export default {
  name: 'manager',
  data () {
    return {
      readOnly: {
        type: Boolean,
        default: false
      },
      buttonTexts: '',
      appName: '',
      isSuccess: false,
      oldVersionData: '',
      newVersionData: '',
      updateSuccess: false,
      loading: false,
      apps: [],
      noticeVisible: false,
      isLatest: false,
      updateType: '',
      description: ''
    }
  },
  components: {
    deviceImage,
    NoticeBox
  },
  computed: {
    getApps () {
      let arr = []
      arr = this.appName
        ? this.apps.filter(ele => {
          if (ele.name.match(this.appName)) {
            return ele
          }
        })
        : this.apps
      return arr
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      connectDevice().then(result => {
        if (result.code === 200) {
          const res = result.data
          if (res === constants.RESULT_STATUS_SUCCESS) {
            if (this.$store.state.updateSuccess === false) {
              this.firmwareVersion()
            } else {
              this.updateSuccess = this.$store.state.updateSuccess
              this.oldVersionData = this.$store.state.oldVersionData
              this.newVersionData = this.$store.state.newVersionData
              if (this.$store.state.apps === '' || this.$store.state.apps === null || this.$store.state.apps === []) {
                // 加载应用
                this.getAppsList()
              } else {
                this.apps = this.$store.state.apps
                this.isSuccess = true
              }
            }
          } else {
            this.router.replace('/manager/connect')
          }
        } else {
          this.router.replace('/manager/connect')
        }
      }).catch(err => {
        this.openErrorView(err)
      })
    },
    compareByFirmwareVersion () {
      // 如果cos版本不一致，提示用户更新
      if (this.newVersionData === null || this.newVersionData === '') {
        this.updateSuccess = false
      } else {
        if (this.oldVersionData === this.newVersionData) {
          this.updateSuccess = false
        } else {
          // 显示要更新的按钮
          this.updateSuccess = true
          this.$store.state.updateSuccess = true
          this.$store.state.newVersionData = this.newVersionData
          // 提示更新信息
          this.openErrorView(this.description)
        }
      }
      if (this.$store.state.apps === '' || this.$store.state.apps === null || this.$store.state.apps === []) {
        // 加载应用
        this.getAppsList()
      } else {
        this.apps = this.$store.state.apps
        this.isSuccess = true
      }
    },
    copyArr (arr) {
      return arr.map((e) => {
        if (typeof e === 'object') {
          return Object.assign({}, e)
        } else {
          return e
        }
      })
    },
    firmwareVersion () {
      getFirmwareVersion().then(result => {
        if (result.code === 200) {
          this.oldVersionData = result.data
          this.$store.state.oldVersionData = result.data
          this.toCosCheckUpdate()
        } else {
          this.openErrorView(result.message)
        }
      }).catch(err => {
        this.openErrorView(err)
      })
    },
    toCosCheckUpdate () {
      cosCheckUpdate().then(result => {
        if (result.code === 200) {
          this.newVersionData = result.data.latestCosVersion
          this.isLatest = result.data.isLatest
          this.updateType = result.data.updateType
          this.description = result.data.description
          // 对比COS版本，提示用户是否升级
          this.compareByFirmwareVersion()
        } else {
          this.openErrorView(result.message)
        }
      }).catch(err => {
        this.openErrorView(err)
      })
    },
    updateFirmware () {
      this.loading = true
      setTimeout(() => {
        this.connect()
        cosUpdate().then(result => {
          if (result.code === 200) {
            if (result.data === constants.RESULT_STATUS_SUCCESS) {
              this.loading = false
              this.updateSuccess = false
              this.oldVersionData = this.newVersionData
              // 更新完cos之后需要清除缓存重新加载数据刷新页面
              this.$store.state.updateSuccess = false
              this.$store.state.oldVersionData = ''
              this.$store.state.newVersionData = ''
              this.$store.state.apps = []
              setTimeout(() => {
                this.init()
              }, 200)
            } else {
              this.updateSuccess = true
              this.loading = false
              this.openErrorView(result.data)
            }
          } else {
            this.loading = false
            this.openErrorView(result.message)
          }
        }).catch(err => {
          this.loading = false
          this.openErrorView(err)
        })
      }, 200)
    },
    connect () {
      connectDevice().then(result => {
        if (result.code === 200) {
          const res = result.data
          if (res === constants.RESULT_STATUS_SUCCESS) {
          } else {
            this.router.replace('/manager/connect')
          }
        } else {
          this.router.replace('/manager/connect')
        }
      }).catch(err => {
        this.openErrorView(err)
      })
    },
    getAppsList () {
      checkUpdate().then(result => {
        if (result.code === 200) {
          const appList = []
          const tempAppList = result.data.list
          for (let i = 0; i < tempAppList.length; i++) {
            let buttonTexts
            if (tempAppList[i].buttonTexts === 'update') {
              buttonTexts = this.$t('m.manager.update')
            } else {
              buttonTexts = this.$t('m.manager.install')
            }

            const collection = {
              name: tempAppList[i].name,
              desc: tempAppList[i].desc,
              lastVersion: tempAppList[i].lastVersion,
              id: i,
              installLoading: tempAppList[i].installLoading,
              installDis: tempAppList[i].installDis,
              deleteDis: tempAppList[i].deleteDis,
              deleteLoading: tempAppList[i].deleteLoading,
              icon: tempAppList[i].icon,
              buttonTexts: buttonTexts
            }
            appList.push(collection)
          }
          this.apps = appList
          this.$store.state.apps = appList
          this.isSuccess = true
        } else {
          this.openErrorView(result.message)
        }
      }).catch(err => {
        this.openErrorView(err)
      })
    },

    installApp (item, index) {
      if (this.apps[index].buttonTexts === 'update' || this.apps[index].buttonTexts === '更新') {
        this.updateApp(item, index)
      } else {
        this.apps[index].installLoading = true
        this.apps[index].deleteLoading = false
        setTimeout(() => {
          this.connect()
          downloadApplet(item.name).then(result => {
            if (result.code === 200) {
              if (result.data === constants.RESULT_STATUS_SUCCESS) {
                this.apps[index].deleteDis = false
                this.apps[index].installDis = true
                this.apps[index].installLoading = false
                this.apps[index].desc = this.apps[index].lastVersion
              } else {
                this.apps[index].installLoading = false
                this.openErrorView(result.data)
              }
            } else {
              this.apps[index].installLoading = false
              this.openErrorView(result.message)
            }
          }).catch(err => {
            this.apps[index].installLoading = false
            this.openErrorView(err)
          })
        }, 200)
      }
    },

    updateApp (item, index) {
      this.apps[index].installLoading = true
      this.apps[index].deleteLoading = false
      setTimeout(() => {
        this.connect()
        updateApplet(item.name).then(result => {
          if (result.code === 200) {
            if (result.data === constants.RESULT_STATUS_SUCCESS) {
              this.apps[index].deleteDis = false
              this.apps[index].installDis = true
              this.apps[index].installLoading = false
              this.apps[index].desc = this.apps[index].lastVersion
            } else {
              this.apps[index].installLoading = false
              this.openErrorView(result.data)
            }
          } else {
            this.apps[index].installLoading = false
            this.openErrorView(result.message)
          }
        }).catch(err => {
          this.apps[index].installLoading = false
          this.openErrorView(err)
        })
      }, 200)
    },

    deleteApp (item, index) {
      this.apps[index].deleteLoading = true
      this.apps[index].installLoading = false
      setTimeout(() => {
        this.connect()
        deleteApplet(item.name).then(result => {
          if (result.code === 200) {
            if (result.data === constants.RESULT_STATUS_SUCCESS) {
              this.apps[index].deleteDis = true
              this.apps[index].installDis = false
              this.apps[index].deleteLoading = false
              this.apps[index].desc = ''
            } else {
              this.apps[index].deleteLoading = false
              this.openErrorView(result.data)
            }
          } else {
            this.openErrorView(result.message)
          }
        }).catch(err => {
          this.apps[index].deleteLoading = false
          this.openErrorView(err)
        })
      }, 200)
    },

    openErrorView (msg) {
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
    .manager {
        padding-top: 10px;
        margin-bottom: 100px;
    }

    .contentBox {
        display: flex;
        align-items: center;
    }

    .notice {
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
    }

    .deviceBox {
        height: 100px;
        background: #fff;
        margin: 30px 0;
        padding: 0 30px;
        border-radius: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .updateMsg {
            margin: 0 20px;
        }

        .deviceName {
            margin-left: 10px;

            p {
                color: #dcdcdc;
                margin-top: 10px;
            }
        }
    }

    .appBox {
        .el-input {
            margin: 10px 0;
        }
    }

    .appContent {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;

        .appItem {
            width: 45%;
            height: 70px;
            background: #fff;
            border-radius: 5px;
            margin: 10px 20px;
            box-sizing: border-box;
            padding: 0 20px;
            display: flex;
            align-items: center;

            p {
                color: #dcdcdc;
            }

            img {
                width: 40px;
                height: 40px;
                margin-right: 10px;
            }

            .leftContent,
            .rightContent {
                flex: 1;
            }

            .rightContent {
                text-align: right;

            }

            .leftContent {
                display: flex;
                justify-content: flex-start;
                align-items: center;
            }
        }
    }

    .el-icon-connection {
        color: blue;
        cursor: pointer;
    }
</style>
