<template>
    <el-dialog
            title="info"
            :visible.sync="noticeVisible"
            width="550px"
            :show-close="false"
            center
    >
        <div slot="title" class="header-title">
            <span v-show="name" class="title-name">{{ name }}</span>
        </div>
        <div class="body">
            <p>{{Message}}</p>
        </div>
        <span slot="footer">
      <el-button type="primary" @click="sure" size="small">ok</el-button>
    </span>
    </el-dialog>
</template>

<script>
export default {
  name: 'notice',
  props: { noticeVisible: Boolean },
  data () {
    return {
      name: this.$t('m.noticeDialog.info'),
      Message: ''
    }
  },

  watch: {
    noticeVisible () {
      if (this.noticeVisible) {
        // 判断错误信息，转程i18n
        if (this.$store.state.message === 'Decoding failed') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.decoding_failed')
        } else if (this.$store.state.message === 'imkey publickey mismatch with path') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_publickey_mismatch_with_path')
        } else if (this.$store.state.message === 'imkey illegal param') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_illegal_param')
        } else if (this.$store.state.message === 'get seid error') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.get_seid_error')
        } else if (this.$store.state.message === 'get sn error') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.get_sn_error')
        } else if (this.$store.state.message === 'get ram size error') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.get_ram_size_error')
        } else if (this.$store.state.message === 'get firmware version error') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.get_firmware_version_error')
        } else if (this.$store.state.message === 'get battery power error') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.get_battery_power_error')
        } else if (this.$store.state.message === 'get life time error') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.get_life_time_error')
        } else if (this.$store.state.message === 'get ble name error') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.get_ble_name_error')
        } else if (this.$store.state.message === 'get ble version error') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.get_ble_version_error')
        } else if (this.$store.state.message === 'parse arguments to str') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.parse_arguments_to_str')
        } else if (this.$store.state.message === 'decode imkey api') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.decode_imkey_api')
        } else if (this.$store.state.message === 'encode error') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.encode_error')
        } else if (this.$store.state.message === 'device connect interface not called') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.device_connect_interface_not_called')
        } else if (this.$store.state.message === 'device data read time out') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.device_data_read_time_out')
        } else if (this.$store.state.message === 'imkey device not connect') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_device_not_connect')
        } else if (this.$store.state.message === 'Failed opening hid device') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.Failed_opening_hid_device')
        } else if (this.$store.state.message === 'hidapi error: hid error is not implemented yet') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.hidapi_error_hid_error_is_not_implemented_yet')
        } else if (this.$store.state.message === 'imkey device reconnect fail') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_device_reconnect_fail')
        } else if (this.$store.state.message === 'imkey path illegal') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_path_illegal')
        } else if (this.$store.state.message === 'imkey user not confirmed') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_user_not_confirmed')
        } else if (this.$store.state.message === 'imkey conditions not satisfied') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_conditions_not_satisfied')
        } else if (this.$store.state.message === 'imkey command format error') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_command_format_error')
        } else if (this.$store.state.message === 'imkey command data error') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_command_data_error')
        } else if (this.$store.state.message === 'imkey applet not exist') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_applet_not_exist')
        } else if (this.$store.state.message === 'imkey apdu wrong length') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_apdu_wrong_length')
        } else if (this.$store.state.message === 'imkey signature verify fail') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_signature_verify_fail')
        } else if (this.$store.state.message === 'imkey bluetooth channel error') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_bluetooth_channel_error')
        } else if (this.$store.state.message === 'imkey applet function not supported') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_applet_function_not_supported')
        } else if (this.$store.state.message === 'imkey exceeded max utxo number') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_exceeded_max_utxo_number')
        } else if (this.$store.state.message === 'imkey command execute fail') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_command_execute_fail')
        } else if (this.$store.state.message === 'imkey wallet not created') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_wallet_not_created')
        } else if (this.$store.state.message === 'imkey in menu page') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_in_menu_page')
        } else if (this.$store.state.message === 'imkey pin not verified') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_pin_not_verified')
        } else if (this.$store.state.message === 'imkey address mismatch with path') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_address_mismatch_with_path')
        } else if (this.$store.state.message === 'imkey insufficient funds') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_insufficient_funds')
        } else if (this.$store.state.message === 'imkey sdk illegal argument') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_sdk_illegal_argument')
        } else if (this.$store.state.message === 'imkey amount less than minimum') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_amount_less_than_minimum')
        } else if (this.$store.state.message === 'get xpub error') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.get_xpub_error')
        } else if (this.$store.state.message === 'address type mismatch') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.address_type_mismatch')
        } else if (this.$store.state.message === 'imkey tsm device authenticity check fail') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_tsm_device_authenticity_check_fail')
        } else if (this.$store.state.message === 'imkey tsm device not activated') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_tsm_device_not_activated')
        } else if (this.$store.state.message === 'imkey tsm device illegal') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_tsm_device_illegal')
        } else if (this.$store.state.message === 'imkey tsm device stop using') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_tsm_device_stop_using')
        } else if (this.$store.state.message === 'imkey tsm server error') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_tsm_server_error')
        } else if (this.$store.state.message === 'imkey se cert invalid') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_se_cert_invalid')
        } else if (this.$store.state.message === 'imkey tsm device update check fail') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_tsm_device_update_check_fail')
        } else if (this.$store.state.message === 'imkey tsm device active fail') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_tsm_device_active_fail')
        } else if (this.$store.state.message === 'imkey tsm receipt check fail') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_tsm_receipt_check_fail')
        } else if (this.$store.state.message === 'imkey tsm app download fail') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_tsm_app_download_fail')
        } else if (this.$store.state.message === 'imkey tsm app update fail') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_tsm_app_update_fail')
        } else if (this.$store.state.message === 'imkey tsm app delete fail') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_tsm_app_delete_fail')
        } else if (this.$store.state.message === 'imkey tsm oce cert check fail') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_tsm_oce_cert_check_fail')
        } else if (this.$store.state.message === 'imkey tsm cos info no conf') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_tsm_cos_info_no_conf')
        } else if (this.$store.state.message === 'imkey tsm cos upgrade fail') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_tsm_cos_upgrade_fail')
        } else if (this.$store.state.message === 'imkey tsm upload cos version is null') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_tsm_upload_cos_version_is_null')
        } else if (this.$store.state.message === 'imkey tsm switch bl status fail') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_tsm_switch_bl_status_fail')
        } else if (this.$store.state.message === 'imkey tsm write wallet address fail') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_tsm_write_wallet_address_fail')
        } else if (this.$store.state.message === 'imkey tsm check update fail') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_tsm_check_update_fail')
        } else if (this.$store.state.message === 'imkey auth code ciphertext storage fail') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_auth_code_ciphertext_storage_fail')
        } else if (this.$store.state.message === 'imkey keyfile io error') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_keyfile_io_error')
        } else if (this.$store.state.message === 'imkey encrypt authcode fail') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_encrypt_authcode_fail')
        } else if (this.$store.state.message === 'imkey save key file fail') {
          this.Message = this.$t('m.imKeyCoreErrorInfo.imkey_save_key_file_fail')
        } else {
          this.Message = this.$store.state.message
        }
      }
    }
  },

  methods: {
    handleClose () {
      this.$emit('closeNotice', false)
    },
    sure () {
      this.handleClose()
    }
  }
}
</script>

<style lang="less" scoped>
    .body {
        height: 200px;
    }
</style>
