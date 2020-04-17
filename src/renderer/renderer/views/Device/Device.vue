import {remote} from "electron";import {app} from "electron";
<template>

        <v-layout row>
            <v-flex xs12 d-flex>
<!--        <v-card  >-->

            <div>
                <v-alert type="success" v-show="AlertShow_Success">
                    {{alertmsg}} SUCCESS !
                </v-alert>
                <v-alert type="error" v-show="AlertShow_Error">
                    {{alertmsg}} FAIL !
                </v-alert>
            <v-card-title>
                <v-tab type="info"  class="pt-2">INFO</v-tab>
                <v-divider
                        dark
                        class="my-3"
                >
                </v-divider>
            </v-card-title>
            <v-card-text class="pt-2 title font-weight-medium" >
                    <ul>
                        <div v-for="(value, name) in object" >
                        {{ name }}
                            <p class="text-break"style="max-width: 4rem;"> </p>
                        {{ value }}
                            <p class="text-break"style="max-width: 4rem;"> </p>
                        </div>
                    </ul>
            </v-card-text>
             <v-card-title >
                    <v-tab type="info" >OPRATE</v-tab>
             </v-card-title>
            <v-card-text class="pt-2 title font-weight-medium" >
                <div class="text-center">
                <v-btn color="success" :loading="activeloading" dark class="mb-2" @click="getactiveDevice">ACTIVE</v-btn>
                <v-btn color="primary" :loading="checkloading" dark class="mb-2" @click="getcheckDevice">CHECK</v-btn>
                <v-btn color="info" :loading="bindloading" dark class="mb-2" @click="getbindDevice">BIND</v-btn>
                <v-btn color="error" :loading="cosupdateloading" dark class="mb-2" @click="getcosupdate">COSUPDATE</v-btn>
                </div>
            </v-card-text>
            </div>
<!--        </v-card>-->
            </v-flex>
            <v-dialog v-model="dialogEdit" max-width="600px">
                <v-card>
                    <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-form
                                wrap
                                ref="form"
                                v-model="valid"
                                lazy-validation
                        >
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs12>

                                        <v-text-field label="BINDCODE"
                                                      required :rules="bindCodeRules"
                                                      v-model="BindCode" maxlength='8'></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-container>

                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click="CancelDialogEdit">CANCEL</v-btn>
                        <v-btn color="blue darken-1" flat @click="DeviceBindAcquire">OK</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>
</template>


