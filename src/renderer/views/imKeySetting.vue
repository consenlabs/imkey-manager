<template>
    <div class="setKeyPage">
        <div class="routerBar">
            <h2>imKey 设置</h2>
            <p>请在 imKey 上完成以下操作：</p>
            <div>
                <el-steps direction="vertical" :active="active">
                    <el-step title="绑定码"></el-step>
                    <el-step title="创建 / 恢复钱包"></el-step>
                    <el-step title="完成设置"></el-step>
                </el-steps>
            </div>
        </div>
        <div class="routerView">
            <div class="set1" v-if="page==1">
                <h3>生成设备绑定码</h3>
                <div class="nav">
                    <p class="msg">初次绑定将生成设备绑定码，请在 imKey Pro 中查看并妥善备份</p>
                    <p class="course" @click="openUrl">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.8335 2.75H7.3335C8.30596 2.75 9.23859 3.13631 9.92622 3.82394C10.6139 4.51158 11.0002 5.44421 11.0002 6.41667V19.25C11.0002 18.5207 10.7104 17.8212 10.1947 17.3055C9.67898 16.7897 8.97951 16.5 8.25016 16.5H1.8335V2.75Z" stroke="#B8AC95" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M20.1667 2.75H14.6667C13.6942 2.75 12.7616 3.13631 12.0739 3.82394C11.3863 4.51158 11 5.44421 11 6.41667V19.25C11 18.5207 11.2897 17.8212 11.8055 17.3055C12.3212 16.7897 13.0207 16.5 13.75 16.5H20.1667V2.75Z" stroke="#B8AC95" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>新手教程</span>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="7.5" cy="7.5" r="7.5" fill="#B8AC95"/>
                            <path d="M6.5 10.5L9.5 7.5L6.5 4.5" stroke="#FAF8F5"/>
                        </svg>
                    </p>
                </div>
                <p class="careful">注意事项：</p>
                <div class="mattersNeedingAttention">
                    <p>
                        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="3" cy="3" r="2.5" stroke="#8189A7"/>
                        </svg>
                        绑定码用于核实设备与 PC 端的关联关系，请仔细抄写并保管
                    </p>
                    <p>
                        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="3" cy="3" r="2.5" stroke="#8189A7"/>
                        </svg>
                        绑定码在「设置」页面可导出，或通过导入助记词重置 imKey 找回
                    </p>
                    <p>
                        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="3" cy="3" r="2.5" stroke="#8189A7"/>
                        </svg>
                        同一台 imKey Pro 若在不同 PC 端绑定，将使用相同的绑定码
                    </p>
                </div>
                <div class="btnBox">
                    <button class="nextBtn" @click="send({page:2,active:0,isNext:true})">下一步</button>
                </div>
            </div>
            <div class="set2" v-if="page==2">
                <h3>输入设备绑定码</h3>
                <div class="nav">
                    <p class="msg">请输入设备绑定码，以便在当前设备上使用
                    </p>
                    <p class="course" @click="openUrl">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.8335 2.75H7.3335C8.30596 2.75 9.23859 3.13631 9.92622 3.82394C10.6139 4.51158 11.0002 5.44421 11.0002 6.41667V19.25C11.0002 18.5207 10.7104 17.8212 10.1947 17.3055C9.67898 16.7897 8.97951 16.5 8.25016 16.5H1.8335V2.75Z" stroke="#B8AC95" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M20.1667 2.75H14.6667C13.6942 2.75 12.7616 3.13631 12.0739 3.82394C11.3863 4.51158 11 5.44421 11 6.41667V19.25C11 18.5207 11.2897 17.8212 11.8055 17.3055C12.3212 16.7897 13.0207 16.5 13.75 16.5H20.1667V2.75Z" stroke="#B8AC95" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>新手教程</span>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="7.5" cy="7.5" r="7.5" fill="#B8AC95"/>
                            <path d="M6.5 10.5L9.5 7.5L6.5 4.5" stroke="#FAF8F5"/>
                        </svg>
                    </p>
                </div>
                <div class="codeBox">
                    <input type="text" maxlength="1" v-model="code1" @focus="inpFocus($event)" @keyup="inpCode(1,$event)">
                    <input type="text" maxlength="1" v-model="code2" @focus="inpFocus($event)" @keyup="inpCode(2,$event)">
                    <input type="text" maxlength="1" v-model="code3" @focus="inpFocus($event)" @keyup="inpCode(3,$event)">
                    <input type="text" maxlength="1" v-model="code4" @focus="inpFocus($event)" @keyup="inpCode(4,$event)">
                    <input type="text" maxlength="1" v-model="code5" @focus="inpFocus($event)" @keyup="inpCode(5,$event)">
                    <input type="text" maxlength="1" v-model="code6" @focus="inpFocus($event)" @keyup="inpCode(6,$event)">
                    <input type="text" maxlength="1" v-model="code7" @focus="inpFocus($event)" @keyup="inpCode(7,$event)">
                    <input type="text" maxlength="1" v-model="code8" @focus="inpFocus($event)" @keyup="inpCode(8,$event)">
                </div>
                <p class="codeTit" v-if="!codeIsTrue">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z" stroke="#ED766C" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6 4V6" stroke="#ED766C" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6 8H6.005" stroke="#ED766C" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    绑定码错误，请仔细核对，或通过导入助记词重置 imKey 找回
                </p>
                <p class="careful">注意事项：</p>
                <div class="mattersNeedingAttention">
                    <p>
                        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="3" cy="3" r="2.5" stroke="#8189A7"/>
                        </svg>
                        绑定码在「设置」页面可导出，或通过导入助记词重置 imKey 找回
                    </p>
                    <p>
                        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="3" cy="3" r="2.5" stroke="#8189A7"/>
                        </svg>
                        同一台 imKey Pro 若在不同 PC 端绑定，将使用相同的绑定码
                    </p>
                </div>
                <div class="btnBox">
                    <button class="nextBtn" @click="send({page:3,active:1,isNext:true})">下一步</button>
                </div>
            </div>
            <div class="set3" v-if="page==3">
                <h3>设置 PIN 码</h3>
                <div class="nav">
                    <p class="msg">请断开 USB 连接，使用 imKey 进行设置</p>
                    <p class="course" @click="openUrl">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.8335 2.75H7.3335C8.30596 2.75 9.23859 3.13631 9.92622 3.82394C10.6139 4.51158 11.0002 5.44421 11.0002 6.41667V19.25C11.0002 18.5207 10.7104 17.8212 10.1947 17.3055C9.67898 16.7897 8.97951 16.5 8.25016 16.5H1.8335V2.75Z" stroke="#B8AC95" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M20.1667 2.75H14.6667C13.6942 2.75 12.7616 3.13631 12.0739 3.82394C11.3863 4.51158 11 5.44421 11 6.41667V19.25C11 18.5207 11.2897 17.8212 11.8055 17.3055C12.3212 16.7897 13.0207 16.5 13.75 16.5H20.1667V2.75Z" stroke="#B8AC95" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>新手教程</span>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="7.5" cy="7.5" r="7.5" fill="#B8AC95"/>
                            <path d="M6.5 10.5L9.5 7.5L6.5 4.5" stroke="#FAF8F5"/>
                        </svg>
                    </p>
                </div>
                <div class="step">
                    <p>
                        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="3" cy="3" r="2.5" stroke="#8189A7"/>
                        </svg>
                        PIN 码用于解锁 imKey
                    </p>
                    <p>
                        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="3" cy="3" r="2.5" stroke="#8189A7"/>
                        </svg>
                        设置 6-8 位 PIN 码
                    </p>
                    <p>
                        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="3" cy="3" r="2.5" stroke="#8189A7"/>
                        </svg>
                        请勿输入相同或连续数字的 PIN 码
                    </p>
                </div>
                <h3>创建 / 恢复钱包</h3>
                <div class="step">
                    <p>
                        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="3" cy="3" r="2.5" stroke="#8189A7"/>
                        </svg>
                        助记词掌控资产所有权，请妥善私密保管
                    </p>
                    <p>
                        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="3" cy="3" r="2.5" stroke="#8189A7"/>
                        </svg>
                        更换或重置设备，可以使用助记词恢复钱包资产
                    </p>
                    <p>
                        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="3" cy="3" r="2.5" stroke="#8189A7"/>
                        </svg>
                        创建 / 恢复钱包约 2 分钟，请耐心等待
                    </p>
                </div>
                <p class="careful">注意事项：</p>
                <div class="mattersNeedingAttention">
                    <p>
                        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="3" cy="3" r="2.5" stroke="#8189A7"/>
                        </svg>
                        建议选择创建钱包，保障助记词永不联网
                    </p>
                </div>
                <div class="btnBox">
                    <button class="nextBtn" @click="send({page:4,active:2,isNext:true})">下一步</button>
                    <button class="prevBtn" @click="send({page:2,active:0,isNext:false})">上一步</button>
                </div>
            </div>
            <div class="set4" v-if="page==4">
                <h3>完成设置</h3>
                <div class="nav">
                    <p class="msg">恭喜你已完成 imKey 设置，进行最后一步安全检查吧
                    </p>
                    <p class="course" @click="openUrl">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.8335 2.75H7.3335C8.30596 2.75 9.23859 3.13631 9.92622 3.82394C10.6139 4.51158 11.0002 5.44421 11.0002 6.41667V19.25C11.0002 18.5207 10.7104 17.8212 10.1947 17.3055C9.67898 16.7897 8.97951 16.5 8.25016 16.5H1.8335V2.75Z" stroke="#B8AC95" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M20.1667 2.75H14.6667C13.6942 2.75 12.7616 3.13631 12.0739 3.82394C11.3863 4.51158 11 5.44421 11 6.41667V19.25C11 18.5207 11.2897 17.8212 11.8055 17.3055C12.3212 16.7897 13.0207 16.5 13.75 16.5H20.1667V2.75Z" stroke="#B8AC95" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>新手教程</span>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="7.5" cy="7.5" r="7.5" fill="#B8AC95"/>
                            <path d="M6.5 10.5L9.5 7.5L6.5 4.5" stroke="#FAF8F5"/>
                        </svg>
                    </p>
                </div>
                <div class="step">
                    <p>
                        <svg @click="changeStep('step1')" v-if="step1" width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" fill="black" stroke="black" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M7 10.625L10.1154 14L16 8" stroke="white" stroke-width="2"/>
                        </svg>

                        <svg @click="changeStep('step1')" v-else width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" stroke="#C4C9D9" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>确认为本人设置 PIN 码，并已完成备份</span>
                    </p>
                    <p>
                        <svg @click="changeStep('step2')" v-if="step2" width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" fill="black" stroke="black" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M7 10.625L10.1154 14L16 8" stroke="white" stroke-width="2"/>
                        </svg>

                        <svg  @click="changeStep('step2')" v-else width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" stroke="#C4C9D9" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>已离线备份助记词，并知晓助记词的重要性</span>
                    </p>
                    <p>
                        <svg @click="changeStep('step3')" v-if="step3" width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" fill="black" stroke="black" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M7 10.625L10.1154 14L16 8" stroke="white" stroke-width="2"/>
                        </svg>

                        <svg @click="changeStep('step3')" v-else width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" stroke="#C4C9D9" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>已备份设备绑定码，并知晓其作用</span>
                    </p>
                </div>
                <p class="codeTit" v-if="checkTip">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z" stroke="#ED766C" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6 4V6" stroke="#ED766C" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6 8H6.005" stroke="#ED766C" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    为了你的资产安全，请完成所有安全检查项
                </p>
                <div class="btnBox">
                    <button :class="[finish?'':'noFinish']" class="nextBtn" @click="send({page:0,active:0,isNext:false})">完成</button>
                    <button class="prevBtn" @click="send({page:3,active:1,isNext:false})">上一步</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { ipcRenderer } from 'electron'
