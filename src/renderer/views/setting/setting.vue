<template>
    <div class="setting">

            <el-dialog
                    title="info"
                    :visible.sync="centerDialogVisible"
                    width="30%"
                    center>
                <span>是否升级软件</span>
                <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="updateSoft">确 定</el-button>
  </span>
            </el-dialog>
        <el-dialog
                title="info"
                :visible.sync="dialogUpdateNow"
                width="30%"
                center>
            <span>是否退出立刻更新</span>
            <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="updateNow">确 定</el-button>
  </span>
        </el-dialog>
        <h1>Setting</h1>
        <p class="notice">
            <span>Setting imKey-desktop</span>
            <span>
        Need Help?
        <i class="el-icon-connection" @click="help"></i>
      </span>
        </p>
        <div class="deviceBox">
            <div class="contentBox">
                <img src="../../assets/logo64.png" style="width:60px;height:70px" alt="">
                <div class="deviceName">
                    <h3>imKey-desktop</h3>
                    <p>imKey-desktop version {{oldVersionData}}</p>
                </div>
            </div>
            <div v-if="!updateSuccess">
                <span class="updateMsg">imKey-desktop version is {{newVersionData}} avaliable</span>

                <el-button type="primary" @click="updateVersion" size="small" :loading="loading" v-if="isUpdate">{{updateBtnTx}}</el-button>

<!--                <div  class="updateMsg" v-if="!updateSuccess">-->
<!--                <el-progress type="circle" :percentage="downloadPercent" width="60px" ></el-progress>-->
<!--                </div>-->
            </div>
        </div>

    </div>
</template>

<script>
    import {ipcRenderer} from 'electron'
     let packagejson = require("../../../../package.json");

    export default {
        name: "setting",
        data() {
            return {
                updateBtnTx:"update",
                centerDialogVisible:false,
                appName: "",
                isSuccess: false,
                oldVersionData: packagejson.version,
                newVersionData: "",
                loading: false,
                updateSuccess: false,
                updateNoticeVisible:false,
                isUpdate:false,
                dialogUpdateNow: false,
                downloading: false,
                hasNewVersion: false,
                noNewVersion: false,
                downloadPercent: 0,
                downloadStatus:"",
                showError: false,
                errorInfo: {},
                versionInfoList: []
            };
        },
        destroyed() {
            // 移除事件监听
            ipcRenderer.removeAllListeners('updateMessage')
            ipcRenderer.removeAllListeners('downloadProgress')
            ipcRenderer.removeAllListeners('isUpdateNow')
        },
        mounted() {
            if (process.env.NODE_ENV === 'production') {
                this.checkForUpdate()
            }
        },
        methods: {

            updateSoft(){
                this.centerDialogVisible=false;
                this.loading = true;
                this.updateBtnTx="updating"
                this.downloadAndUpdate();
            },
            updateVersion() {
                this.centerDialogVisible=true;

            },

            saveVersionInfoList(updateInfo) {
                let versionInfoListOri = this.getVersionInfoList()
                versionInfoListOri.some((item, index, array) => {
                    // 判断是不是已经存在这个版本的信息,如果存在就删除它
                    if (updateInfo.version === item.version) {
                        array.splice(index, 1)
                        return true
                    }
                })
                // 将新的版本信息加入列表中
                versionInfoListOri.push(updateInfo)
                localStorage.setItem('versionInfoList', JSON.stringify(versionInfoListOri))
            },
            downloadAndUpdate() {
                this.downloading = true
                // 开始下载
                ipcRenderer.send('downloadUpdate')
                ipcRenderer.on('downloadProgress', (event, progressObj) => {

                    this.progress = JSON.stringify(progressObj)
                    // console.log(progressObj)
                    this.downloadPercent = progressObj.percent.toFixed(0) || 0
                    // if(this.downloadPercent === 100) { // 这样写为啥不好使呢？
                    this.updateBtnTx="downloading "+this.downloadPercent+"%"
                    if (progressObj.percent === 100) {
                        this.loading = false
                        // 询问是否立即更新
                        this.dialogUpdateNow = true
                    }
                })
            },
            updateNow() {
                this.dialogUpdateNow=false;
                // 立刻退出并更新
                ipcRenderer.send('isUpdateNow')
            },
            checkForUpdate() {
                // 开始检查
                ipcRenderer.send('checkForUpdate')
                // 添加自动更新事件的监听
                ipcRenderer.on('updateMessage', (event, obj) => {
                    if (obj.action === 'updateAva') {
                        this.isUpdate = true
                        this.hasNewVersion = true
                        this.newVersionData=obj.updateInfo.version;
                        this.description = obj.updateInfo.releaseNotes;
                    } else if (obj.action === 'error') {
                        this.showError = true
                        this.errorInfo = obj.errorInfo
                    } else if (obj.action === 'updateNotAva') {
                        // this.noNewVersion = true
                        this.updateSuccess=false;
                    } else {
                        // console.log(text)
                    }
                })
            },

            help() {
                window.open(
                    "https://support.imkey.im/hc/zh-cn/articles/360019656954-如何设置与修改-PIN-码",
                    "_blank",
                    "scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes"
                );
            },
        }
    };
</script>

<style lang="less" scoped>
    .setting {
        padding-top: 60px;
        margin-bottom: 370px;
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

    .el-icon-connection {
        color: blue;
        cursor: pointer;
    }
</style>