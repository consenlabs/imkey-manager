<template>
    <v-layout row>
        <v-flex xs12 d-flex>
            <v-card>

                <v-card-title>
                    <v-text-field
                            v-model="search"
                            append-icon="search"
                            label="Search Name"
                            single-line
                            hide-details
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn color="success" :loading="searchLoading" dark class="mb-2" @click="serach">Search</v-btn>
                </v-card-title>
                <v-card-text class="pt-0 title font-weight-bold">
                    <v-data-table
                            v-model="selected"
                            :headers="headers"
                            :items="desserts"
                            :total-items="totalDesserts"
                            :pagination.sync="pagination"
                            :loading="loading"
                            select-all
                            item-key="id"
                            class="elevation-1">

                        <template v-slot:items="props">

                                <td width="50">
                                    <v-checkbox
                                            :input-value="props.selected"
                                            primary
                                            hide-details
                                    ></v-checkbox>
                                </td>
                                <td>{{ props.item.name }}</td>
                                <td>{{ props.item.version}}</td>

                            <td class="text-xs-right"  v-if ="props.item.version !='none'" v-show=true>
                                    <v-btn fab small color="error"  :loading="editedIndex==desserts.indexOf(props.item) ? true : false" @click="deleteItem(props.item)">
                                        <v-icon>clear</v-icon>
                                    </v-btn>
                            </td>
                            <td class="text-xs-right"  v-else v-show=true>
                            <v-btn fab small color="success" :loading="editedIndex==desserts.indexOf(props.item) ? true : false" @click="editItem(props.item)">
                             <v-icon>add</v-icon>
                            </v-btn>
                            </td>
                        </template>
                        <template v-slot:no-data>
                            <v-alert :value="showNoData" color="error" icon="warning">
                                {{noDataMessage ? noDataMessage : 'Sorry, nothing to display here :('}}
                            </v-alert>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-flex>

    </v-layout>
</template>