import constants from '../../common/constants'

export default {
  name: 'imKeySetting',
  data: function () {
    return {
      bindStatus: false,
      bindCode: '',
      active: 0,
      page: 1,
      code1: '',
      code2: '',
      code3: '',
      code4: '',
      code5: '',
      code6: '',
      code7: '',
      code8: '',
      codeIsTrue: true,
      step1: false,
      step2: false,
      step3: false,
      checkTip: true,
      finish: false,
      isBindDisplay: false
    }
  },
  methods: {
    openUrl () {
      ipcRenderer.send('openUrl', 'https://support.imkey.im/')
    },
    send ({ page, active, isNext }) {
      if (page === 0 && active === 0) {
        if (this.finish === true) {
          // 去首页
          this.$router.push('/home/welcomeHome')
        }
      } else {
        if (page === 3 && active === 1 && isNext === false) {
          // 回退上一步恢复之前的选项
          this.step1 = false
          this.step2 = false
          this.step3 = false
          this.finish = false
          this.checkTip = true
          // 跳到上一个界面
          this.active = active
          this.page = page
        }
        if (page === 2 && active === 0 && isNext === false) {
          this.active = active
          this.page = page
        }
        if (page === 2 && isNext === true) {
          // 连接设备，
          // 检查是否激活，如果未激活，就激活。
          // 检查是否绑定，如果未绑定，就再imkey上显示绑定码
          this.connect().then(result => {
            if (result.isSuccess) {
              // 判断是否已激活
              if (this.$store.state.activeStatus === 'latest') {
                // 开始判断是否绑定
                this.bindDevice().then(result => {
                  if (result.isSuccess) {
                    if (result.bindStatus === constants.BIND_STATUS_STRING_BOUND_OTHER) {
                      this.active = active
                      this.page = page
                    } else if (result.bindStatus === constants.BIND_STATUS_STRING_UNBOUND) {
                      // 显示绑定码
                      this.bindDisplay().then(result => {
                        if (result.isSuccess) {
                          this.active = active
                          this.page = page
                        } else {
                        }
                      })
                    } else if (result.bindStatus === constants.BIND_STATUS_STRING_BOUND_THIS) {
                      this.active = active
                      this.page = page
                    } else {

                    }
                  } else {

                  }
                })
              } else {
                this.activeDevice().then(result => {
                  if (result.isSuccess) {
                    // 开始判断是否绑定
                    this.bindDevice().then(result => {
                      if (result.isSuccess) {
                        if (result.bindStatus === constants.BIND_STATUS_STRING_BOUND_OTHER) {
                          this.active = active
                          this.page = page
                        } else if (result.bindStatus === constants.BIND_STATUS_STRING_UNBOUND) {
                          // 显示绑定码
                          this.bindDisplay().then(result => {
                            if (result.isSuccess) {
                              this.active = active
                              this.page = page
                            } else {
                            }
                          })
                        } else if (result.bindStatus === constants.BIND_STATUS_STRING_BOUND_THIS) {
                          this.active = active
                          this.page = page
                        } else {

                        }
                      } else {

                      }
                    })
                  } else {
                  }
                })
              }
            }
          })
          this.firstCheck().then(result => {
            if (result.isSuccess) {
              this.active = active
              this.page = page
            } else {

            }
          })
        }
        if (page === 3 && isNext === true) {
          // 连接设备，
          // 绑定设备，如果失败提示，成功到下一步
          this.connect().then(result => {
            if (result.isSuccess) {
              this.bindAcquire().then(result => {
                if (result.isSuccess) {
                  this.active = active
                  this.page = page
                } else {
                  this.codeIsTrue = false
                }
              })
            } else {
              // 检查绑定失败
            }
          })
        }
        if (page === 4 && isNext === true) {
          // 连接设备，
          // 检查是否创建钱包，如果失败提示，成功到下一步
          this.connect().then(result => {
            if (result.isSuccess) {
              this.checkWalletExist().then(result => {
                if (result.isSuccess) {
                  this.active = active
                  this.page = page
                } else {
                }
              })
            } else {
            }
          })
        }
      }
    },
    inpCode (code, event) {
      this.codeIsTrue = true
      if (code === 8) {
        const bindCode = this.code1 + this.code2 + this.code3 + this.code4 + this.code5 + this.code6 + this.code7 + this.code8
        const reg = /^[a-hj-np-zA-HJ-NP-Z2-9]{8}$/
        if (reg.test(bindCode)) {
          this.bindCode = bindCode
        } else {
          this.codeIsTrue = false
        }
        return
      }
      if (event.srcElement.value.length === 1) {
        event.srcElement.nextElementSibling.focus()
      }
      if (event.keyCode === 8) {
        event.srcElement.previousElementSibling.focus()
      }
    },
    inpFocus () {
      event.srcElement.value = ''
    },
    changeStep (step) {
      this[step] = !this[step]
      if (this.step1 && this.step2 && this.step3) {
        this.finish = true
        this.checkTip = false
      } else {
        this.finish = false
        this.checkTip = true
      }
    },
    connect () {
      return new Promise((resolve) => {
        const result = ipcRenderer.sendSync('connectDevice')
        const response = result.result
        let isTrue
        if (result.isSuccess) {
          if (response === constants.RESULT_STATUS_SUCCESS) {
            isTrue = true
          } else {
            isTrue = false
          }
        } else {
          isTrue = false
        }
        resolve({
          isSuccess: isTrue
        })
      })
    },
    firstCheck () {
      let isTrue
      return new Promise((resolve) => {
        this.connect().then(result => {
          if (result.isSuccess) {
            // 判断是否已激活
            if (this.$store.state.activeStatus === 'latest') {
              // 开始判断是否绑定
              this.bindDevice().then(result => {
                if (result.isSuccess) {
                  isTrue = true
                } else {
                  isTrue = false
                }
              })
            } else {
              this.activeDevice().then(result => {
                if (result.isSuccess) {
                  isTrue = true
                } else {
                  isTrue = false
                }
              })
            }
          }
        })
        resolve({
          isSuccess: isTrue
        })
      })
    },
    activeDevice () {
      return new Promise((resolve) => {
        const result = ipcRenderer.sendSync('activeDevice')
        const response = result.result
        let isTrue
        if (result.isSuccess) {
          if (response === constants.RESULT_STATUS_SUCCESS) {
            isTrue = true
          } else {
            isTrue = false
          }
        } else {
          isTrue = false
        }
        resolve({
          isSuccess: isTrue
        })
      })
    },
    bindDevice () {
      return new Promise((resolve) => {
        const result = ipcRenderer.sendSync('deviceBindCheck', this.$store.state.userPath)
        const response = result.result
        let isTrue
        let bindStatus
        if (result.isSuccess) {
          if (response === '' || response === null) {
            isTrue = false
          } else {
            bindStatus = response
            isTrue = true
          }
        } else {
          isTrue = false
        }
        resolve({
          isSuccess: isTrue,
          bindStatus: bindStatus
        })
      })
    },
    bindAcquire () {
      return new Promise((resolve) => {
        const result = ipcRenderer.sendSync('deviceBindAcquire', this.bindCode)
        const response = result.result
        let isTrue
        if (result.isSuccess) {
          if (response === constants.RESULT_STATUS_SUCCESS) {
            // 绑定成功后存储绑定码
            const result = ipcRenderer.sendSync('importBindCode', this.bindCode)
            if (result.isSuccess) {
              isTrue = true
            } else {
              isTrue = false
            }
          } else {
            isTrue = false
          }
        } else {
          isTrue = false
        }
        resolve({
          isSuccess: isTrue
        })
      })
    },
    bindDisplay () {
      return new Promise((resolve) => {
        const result = ipcRenderer.sendSync('deviceBindDisplay')
        const response = result.result
        let isTrue
        if (result.isSuccess) {
          if (response === constants.RESULT_STATUS_SUCCESS) {
            isTrue = true
          } else {
            isTrue = false
          }
        } else {
          isTrue = false
        }
        resolve({
          isSuccess: isTrue
        })
      })
    },
    checkWalletExist () {
      // 判断是否创建钱包
      return new Promise((resolve) => {
        const result = ipcRenderer.sendSync('getBTCXpub')
        const response = result.result
        let isTrue
        if (result.isSuccess) {
          if (response !== '' || response != null) {
            if (response.match('xpu')) {
              isTrue = true
            } else {
              isTrue = false
            }
          } else {
            isTrue = false
          }
        } else {
          isTrue = false
        }
        resolve({
          isSuccess: isTrue
        })
      })
    }
  }
}
</script>