<script>
    const electron = require('electron');
    const remote = electron.remote;
    import {
        connect_device,
        getSeid,
        getSn,
        getRamSize,
        getFirmwareVersion,
        getBatteryPower,
        getLifeTime,
        getBleName,
        getBleVersion,
        getSdkInfo,
        activeDevice,
        cosUpdate,
        checkDevice,
        deviceBindCheck,
        getUserPath,
        deviceBindDisplay,
        deviceBindAcquire
    } from '../../../api/devicemanager'

    export default {

        data(){
            return{
                divider:true,
                object: {
                    Seid: 'Seid',
                    Sn: 'Sn',
                    RamSize: 'RamSize',
                    FirmwareVersion:'FirmwareVersion',
                },
                AlertShow_Success:false,
                AlertShow_Error:false,
                activeloading:false,
                checkloading:false,
                bindloading:false,
                cosupdateloading:false,
                alertmsg:'',
                userPath:'',
                formTitle:'ENTER THE BINDCODE ON THE DEVICE',
                BindCode:'',
                valid:true,
                dialogEdit:false,
                bindCodeRules: [


                    v => !!v || "BINDCODE IS NULL",
                    v => /^[A-Za-z0-9]+$/.test(v) || "BINDCODE MUST BE NUMBER OR LETTER ",
                    v => v.length > 7 || "BINDCODE LENGTH MUST BE 8 BITS",

                    //
                    // v => v.length <8 || "BINDCODE LENGTH MUST BE 8 BITS"
            ],

            }
        },
        mounted() {
                this.connect();
                this.getUserPath();
                this.getSeid(),
                this.getSn(),
                this.getRamSize(),
                this.getFirmwareVersion()
                // this.getBatteryPower(),
                // this.getLifeTime(),
                // this.getBleName(),
                // this.getBleVersion(),
                // this.getSdkInfo()
                // this.getactiveDevice()
        },
        methods: {
            connect(){
                connect_device().then(result => {
                    if (result.code === 200) {
                        const res = result.data
                        if(res=="true"){
                            console.log("success res"+res)
                        }else{
                            console.log("fail res"+res)
                        }
                    } else {

                    }
                }).catch(err => {

                })
            },
            validatAlphabets(val) {
                const reg = /^[A-Za-z]+$/;
                return reg.test(val);
            },
            getUserPath(){
                getUserPath().then(result => {
                    if (result.code === 200) {
                        this.userPath = result.data;
                        console.log("this.userPath"+this.userPath)
                    }
                }).catch(err => {

                })
            },
            getSeid() {
                getSeid().then(result => {
                    if (result.code === 200) {
                        this.object.Seid = result.data;
                    }
                }).catch(err => {

                })
            },

            getSn() {
                getSn().then(result => {
                    if (result.code === 200) {
                        this.object.Sn = result.data;
                    }
                }).catch(err => {

                })
            },
            getRamSize() {
                getRamSize().then(result => {
                    if (result.code === 200) {
                        this.object.RamSize = result.data;
                    }
                }).catch(err => {

                })
            },
            getFirmwareVersion() {
                getFirmwareVersion().then(result => {
                    if (result.code === 200) {
                        this.object.FirmwareVersion = result.data;
                    }
                }).catch(err => {

                })
            },
            // getBatteryPower() {
            //     getBatteryPower().then(result => {
            //         if (result.code === 200) {
            //             this.object.BatteryPower = result.data;
            //         }
            //     }).catch(err => {
            //
            //     })
            // },
            // getLifeTime() {
            //     getLifeTime().then(result => {
            //         if (result.code === 200) {
            //             this.object.LifeTime = result.data;
            //         }
            //     }).catch(err => {
            //
            //     })
            // },
            // getBleName() {
            //     getBleName().then(result => {
            //         if (result.code === 200) {
            //             this.object.BleName = result.data;
            //         }
            //     }).catch(err => {
            //
            //     })
            // },
            // getBleVersion() {
            //     getBleVersion().then(result => {
            //         if (result.code === 200) {
            //             this.object.BleVersion = result.data;
            //         }
            //     }).catch(err => {
            //
            //     })
            // },
            // getSdkInfo() {
            //     getSdkInfo().then(result => {
            //         if (result.code === 200) {
            //             this.object.SdkInfo = result.data;
            //         }
            //     }).catch(err => {
            //
            //     })
            // },
            getactiveDevice() {
                if (this.activeloading === false) {
                    this.activeloading=true;
                    setTimeout(() => {
                     activeDevice().then(result => {
                         if (result.code === 200) {

                             if (result.data == "true") {
                                 this.alertmsg='ACTIVE';
                                 this.AlertShow_Success = true

                                 setTimeout(() => {
                                     this.alertmsg='ACTIVE';
                                     this.AlertShow_Success = false;
                                 }, 2000)

                             } else {
                                 this.AlertShow_Error = true
                                 setTimeout(() => {
                                     this.alertmsg='ACTIVE';
                                     this.AlertShow_Error = false;
                                 }, 2000)
                             }
                         }
                     }).catch(err => {
                         this.AlertShow_Error = true
                         setTimeout(() => {
                             this.alertmsg='ACTIVE';
                             this.AlertShow_Error = false;
                         }, 2000)
                     })
                        this.activeloading=false;
                }, 200)
                 }
            },
            getcosupdate() {
                if (this.cosupdateloading === false) {
                    this.cosupdateloading=true;
                    setTimeout(() => {
                        cosUpdate().then(result => {
                            if (result.code === 200) {

                                if (result.data == "true") {
                                    this.alertmsg='COS UPDATE';
                                    this.AlertShow_Success = true

                                    setTimeout(() => {
                                        this.alertmsg='COS UPDATE';
                                        this.AlertShow_Success = false;
                                    }, 2000)

                                } else {
                                    this.AlertShow_Error = true
                                    setTimeout(() => {
                                        this.alertmsg='COS UPDATE';
                                        this.AlertShow_Error = false;
                                    }, 2000)
                                }
                            }
                        }).catch(err => {
                            this.AlertShow_Error = true
                            setTimeout(() => {
                                this.alertmsg='COS UPDATE';
                                this.AlertShow_Error = false;
                            }, 2000)
                        })
                        this.cosupdateloading=false;
                    }, 200)
                }
            },
            getcheckDevice() {
                if (this.checkloading === false) {
                    this.checkloading=true;
                    setTimeout(() => {
                    checkDevice().then(result => {
                        if (result.code === 200) {

                            if (result.data == "true") {
                                this.alertmsg='CHECK';
                                this.AlertShow_Success = true

                                setTimeout(() => {
                                    this.alertmsg='CHECK';
                                    this.AlertShow_Success = false;
                                }, 2000)

                            } else {
                                this.alertmsg='CHECK';
                                this.AlertShow_Error = true
                                setTimeout(() => {
                                    this.AlertShow_Error = false;
                                }, 2000)
                            }
                        }
                    }).catch(err => {
                        this.alertmsg='CHECK';
                        this.AlertShow_Error = true
                        setTimeout(() => {
                            this.AlertShow_Error = false;
                        }, 2000)
                    })
                        this.checkloading=false;
                    }, 200)
                }
            },
            getbindDevice() {
                if (this.bindloading === false) {
                    this.bindloading=true;
                    setTimeout(() => {

                        deviceBindCheck(this.userPath).then(result => {
                            if (result.code === 200) {
                                console.log("result.data:"+result.data);
                                if (result.data == "" || result.data ==null) {
                                    this.alertmsg='BIND';
                                    this.AlertShow_Error = true
                                    setTimeout(() => {
                                        this.AlertShow_Error = false;
                                    }, 2000)
                                }else{
                                    if (result.data == "unbound" ) {
                                        //显示绑定码
                                        this.DeviceBindDisplay();

                                    }  else if(result.data == "bound_other"){
                                        //弹出输入框
                                        this.dialogEdit=true;
                                    }else if(result.data == "bound_this"){
                                        this.alertmsg='BIND';
                                        this.AlertShow_Success = true
                                        setTimeout(() => {
                                            this.AlertShow_Success = false;
                                        }, 2000)
                                    }
                                }
                            }
                        }).catch(err => {
                            this.alertmsg='BIND';
                            this.AlertShow_Error = true
                            setTimeout(() => {
                                this.ActiveAlertShow_Error = false;
                            }, 2000)
                            this.bindloading=false;
                        })
                    }, 200)
                    this.bindloading=false;
                }
            },
            CancelDialogEdit() {
                // 重新设置验证结果
                this.valid = true
                this.dialogEdit = false
                this.BindCode='';
                this.bindloading=false;
            },
            DeviceBindAcquire() {
                this.dialogEdit = false;
                this.bindloading=true;
                setTimeout(() => {
                deviceBindAcquire(this.BindCode).then(result => {
                    if (result.code === 200) {

                        if (result.data == "true") {
                            this.alertmsg='BIND';
                            this.AlertShow_Success = true

                            setTimeout(() => {
                                this.AlertShow_Success = false;
                            }, 2000)

                        } else {
                            this.alertmsg='BIND';
                            this.AlertShow_Error = true
                            setTimeout(() => {
                                this.AlertShow_Error = false;
                            }, 2000)
                        }


                    }
                }).catch(err => {
                    this.alertmsg='BIND';
                    this.AlertShow_Error = true
                    setTimeout(() => {
                        this.AlertShow_Error = false;
                    }, 2000)
                })
                    this.bindloading=false;
                }, 200)
            },
            DeviceBindDisplay() {
                    deviceBindDisplay().then(result => {
                        if (result.code === 200) {
                            console.log("deviceBindDisplay:"+result.data)
                            if (result.data == "true") {
                                //弹出输入框
                                this.dialogEdit=true;
                            }else{
                                this.alertmsg='BIND';
                                this.AlertShow_Error = true
                                setTimeout(() => {
                                    this.AlertShow_Error = false;
                                }, 2000)
                            }
                        }
                    }).catch(err => {
                        this.alertmsg='BIND';
                        this.AlertShow_Error = true
                        setTimeout(() => {
                            this.AlertShow_Error = false;
                            this.bindloading=false;
                        }, 2000)
                    })
            },
    }
    }
</script>

<style scoped>



</style>