<script>
    import {
        deleteApplet,
        downloadApplet,
        getAppList
    } from '../../../api/devicemanager'
    export default {
        data() {
            return {
                // 表格相关
                loading: true,
                showNoData: false,
                totalDesserts: 0,
                desserts: [],
                headers: [
                    {text: 'Name', value: 'name', align: 'left', sortable: true},
                    {text: 'Version', value: 'version', align: 'left', sortable: true},
                    {text: 'Actions', value: 'id', align: 'right', sortable: false}
                ],
                noDataMessage: '',
                search: '',
                pagination: {
                    sortBy: 'name'
                },
                selected: [],
                dialogDeleteBatch: false,
                // 表单相关
                searchLoading:false,
                deleteLoading:false,
                addLoading:false,
                dialogDelete: false,
                dialogEdit: false,
                valid: true,
                submitResult: false,
                editedIndex: -1,
                defaultItem: {
                    name: '',
                    version: ''
                },
                editedItem: {
                    name: '',
                    version: '',
                    addLoading:false,
                    deleteLoading:false
                },

                AlertShow_Success:false,
                AlertShow_Error:false,
                alertmsg:'',
            }
        },
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
            },
        },
        watch: {
            pagination: {
                handler() {
                    this.initialize()
                },
                deep: true
            },
            // dialogEdit: {
            //     handler(val) {
            //         val || this.closeDialogEdit()
            //     }
            // },

        },
        mounted() {
            this.initialize()
        },
        methods: {
            toggleAll() {
                if (this.selected.length) this.selected = []
                else this.selected = this.desserts.slice()
            },
            changeSort(column) {
                if (this.pagination.sortBy === column) {
                    this.pagination.descending = !this.pagination.descending
                } else {
                    this.pagination.sortBy = column
                    this.pagination.descending = false
                }
            },
            serach(){
                this.searchLoading=true;
                setTimeout(() => {
                    this.initialize()
                }, 200)

                this.searchLoading=false;
            },
            initialize() {
                this.showNoData = false
                this.loading = true

                // 排序是可以没有的，如果想强制至少一列总是被排序的，
                // 而不是在升序（sorted ascending）/降序（sorted descending）/不排序（unsorted）的状态之间切换请添加 must-sort = true
                const {sortBy, descending, page, rowsPerPage} = this.pagination
                let whereAttrs = {name: this.search}
                // const filterFun = (o => {
                //     // 模糊查询
                //     return o.name.match(whereAttrs.name)
                // })
                const filterFun ="";
                getAppList().then(result => {
                    if (result.code === 200) {
                        const items = result.data.list
                        const total = result.data.total

                        // setTimeout(() => {
                        this.loading = false
                        this.desserts = items
                        this.totalDesserts = total
                        // }, 1000)
                    } else {
                        this.loading = false
                        this.showNoData = true
                        this.noDataMessage = result.message
                    }
                }).catch(err => {
                    this.loading = false
                    this.showNoData = true
                    this.noDataMessage = err.message
                })
            },

            editItem(item) {
                this.editedIndex = this.desserts.indexOf(item)
                console.log("this.editedIndex："+this.editedIndex)
                this.editedItem = Object.assign({}, item)
                //下载应用
                this.editedItem.addLoading=false;
                    if (this.editedItem.addLoading === false) {
                        this.editedItem.addLoading=true;
                        setTimeout(() => {

                            downloadApplet(this.editedItem.name).then(result => {
                                if (result.code === 200) {

                                    if (result.data == "true") {
                                        this.alertmsg= this.editedItem.name +'DOWNLOAD';
                                        this.AlertShow_Success = true

                                        setTimeout(() => {
                                            this.alertmsg=this.editedItem.name +'DOWNLOAD';
                                            this.AlertShow_Success = false;
                                        }, 2000)
                                        this.initialize();
                                    } else {
                                        this.AlertShow_Error = true
                                        setTimeout(() => {
                                            this.alertmsg=this.editedItem.name +'DOWNLOAD';
                                            this.AlertShow_Error = false;
                                        }, 2000)
                                    }
                                }
                            }).catch(err => {
                                this.AlertShow_Error = true
                                setTimeout(() => {
                                    this.alertmsg=this.editedItem.name +'DOWNLOAD';
                                    this.AlertShow_Error = false;
                                }, 2000)
                            })
                            this.editedItem.addLoading=false;
                            this.editedIndex = -1;
                        }, 200)
                    }
                
            },
            deleteItem(item) {
                this.editedIndex = this.desserts.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.editedItem.deleteLoading=false;
                console.log("afafsfsa"+this.editedItem.deleteLoading)
                //删除应用
                if (this.editedItem.deleteLoading === false) {

                    this.editedItem.deleteLoading=true;
                    setTimeout(() => {
                        deleteApplet(this.editedItem.name).then(result => {
                            if (result.code === 200) {

                                if (result.data == "true") {
                                    this.alertmsg= this.editedItem.name +'DELETE';
                                    this.AlertShow_Success = true

                                    setTimeout(() => {
                                        this.alertmsg=this.editedItem.name +'DELETE';
                                        this.AlertShow_Success = false;
                                    }, 2000)
                                    this.initialize();
                                } else {
                                    this.AlertShow_Error = true
                                    setTimeout(() => {
                                        this.alertmsg=this.editedItem.name +'DELETE';
                                        this.AlertShow_Error = false;
                                    }, 2000)
                                }
                            }
                        }).catch(err => {
                            this.AlertShow_Error = true
                            setTimeout(() => {
                                this.alertmsg=this.editedItem.name +'DELETE';
                                this.AlertShow_Error = false;
                            }, 2000)
                        })
                        this.editedItem.deleteLoading=false;
                        this.editedIndex = -1;
                    }, 200)
                }
            },

            closeDialogEdit() {
                // // 重新设置验证结果
                // this.valid = true
                // this.dialogEdit = false
                // setTimeout(() => {
                //     this.editedItem = Object.assign({}, this.defaultItem)
                //     this.editedIndex = -1
                // }, 300)
            },

            closeDialogDelete() {
                // this.dialogDelete = false
                // setTimeout(() => {
                //     this.editedItem = Object.assign({}, this.defaultItem)
                //     this.editedIndex = -1
                // }, 300)
            },

        }
    }
</script>

<style scoped>
    .v-sheet--offset {
        top: -15px;
        left: 15px;
        position: relative;
        align-items: center;
        justify-content: center;
        display: flex;
    }
</style>