<style>
    .setKeyPage {
        height: 100%;
        display: flex;
    }
    .setKeyPage .routerBar{
        width: 260px;
        padding-left: 40px;
    }
    .setKeyPage h2{
        font-weight: 600;
        font-size: 18px;
        line-height: 25px;
        color: #000000;
        margin-top: 62px;
    }
    .setKeyPage .routerBar>p{
        margin-top: 60px;
        font-size: 15px;
        line-height: 21px;
    }
    .setKeyPage .routerBar>div{
        margin-top: 26px;
        height: 140px;
        margin-left: 4px;
    }
    .el-step__head.is-wait{
        color: #fff;
        border-color: #ACB1C6;
    }
    #app .el-step__head.is-wait .el-step__icon.is-text{
        background: #ACB1C6;
    }

    .el-step__head.is-finish .el-step__icon.is-text,#app .el-step__head.is-process .el-step__icon.is-text{
        background: #000;
        stroke: #000;
    }
    .el-step__head.is-finish .el-step__icon.is-text,#app .el-step__head.is-finish .el-step__icon.is-text{
        background: #ACB1C6;
        stroke: #ACB1C6;
    }
    .el-step__title.is-finish,.el-step__title.is-process{
        color: #000;
        font-weight: 700;
    }
    .setKeyPage .el-step__line {
        background-color: transparent;
    }
    .setKeyPage .el-step__head.is-finish {
        color:  #ACB1C6;
        border-color:  #ACB1C6;
    }
    .setKeyPage .el-step__title.is-finish {
        color: #ACB1C6;
    }
    .el-step.is-vertical .el-step__line{
        width: 0;
        border-left: 1px dashed  #000;
    }
    .el-step__line-inner{
        border: none !important;
    }
    .setKeyPage .el-step__icon-inner{color:#fff}
    .setKeyPage .routerView{
        box-shadow: 3px 0px 20px rgba(0, 0, 0, 0.06);
        flex: 1;
        padding-left: 38px;
        position: relative;
    }
    .set1,.set2{
        height: 100%;
    }
    .setKeyPage  h3{
        margin-top: 57px;
        font-weight: 600;
        font-size: 24px;
        line-height: 34px;
    }
    .setKeyPage .nav{
        margin-top: 33px;
        width: 800px;
        display: flex;
        justify-content: space-between;
    }
    .setKeyPage .mattersNeedingAttention{
        width: 730px;
        height: 80px;
        background: #FAFAFA;
        border-radius: 4px;
        padding: 30px 35px;
        margin-top: 20px;
        display: block;
        overflow: hidden;
    }
    .setKeyPage .set2 .mattersNeedingAttention{
        height: 49px;
    }
    .setKeyPage .set3 .mattersNeedingAttention{
        height: 21px;
        margin-top: 0;
    }
    .setKeyPage .set3 h3{
        margin-top: 57px;
    }
    .setKeyPage .mattersNeedingAttention p{
        font-size: 15px;
        line-height: 30px;
        color: #8189A7;
    }
    .setKeyPage .btnBox{
        width: 800px;
        height: 90px;
        border-top: 1px solid #F1F2FA;
        position: absolute;
        bottom: 0;
        left: 38px;
        display: block;
        padding-top: 23px;

    }
    .setKeyPage  .nextBtn,.setKeyPage  .prevBtn{
        width: 120px;
        height: 44px;
        background: #2E3035;
        border-radius: 44px;
        color: #FFFFFF;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
        float: right;
    }
    .setKeyPage  .prevBtn{
        background: #fff;
        color: #000;
        margin-right: 20px;
        border: 1px solid #000;
    }
    .setKeyPage  .course{
        width: 177px;
        height: 70px;
        background: #FAF8F6;
        border-radius: 4px;
    }
    .setKeyPage  .msg{
        margin-top: 20px;
        font-size: 15px;
        line-height: 21px;
    }
    .setKeyPage  .course{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .setKeyPage  .course span{
        padding: 0 11px;
    }
    .setKeyPage .careful{
        font-weight: 600;
        font-size: 15px;
        line-height: 21px;
        color: #0E1019;
        margin-top: 80px;
    }
    .set2 .codeBox{
        width: 388px;
        height: 47px;
        margin: 0 -8px;
        display: flex;
    }
    .set2 .codeBox input{
        width: 38px;
        height: 47px;
        border: 0.5px solid #000000;
        box-sizing: border-box;
        margin: 0 8px;
        text-align: center;
        font-style: normal;
        font-weight: normal;
        font-size: 24px;
        line-height: 29px;
    }
    .set2 .codeTit{
        font-size: 12px;
        line-height: 17px;
        color: #EC6D62;
        margin-top: 13px;
    }
    .set4 .codeTit{
        font-size: 12px;
        line-height: 17px;
        color: #EC6D62;
        margin-top: 74px;
    }
    .step {
        margin-top: 10px;

    }
    .step svg{
        vertical-align: middle;
    }
    .step  p{
        font-size: 15px;
        line-height: 30px;
        color: #8189A7;
    }
    .step span{
        margin-left: 24px;
    }
    #app .noFinish{
        background: #E0E0E0;
    }
</style>
