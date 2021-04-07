import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'zh',
    debug: true,
    lng: 'zh',

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          imKeyManager: {
            imKey_manager: 'imKey Manager',
            your_imKey_manager: 'Your imKey Pro Desktop Management Tool',
            use_now: 'Get Started',
            no_have_imKey_pro: 'No imKey Pro?',
            use_imKey_connected: 'Use imKey Pro to complete the connection',
            use_imKey_connect_computer:
              'Connect imKey Pro to computer using USB',
            click_connect_button: 'Click the「Connect」button',
            enter_pin_on_imKey: 'Enter the PIN code in imKey Pro',
            if_no_set_pin_can_jump_step3:
              'If you have not set a PIN code in imKey Pro, you can skip step 3',
            if_bind_device_disconnect_bluetooth:
              'Please make sure you are at the homepage of imKey Pro and disconnect the Bluetooth connection',
            connect: 'Connect',
            imKey_connecting_wait: 'imKey connecting, please wait patiently',
            check_firmware_version_update: 'Check firmware version',
            check_device_bind_code: 'Check the device binding code',
            check_pin_wallet: 'Check PIN code and wallet',
            check_secure_test: 'Safety check',
            usb_connect_error: 'usb connection error',
            check_usb_connect:
              'Please unplug the USB to try again or check the USB interface, and then click「Connect」again after confirming that it is normal',
            ok: 'Confirm',
            firmware_update_fail: 'Firmware upgrade is not completed',
            find_firmware_update_fail_continue:
              'It is detected that the application exit abnormal, please continue to upgrade, and imKey Manager can be used normally after completion',
            imKey_pro_firmware_update_wait:
              'The imKey Pro firmware version is being upgraded, please wait patiently',
            imKey_pro_firmware_update_no_disconnect:
              'Note: After the upgrade is completed, imKey Pro will automatically restart. During the upgrade process, please do not disconnect the USB connection and terminate the imKey operation at the same time',
            enter_bind_code: 'Please input a binding code',
            bind_code_error_please_check:
              'Binding code error, please check carefully, or reset imKey by importing the mnemonic phrase to retrieve it',
            enter_pin_imKey_pro: 'Please enter the PIN code in imKey Pro',
            pin_code_error_please_check:
              'PIN code error/forgotten can be retrieved by ',
            reset_imKey: 'resetting imKey',
            retrieved: '',
            imKey_setting: 'imKey Setup',
            following_operations_on_imKey:
              'Please complete the following operations on imKey:',
            bin_code: 'Binding code',
            create_restore_Wallet: 'Create / Recover Wallet',
            complete_setup: 'Complete Setup',

            generate_bind_code: 'Generate Device Binding Code',
            first_bind_device_see_to_imKey:
              'The device binding code will be generated for the first binding, please check it in imKey Pro and back it up properly',
            operating_tutorial: 'Help',
            precautions: 'Note:',
            bind_code_used_check_device_please_save:
              'The binding code is used for one-to-one binding between imKey and the client, please back it up properly',
            bind_code_export_on_setting_or_rest_imKey:
              'The binding code can be exported on the「 Settings 」page or retrieved by resetting imKey by importing mnemonics',
            same_imKey_bind_different_PC_used_same_bind_code:
              'If the same imKey Pro is bound on different PCs, the same binding code will be used',
            next: 'Next',
            // enter_bind_code: 'Please Input a Binding Code',
            enter_bind_code_for_use_on_the_current_device:
              'Please enter the device binding code to use it on the current device',
            // bind_code_error_please_check:'Binding code error, please check carefully, or reset imKey by importing the mnemonic phrase to retrieve it',

            setting_pin: 'Set PIN Code',
            disconnect_usb_use_imKey_setting:
              'Please disconnect the USB and use imKey to set up',
            use_pin_unlock_imKey:
              'The PIN Code is used for unlocking your imKey',
            setting_6_8_bit_pin: 'Set up the PIN code with 6 to 8 digits',
            do_not_enter_the_same_or_consecutive_pin:
              'Do not enter a PIN code of the same or continuous numbers',
            // create_restore_Wallet:'Create / Recover Wallet',
            Mnemonic_control_ownership_please_private:
              'Mnemonic equals ownership of wallet assets, please keep it safe',
            Replace_reset_device_use_mnemonic_restore_wallet:
              'Change or reset your device, and you can use Mnemonic phrase to recover your wallet assets',
            Create_restore_wallet_2_minutes_wait:
              'Creation/recovery of the wallet takes ~2 minutes',
            choose_create_wallet_mnemonic_never_be_online:
              'Recommended to choose to create a wallet and ensure that the Mnemonic never connects to the network',
            // complete_setup:'Complete Setup',
            congratulations_complete_setup_final_security_check:
              'Congratulations, you have completed the imKey setup, let’s go to the last security check',
            confirm_pi_code_set_for_me_backup_completed:
              'Confirm to set a PIN code for myself and complete the backup',
            mnemonics_backup_offline_importance_of_mnemonics:
              'I have backed up my mnemonic phrase offline and know the importance of the mnemonic phrase',
            binding_code_backup_known:
              'Have backed up the device binding code and know its function',
            safety_your_assets_please_complete_all_security_checks:
              'For the safety of your assets, please complete all security checks',
            previous: 'Previous',
            done: 'Complete',
            home: 'Homepage',
            manager: 'Management',
            setting: 'Settings',
            welcome_used_imkKey_manager: 'Welcome to Use imKey Manager :)',
            imKey_manager_is_desktop_manager:
              'imKey Manager is a hardware wallet desktop management program, here you can achieve:',
            imKey_wallet_version_manager:
              'imKey hardware wallet version management',
            imKey_APP_version_manager: 'imKey App version management',
            fast_connect_desktop_APP: 'Quickly connect to desktop applications',
            used_this_desktop_APP: 'Try this desktop applications',
            view_imKey_Pro_support_coin_list_install_update_Apps:
              'View imKey Pro support coin list,update or add coin',
            App_list: 'Coin list',
            imKey_soft: 'imKey soft',
            search: 'Search',
            install: 'Install',
            upgrade: 'Update',
            installed: 'Installed',
            delete: 'Delete',
            APP_installing_do_not_disconnect_usb:
              'App is installing, please do not disconnect the USB connection and stop the imKey operation',
            APP_deleting_do_not_disconnect_usb:
              'App is deleting, please do not disconnect the USB connection and stop the imKey operation',
            APP_upgrading_do_not_disconnect_usb:
              'App is upgrading, please do not disconnect the USB connection and stop the imKey operation',
            install_uninstall_upgrade_delete_Apps_fail:
              'Coin installation/upgrade failed',
            check_usb_or_internet_connect:
              'Please check the USB connection or network connection and try again after confirming that it is normal',
            imKey_pro_setting_and_info:
              'imKey Pro basic settings and related information ',
            device: 'Device',
            current_least_cos_version: 'Latest firmware version',
            found_new_cos_version: 'New firmware Version',
            found_new_soft_version: 'New imKey Manager Version',
            device_SN: 'Device ID: ',
            device_bind_code: 'Device binding code: ',
            export: 'Export',
            understand_more: 'Learn more',
            restart_automatically_after_upgrade:
              'Note: imKey Pro will automatically restart after the upgrade is complete',
            upgrading_do_not_disconnect_usb_operating:
              'During the upgrade, please do not disconnect the USB connection and stop the imKey operation',
            upgrade_done: 'Update completed',
            can_used_imKey_manager:
              'Currently imKey Manager can be used normally',
            upgrade_fail: 'Update failed',
            check_usb_internet_connect_click_upgrade_retry:
              'Please check the USB connection or network connection and try again after confirming that it is normal',
            bind_code_8_bit_world_uppercase:
              '8-digit binding code, English letters are all uppercase',
            loading_fail: 'Failed to load',
            check_usb_internet_connect_retry:
              'Please check the USB connection or network connection and try again after confirming that it is normal',
            found_imKey_manager_new_version:
              'New version of imKey Manager available',
            update: 'Upgrade',
            access_error_please_check_your_network_connection:
              'Access error, please check your network/usb connection',
            loading_please_wait: 'Loading, please wait patiently',
            new_version_is: 'The new version is ',
            current_version_is: 'The current version is ',
            update_later: 'Update later',
            update_now: 'Update now',
            cancel: 'Cancel',
            copy_success: 'Successfully Copied',
            disconnect_usb: 'Disconnect the USB connection',
            verifying: ' Verifying',
            verified_successfully: ' Successfully Verified',
            done_setting_select_next:
              ' Please complete the above settings and then select the next step',
            beginner_guide: "Beginner's guide",
            learn_use_imKey:
              'Learn how to pair and use imKey, or go to the help center for more articles',
            buy: 'Buy Now',
            visit_Youzan_Mall_to_buy: 'Buy imKey and peripherals now',
            user_support: 'User Support',
            email: 'Email: support@imkey.im',
            wechat: 'WeChat: imKeyOfficial',
            tokenlon_info: 'Trustless token-to-token decentralized exchange',
            compound_info: 'Deposit to earn, support USDT, USDC, Dai & 6 more ',
            aave_info: 'Deposit/Lend to earn, support TUSD, USDT & 15 more',
            operating_tutorial_url: 'https://imkey.im/get-started?locale=en-us',
            update_tip_wait:
              'After the update, the app will restart. Please be patient',
            coming_soon: ' Coming Soon ',
            found_dapp_access: 'imKey Manager Tips',
            installing_dot_ksm_coin:
              'Please go to the manager page to install the applet DOT and KSM',
          },
          appStart: {
            imKey_manager: 'imKey Manager',
            your_imKey_manager: 'Your imKey Pro desktop management tool',
            no_have_imKey_pro: 'Not yet own imKey Pro?',
            use_now: 'use immediately',
          },
          connectDevice: {
            get_start_imKey: 'Get start with your Pro device',
            info_connect_imKey: 'Connect the to your Computer',
            info_click_button: 'Click the connect button',
            info_enter_pin: 'Enter the PIN code on ',
            info_if_pin:
              'If you have not set the pin code of the imKey, you don"t need to enter the pin code on imKey',
            connect: 'Connect',
            connect_success: 'connect success',
            connecting: 'Connecting',
            check_BL: 'Check BL',
            upgrading_firmware: 'Upgrading firmware',
            check_active: 'Check Active',
            active_success: 'Active Success',
            check_bind: 'Check Bind',
            check_create_wallet: 'Check Create Wallet',
          },
          step: {
            connect: 'Connect',
            active_bind: 'Active&Bind',
            set_pin_create_wallet: 'Set PIN&Create Wallet',
          },
          stepOne: {
            connect_imKey: 'Connect your imKey',
          },
          stepTwo: {
            active_bind: 'Active&Bind',
            please_active_bind: 'Please active and bind your imKey',
            active_imKey: 'Activate your imKey',
            bind_imKey: 'Bind your imKey',
            start_active_bind_imKey: 'Start active and bind your imKey',
            start: 'Start',
            activating_imKey: 'Activating your imKey',
            binding_imKey: 'Binding your imKey',
            bind: 'Bind',
            bind_code_is_null: 'BindCode is Not Null',
            bind_code_is_correct: 'BindCode is not in correct format',
            enter_bind_code: 'enter bind code',
          },
          stepThree: {
            set_pin_create_wallet: 'Set PIN&Create Wallet',
            please_disconnect:
              'Please disconnect the USB ,set PIN and create wallet',
            set_modify_pin: 'Set and modify PIN code',
            create_wallet: 'Create or restore wallets',
            next: 'Next',
            operation_guide: 'Operation Guide',
            how_to_set_pin: 'How to set the PIN',
            set_pin_1:
              "imKey's PIN code should be 6-8 digits long and should not be a combination of same or continuous numbers.",
            set_pin_2:
              'The shows Set PIN , and you enter the setting procedure.',
            set_pin_3:
              'Set the number for every digit, use the up and down buttons to switch among digits, click on OK  to confirm, and click on C  to cancel.',
            set_pin_4:
              'Repeat the above process until all digits of the PIN code are selected. (If you want to set a 6-digit PIN code, you can complete the setting by clicking on OK  when the 7th digit shows ✔️ . If you want to set a 7-digit or 8-digit PIN code, you can confirm by switching the ✔️  to numbers.)',
            set_pin_5: 'Type in the PIN code again to confirm',
            security_reminders: 'Security reminders',
            security_info_1:
              'The PIN code is used to unlock and cannot be recovered if lost. Please keep it safe;',
            security_info_2:
              'The PIN shall not be a combination of same or continuous numbers;',
            security_info_3:
              'Please do not use a random PIN code or the PIN code provided by the third-party tools.',
            how_to_change_PIN: 'How to change the PIN code',
            change_pin:
              'Type in the PIN, turn on imKey, click on OK  and enter the setting interface of the wallet. Choose Setting  -> Change the PIN , type in the original PIN to check the identity, and reset the PIN code.',
            special_notes:
              'To safeguard the assets in the wallet, if a wrong PIN is typed in five times in a row, will be forced to be reset. Please do remember the PIN code you set, since the PIN code cannot reset or recovered once lost.',
            create_a_wallet: 'Create a wallet',
            create_a_wallet_1:
              'According to the prompt message on the screen, press the Previous/Next button to select Recover Wallet, and click OK.',
            create_a_wallet_2: 'View the tips then click on OK to continue',
            create_a_wallet_3:
              'Accurately transcribe words in the correct order',
            create_a_wallet_4:
              'Repeat this process until 12 words of the Mnemonic phrase are all backed up. (The Mnemonic is the only way to recover your wallet. Please keep it offline and properly safe.)',
            create_a_wallet_5: 'Next, displays Please confirm your Mnemonic',
            create_a_wallet_6:
              'Enter the correct word with Previous and Next buttons, click on  OK  to confirm',
            create_a_wallet_7:
              'Repeat this process until 12 words of the Mnemonic phrase are all verified',
            create_a_wallet_8:
              'After the verification is completed, will display  Creating wallet,  estimated 2 min.  ',
            recover_wallet: 'Recover wallet',
            recover_wallet_1:
              'According to the prompt message on the screen, press the Previous/Next button to select Recover Wallet, and click OK.',
            recover_wallet_2:
              'Input the Mnemonic words. At present, supports the import of 12-, 18-, or 24-word Mnemonics.',
            recover_wallet_3:
              'Press the Up/Down button to switch letters. Press OK to confirm letter selection and C to cancel letter selection.',
            recover_wallet_4:
              'Repeat this operation until displays all available words. Press the Up/Down button to move the cursor. Press OK to select the desired word. (The BIP39 word base contains 2,048 different words. As long as you enter several beginning letters, all candidate words can be displayed and available for selection.)',
            recover_wallet_5:
              'After the Mnemonic import is completed, click OK. will display Recovering wallet,  estimated 2 min',
            recover_wallet_6: 'It can be used after the import is completed.',
          },
          home: {
            buy_now: 'Get your own imKey',
            use_imToken_to_buy: 'Please use the imToken scan code to buy',
            use_WeChat_AliPay_to_buy:
              'Please use the WeChat / Alipay scan code to buy',
            WeChat_AliPay: 'WeChat/AliPay',
          },
          connect: {
            connect_imKey: 'Connect your imKey',
            follow_steps: 'Follow the steps below to the Manager',
            connect_imKey_to_computer: 'Connect the  to your Computer',
            click_connect: 'Click the connect button',
            enter_pin_imKey: 'Enter the PIN code on your imKey',
            connect: 'Connect',
          },
          manager: {
            manager: 'Manager',
            install_uninstall_apps: 'Install or unstall apps on your device',
            firmware_version: 'firmware version',
            firmware_is: 'firmware is ',
            available: 'available',
            update: 'update',
            app_catalog: 'App catalog',
            search_app: 'search app',
            install: 'install',
          },
          setting: {
            info: 'info',
            is_update: 'Do you want to update ？',
            cancel: 'Cancel',
            ok: 'Ok',
            is_quit_update: 'Exit update now ？',
            setting: 'Setting',
            setting_imKey_manager: 'Setting imKey-manager',
            need_help: 'Need Help?',
            imKey_manager_version: 'imKey-manager version',
            imKey_manager_version_is: 'imKey-manager version is ',
            available: 'available',
          },
          menu: {
            home: 'Home',
            manager: 'Manager',
            setting: 'Setting',
          },
          noticeDialog: {
            info: 'info',
          },
          dapp: {
            newest_launched: 'Newest launched',
            tokenlon_desc: 'Secure and fast decentralized exchange',
            sushiswap_desc:
              'Stake SushiSwap LP tokens to claim your very own yummy SUSHI!',
            uniswap_desc:
              'Guaranteed liquidity for millions of users and hundreds of Ethereum applications.',
            polkadotJS_desc: 'Cryptocurrency Exchange | Simple Coin Conversion',
            multisender_desc:
              'Send ERC20 Token or ETH to thousands of addresses out in 1 single transaction...',
            rarible_desc: 'Create and sell digital collectibles',
            murall_desc:
              'A digital, immutable, collaborative mural that anyone anywhere can draw on.',
            zksync_desc: "Ethereum's first and most user-centric ZK rollup.",
            zkswap_desc: 'A ZK-Rollups based layer-2 DEX with AMM model.',
            compound_desc:
              'An autonomous interest rate protocol to unlock open financial applications.',
            aave_desc:
              'An protocol to earn interest on deposits and borrow assets.',
          },
          imKeyCoreErrorInfo: {
            decoding_failed: 'Decoding failed',
            imkey_publickey_mismatch_with_path: 'publickey mismatch with path',
            imkey_illegal_param: 'illegal param',
            get_seid_error: 'get seid error',
            get_sn_error: 'get sn error',
            get_ram_size_error: 'get ram size error',
            get_firmware_version_error: 'get firmware version error',
            get_battery_power_error: 'get battery power error',
            get_life_time_error: 'get life time error',
            get_ble_name_error: 'get ble name error',
            get_ble_version_error: 'get ble version error',
            parse_arguments_to_str: 'parse arguments to str',
            decode_imkey_api: 'decode api',
            encode_error: 'encode error',
            device_connect_interface_not_called:
              'device connect interface not called',
            device_data_read_time_out: 'device data read time out',
            imkey_device_not_connect: 'device not connect,please connect',
            Failed_opening_hid_device:
              'Failed opening hid device.If imKey is connected, please disconnect and reconnect',
            hidapi_error_hid_error_is_not_implemented_yet:
              'hidapi error: hid error is not implemented yet.please disconnect and reconnect',
            imkey_device_reconnect_fail:
              'device reconnect fail.please disconnect and reconnect',
            imkey_path_illegal: 'path illegal',
            imkey_user_not_confirmed: 'user not confirmed',
            imkey_conditions_not_satisfied: 'conditions not satisfied',
            imkey_command_format_error: 'command format error',
            imkey_command_data_error: 'command data error',
            imkey_applet_not_exist: 'applet not exist',
            imkey_apdu_wrong_length: 'apdu wrong length',
            imkey_signature_verify_fail: 'signature verify fail',
            imkey_bluetooth_channel_error: 'bluetooth channel error',
            imkey_applet_function_not_supported:
              'applet function not supported',
            imkey_exceeded_max_utxo_number: 'exceeded max utxo number',
            imkey_command_execute_fail: 'command execute fail',
            imkey_wallet_not_created: 'wallet not created',
            imkey_in_menu_page: 'in menu page',
            imkey_pin_not_verified: 'pin not verified',
            imkey_address_mismatch_with_path: 'address mismatch with path',
            imkey_insufficient_funds: 'insufficient funds',
            imkey_sdk_illegal_argument: 'sdk illegal argument',
            imkey_amount_less_than_minimum: 'amount less than minimum',
            get_xpub_error: 'get xpub error',
            address_type_mismatch: 'address type mismatch',
            imkey_tsm_device_authenticity_check_fail:
              'device authenticity check fail',
            imkey_tsm_device_not_activated: 'device not activated',
            imkey_tsm_device_illegal: 'device illegal',
            imkey_tsm_device_stop_using: 'device stop using',
            imkey_tsm_server_error: 'server error',
            imkey_se_cert_invalid: 'se cert invalid',
            imkey_tsm_device_update_check_fail: 'device update check fail',
            imkey_tsm_device_active_fail: 'device active fail',
            imkey_tsm_receipt_check_fail: 'receipt check fail',
            imkey_tsm_app_download_fail: 'app download fail',
            imkey_tsm_app_update_fail: 'app update fail',
            imkey_tsm_app_delete_fail: 'app delete fail',
            imkey_tsm_oce_cert_check_fail: 'oce cert check fail',
            imkey_tsm_cos_info_no_conf: 'cos info no conf',
            imkey_tsm_cos_upgrade_fail: 'cos upgrade fail',
            imkey_tsm_upload_cos_version_is_null: 'upload cos version is null',
            imkey_tsm_switch_bl_status_fail: 'switch bl status fail',
            imkey_tsm_write_wallet_address_fail: 'write wallet address fail',
            imkey_tsm_check_update_fail: 'check update fail',
            imkey_auth_code_ciphertext_storage_fail:
              'auth code ciphertext storage fail',
            imkey_keyfile_io_error: 'keyfile io error',
            imkey_encrypt_authcode_fail: 'encrypt authcode fail',
            imkey_save_key_file_fail: 'save key file fail',
          },
        },
      },
      zh: {
        translation: {
          imKeyManager: {
            imKey_manager: 'imKey Manager',
            your_imKey_manager: '你的 imKey Pro 桌面管理工具',
            use_now: '立刻使用',
            no_have_imKey_pro: '还未拥有 imKey Pro ?',
            use_imKey_connected: '使用 imKey Pro 完成连接',
            use_imKey_connect_computer: '使用 USB 将 imKey Pro 连接至电脑',
            click_connect_button: '点击「连接」按钮',
            enter_pin_on_imKey: '在 imKey Pro 中输入 PIN 码',
            if_no_set_pin_can_jump_step3:
              '如果你尚未在 imKey Pro 中设置 PIN 码，可以跳过第 3 步',
            if_bind_device_disconnect_bluetooth:
              '请确保当前处于imKey Pro首页，并断开蓝牙连接',
            connect: '连接',
            imKey_connecting_wait: 'imKey 连接中，请耐心等待',
            check_firmware_version_update: '检查固件版本升级',
            check_device_bind_code: '检查设备绑定码',
            check_pin_wallet: '检查 PIN 码及钱包',
            check_secure_test: '检查安全测试',
            usb_connect_error: 'USB 连接异常',
            check_usb_connect:
              '请拔出 USB 重试或检查 USB 接口是否松动，确认无误后再次点击「连接」',
            ok: '确定',
            firmware_update_fail: '固件升级未完成',
            find_firmware_update_fail_continue:
              '检测到因应用异常退出导致固件升级未完成，请继续升级，完成后可正常使用 imKey Manager',
            imKey_pro_firmware_update_wait:
              'imKey Pro 固件版本升级中，请耐心等待',
            imKey_pro_firmware_update_no_disconnect:
              '注意：升级完成后 imKey Pro 将自动重启升级过程中请勿断开 USB 连接，同时中止 imKey 操作',
            enter_bind_code: '请输入设备绑定码',
            bind_code_error_please_check:
              ' 绑定码错误，请仔细核对，或通过导入助记词',
            reset_imKey: ' 重置 imKey ',
            retrieved: '找回',
            enter_pin_imKey_pro: '请在 imKey Pro 中输入 PIN 码',
            pin_code_error_please_check: 'PIN 码错误 / 遗忘可以通过',
            imKey_setting: 'imKey 设置',
            following_operations_on_imKey: '请在 imKey 上完成以下操作：',
            bin_code: '绑定码',
            create_restore_Wallet: '创建 / 恢复钱包',
            complete_setup: '完成设置',

            generate_bind_code: '生成设备绑定码',
            first_bind_device_see_to_imKey:
              '初次绑定将生成设备绑定码，请在 imKey Pro 中查看并妥善备份',
            operating_tutorial: '新手教程',
            precautions: '注意事项：',
            bind_code_used_check_device_please_save:
              '绑定码用于 imKey 与客户端一对一绑定，请仔细抄写并保管',
            bind_code_export_on_setting_or_rest_imKey:
              '绑定码在「设置」页面可导出，或通过导入助记词重置 imKey 找回',
            same_imKey_bind_different_PC_used_same_bind_code:
              '同一台 imKey Pro 若在不同 PC 端绑定，将使用相同的绑定码',
            next: '下一步',
            // enter_bind_code:'输入设备绑定码',
            enter_bind_code_for_use_on_the_current_device:
              '请输入设备绑定码，以便在当前设备上使用',
            // bind_code_error_please_check:'绑定码错误，请仔细核对，或通过导入助记词重置 imKey 找回',

            disconnect_usb: '断开USB连接',
            setting_pin: '设置 PIN 码',
            disconnect_usb_use_imKey_setting:
              '请断开 USB 连接，使用 imKey 进行设置，设置完成后重新连接并选择下一步',
            use_pin_unlock_imKey: 'PIN 码用于解锁 imKey',
            setting_6_8_bit_pin: '设置 6-8 位 PIN 码',
            do_not_enter_the_same_or_consecutive_pin:
              '请勿输入相同或连续数字的 PIN 码',
            // create_restore_Wallet:'创建 / 恢复钱包',
            Mnemonic_control_ownership_please_private:
              '助记词掌控资产所有权，请妥善私密保管',
            Replace_reset_device_use_mnemonic_restore_wallet:
              '更换或重置设备，可以使用助记词恢复钱包资产',
            Create_restore_wallet_2_minutes_wait:
              '创建 / 恢复钱包约 2 分钟，请耐心等待',
            choose_create_wallet_mnemonic_never_be_online:
              '建议选择创建钱包，保障助记词永不联网',
            // complete_setup:'完成设置',
            congratulations_complete_setup_final_security_check:
              '恭喜你已完成 imKey 设置，进行最后一步安全检查吧',
            confirm_pi_code_set_for_me_backup_completed:
              '确认为本人设置 PIN 码，并已完成备份',
            mnemonics_backup_offline_importance_of_mnemonics:
              '已离线备份助记词，并知晓助记词的重要性',
            binding_code_backup_known: '已备份设备绑定码，并知晓其作用',
            safety_your_assets_please_complete_all_security_checks:
              '为了你的资产安全，请完成所有安全检查项',
            previous: '上一步',
            done: '完成',
            home: '主页',
            manager: '管理',
            setting: '设置',
            welcome_used_imkKey_manager: '欢迎使用 imKey Manager :)',
            imKey_manager_is_desktop_manager:
              'imKey Manager 是一款硬件钱包桌面管理程序，在这里你可以实现：',
            imKey_wallet_version_manager: 'imKey 硬件钱包版本管理',
            imKey_APP_version_manager: 'imKey App 版本管理',
            fast_connect_desktop_APP: '快速连接桌面端应用',
            used_this_desktop_APP: '尝试使用这些桌面端应用吧',
            view_imKey_Pro_support_coin_list_install_update_Apps:
              '查看 imKey Pro 币种支持列表，升级或安装新增币种',
            App_list: '币种列表',
            imKey_soft: 'imKey 软件',
            search: '搜索',
            install: '安装',
            upgrade: '升级',
            installed: '已安装',
            delete: '删除',
            APP_installing_do_not_disconnect_usb:
              '币种程序安装中，请勿断开 USB 连接，并中止 imKey 操作',
            APP_deleting_do_not_disconnect_usb:
              '币种程序删除中，请勿断开 USB 连接，并中止 imKey 操作',
            APP_upgrading_do_not_disconnect_usb:
              '币种程序升级中，请勿断开 USB 连接，并中止 imKey 操作',
            install_uninstall_upgrade_delete_Apps_fail: '币种安装/升级失败',
            check_usb_or_internet_connect:
              '请检查 USB 连接或网络连接情况，确认无误后重试',
            imKey_pro_setting_and_info: 'imKey Pro 基本设置及相关信息 ',
            device: '设备',
            current_least_cos_version: '已为最新固件版本',
            found_new_cos_version: '发现新固件版本',
            found_new_soft_version: 'imKey Manager 新版本提示',
            device_SN: '设备编号: ',
            device_bind_code: '设备绑定码：',
            export: '导出',
            understand_more: '了解更多',
            restart_automatically_after_upgrade:
              '注意：升级完成后 imKey Pro 将自动重启',
            upgrading_do_not_disconnect_usb_operating:
              '升级过程中请勿断开 USB 连接，同时中止 imKey 操作',
            upgrade_done: '升级完成',
            can_used_imKey_manager: '当前可以正常使用 imKey Manager',
            upgrade_fail: '升级失败',
            check_usb_internet_connect_click_upgrade_retry:
              '请检查 USB 连接或网络连接情况，确认无误后点击升级重试',
            bind_code_8_bit_world_uppercase: '8 位绑定码，英文字母均为大写',
            loading_fail: '加载失败',
            check_usb_internet_connect_retry:
              '请检查 USB 连接或网络连接情况，确认无误后点击重试',
            found_imKey_manager_new_version: 'imKey Manager 新版本提示',
            update: '更新',
            access_error_please_check_your_network_connection:
              '访问出错，请检查你的网络/USB连接',
            loading_please_wait: '加载中，请耐心等待',
            new_version_is: '新版本为 ',
            current_version_is: '，当前版本为 ',
            update_later: '稍后更新',
            update_now: '立刻更新',
            cancel: '取消',
            copy_success: '复制成功',
            verifying: ' 正在验证',
            verified_successfully: ' 验证成功',
            done_setting_select_next: ' 请完成上述设置再选择下一步',

            beginner_guide: '新手引导',
            learn_use_imKey:
              '学习如何配对和使用 imKey，或前往帮助中心浏览更多文章',
            buy: '快速购买',
            visit_Youzan_Mall_to_buy: '访问有赞商城购买 imKey 及其周边吧',
            user_support: '用户支持',
            email: '邮件：support@imkey.im',
            wechat: '微信：imKeyOfficial',
            tokenlon_info: '安全快速的去中心化交易所',
            compound_info: '存币生息，支持 USDT/USDC/Dai等 ',
            aave_info: '存/借贷生息，支持 17 个币种',
            operating_tutorial_url: 'https://imkey.im/get-started?locale=zh-cn',
            update_tip_wait: '更新完成后 App 将自动重启，请耐心等待',
            coming_soon: ' 敬请期待 ',
            found_dapp_access: 'imKey Manager 提示',
            installing_dot_ksm_coin: '请前往管理界面安装币种程序DOT和KSM',
          },
          appStart: {
            imKey_manager: 'imKey Manager',
            your_imKey_manager: '你的 imKey Pro 桌面管理工具',
            no_have_imKey_pro: '还未拥有 imKey Pro?',
            use_now: '立即使用',
          },
          connectDevice: {
            get_start_imKey: '开始使用你的imKey Pro',
            info_connect_imKey: '将imKey连接到你的电脑上',
            info_click_button: '点击连接按钮',
            info_enter_pin: '在imKey上输入PIN码 ',
            info_if_pin: '如果没有PIN就不用输入',
            connect: '连接',
            connect_success: '连接成功',
            connecting: '连接中',
            check_BL: '检查BL',
            upgrading_firmware: '升级固件中',
            check_active: '检查激活',
            active_success: '激活成功',
            check_bind: '检查绑定',
            check_create_wallet: '检查创建钱包',
          },
          step: {
            connect: '连接',
            active_bind: '激活&绑定',
            set_pin_create_wallet: '设置PIN&创建钱包',
          },
          stepOne: {
            connect_imKey: '连接你的imKey',
          },
          stepTwo: {
            active_bind: '激活&绑定',
            please_active_bind: '请激活并绑定你的imKey',
            active_imKey: '激活你的imKey',
            bind_imKey: '绑定你的imKey',
            start_active_bind_imKey: '开始激活并绑定你的imKey',
            start: '开始',
            activating_imKey: '正在激活你的imKey',
            binding_imKey: '正在绑定你的imKey',
            bind: '绑定',
            bind_code_is_null: '绑定码不能为空',
            bind_code_is_correct: '绑定码格式不正确',
            enter_bind_code: '输入绑定码',
          },
          stepThree: {
            set_pin_create_wallet: '设置PIN&创建钱包',
            please_disconnect: '请断开USB，设置PIN并创建钱包',
            set_modify_pin: '设置或修改PIN',
            create_wallet: '创建或恢复钱包',
            next: '下一步',
            operation_guide: '操作指南',
            how_to_set_pin: '设置方式：',
            set_pin_1:
              'imKey 的 PIN 码设置要求为 6 - 8 位数字，不支持相同或连续的数字组合。',
            set_pin_2: 'imKey 上显示「设置 PIN 」进入设置流程。',
            set_pin_3:
              '设置每一位的数字，上下按钮切换，点击「OK」确认，点击「C」取消',
            set_pin_4:
              '重复此过程，直到选择了 PIN 码的所有数字。（如果你想设置 6 位 PIN 码，在第 7 位出现「✔️」符号时点击「OK」按钮即可完成设置。如果你想设置 7 位或者 8 位 PIN\n' +
              '                        码，在显示「✔️」符号时，通过切换按钮切换成数字并确认即可。）',
            set_pin_5: '再次输入 PIN 码进行确认',
            security_reminders: '安全提示：',
            security_info_1: 'PIN 码用于解锁 imKey，丢失无法找回，请妥善保管；',
            security_info_2: '不支持相同或连续的数字组合。',
            security_info_3: '切勿使用随机 PIN 码和第三方工具提供的 PIN 码。',
            how_to_change_PIN: '修改 PIN 码：',
            change_pin:
              '输入 PIN 开启 imKey，点击「OK」进入钱包设置界面，选择「设置」—「修改 PIN」，输入原 PIN 码进行身份确认，然后重新设置 PIN 码即可。',
            special_notes:
              '特别提示：为保证钱包资产安全，连续五次输入错误的 PIN 码，imKey 会被强制重置。请用户务必记牢设置的 PIN 码，PIN 码一旦遗失没有任何办法能够重置或者找回。',
            create_a_wallet: '创建钱包：',
            create_a_wallet_1:
              '根据 imKey 界面显示，使用上下按钮移动光标至「创建钱包」，点击 OK。',
            create_a_wallet_2: '阅读提醒后点击 OK 确认',
            create_a_wallet_3: '准确按顺序抄写单词',
            create_a_wallet_4:
              '重复此过程直到 12 个单词全部保存（助记词是恢复钱包的唯一方式，只能在创建钱包的时候备份备份，请务必离线妥善保管）',
            create_a_wallet_5: '备份助记词结束后 imKey 会显示「请确认助记词」',
            create_a_wallet_6: '上下按钮选择对应位置正确的单词，点击 OK 确认」',
            create_a_wallet_7: '重复此过程直到 12 个单词全部验证 ',
            create_a_wallet_8:
              '验证完成后提示「钱包创建中，预计 2 分钟完成」。创建完成后，即可开始使用。',
            recover_wallet: '恢复钱包：',
            recover_wallet_1:
              '根据 imKey 界面显示，使用上下按钮移动光标至「恢复钱包」，点击 OK。',
            recover_wallet_2:
              '选择要导入助记词的单词数量，imKey 目前支持导入 12、18、24 个单词的助记词。',
            recover_wallet_3:
              '选择助记词对应位置单词的字母，上下按钮切换，OK 确认，C 取消。',
            recover_wallet_4:
              '重复此操作，直到 imKey 显示可供选择的建议单词，上下按钮移动光标，点击 OK 选择正确的单词。（因为 BIP39 词库的 2048\n' +
              '                        个单词各不相同。每个单词只需要前几位字母即可确定，所以输入前几位字母后即可跳转到选择备选单词界面）',
            recover_wallet_5:
              '完成助记词导入后，点击 OK 。开始导入钱包后进入提示界面「钱包恢复中，预计 2 分钟完成」。',
            recover_wallet_6: '导入完成，即可开始使用。',
          },
          home: {
            buy_now: '现在购买',
            use_imToken_to_buy: '请使用 imToken 2.0 扫码购买',
            use_WeChat_AliPay_to_buy: '请使用微信/支付宝扫码购买',
            WeChat_AliPay: '微信/支付宝',
          },
          connect: {
            connect_imKey: '连接你的imKey',
            follow_steps: '执行下面步骤进入管理界面',
            connect_imKey_to_computer: '将你的imKey连接到电脑上',
            click_connect: '点击连接按钮',
            enter_pin_imKey: '在你的imKey上输入PIN码',
            connect: '连接',
          },
          manager: {
            manager: '管理',
            install_uninstall_apps: '给imKey安装或者下载应用',
            firmware_version: '固件版本',
            firmware_is: '有新的固件 ',
            available: '可用',
            update: '更新',
            app_catalog: '应用目录',
            search_app: '搜索应用',
            install: '安装',
          },
          setting: {
            info: '提示',
            is_update: '是否要更新？',
            cancel: '取消',
            ok: '确定',
            is_quit_update: '是否立刻退出更新？',
            setting: '设置',
            setting_imKey_manager: '设置imKey-manager',
            need_help: '帮助?',
            imKey_manager_version: 'imKey-manager版本',
            imKey_manager_version_is: 'imKey-manager有新的版本',
            available: '可用',
          },
          menu: {
            home: '主页',
            manager: '管理',
            setting: '设置',
          },
          noticeDialog: {
            info: '提示',
          },
          dapp: {
            newest_launched: '最新上架',
            tokenlon_desc: '安全快速的去中心化交易所',
            sushiswap_desc: '锁定SushiSwap LP代币，领取属于您的美味SUSHI!',
            uniswap_desc: '保证数百万用户和数百个Ethereum应用的流动性。',
            polkadotJS_desc: '加密货币交易所｜简单的硬币兑换方式',
            multisender_desc:
              '将ERC20代币或ETH发送到成千上万的地址，只需一次交易......。',
            rarible_desc: 'Create and sell digital collectibles',
            murall_desc: '在线创作加密艺术作品',
            zksync_desc: '安全、去信任化的以太坊二层网络',
            zkswap_desc: '基于 zkRollup Layer2 并采用 AMM 的去中心化交易所',
            compound_desc: '能够同时管理 MakerDAO 与 Compound 的理财神器',
            aave_desc: '去中心化理财, 抵押 DAI 获取稳定收益',
          },
          imKeyCoreErrorInfo: {
            decoding_failed: '解析失败',
            imkey_publickey_mismatch_with_path: '公钥路径不匹配',
            imkey_illegal_param: '参数错误',
            get_seid_error: '获取seid失败',
            get_sn_error: '获取sn失败',
            get_ram_size_error: '获取内存空间失败',
            get_firmware_version_error: '获取固件版本失败',
            get_battery_power_error: '获取电量失败',
            get_life_time_error: '获取生命周期失败',
            get_ble_name_error: '获取蓝牙名称失败',
            get_ble_version_error: '获取蓝牙版本失败',
            parse_arguments_to_str: '解析api传入的字符失败',
            decode_imkey_api: 'api数据解析失败',
            encode_error: '编码错误',
            device_connect_interface_not_called: '没有调用api连接接口',
            device_data_read_time_out: '设备读取数据超时',
            imkey_device_not_connect: '没有连接imkey',
            Failed_opening_hid_device: '连接失败，如果已连接，请断开重连',
            hidapi_error_hid_error_is_not_implemented_yet:
              '连接失败，请断开重连',
            imkey_device_reconnect_fail: '重新连接失败，请断开重连',
            imkey_path_illegal: '路径错误',
            imkey_user_not_confirmed: '用户没有确认',
            imkey_conditions_not_satisfied: '安全条件不满足',
            imkey_command_format_error: '指令格式错误',
            imkey_command_data_error: '指令错误',
            imkey_applet_not_exist: '应用不存在',
            imkey_apdu_wrong_length: '指令长度错误',
            imkey_signature_verify_fail: '签名校验失败',
            imkey_bluetooth_channel_error: '蓝牙通道错误',
            imkey_applet_function_not_supported: '该应用不支持这个方法',
            imkey_exceeded_max_utxo_number: '超过了最大utxo数量',
            imkey_command_execute_fail: '指令执行失败',
            imkey_wallet_not_created: '钱包没有创建',
            imkey_in_menu_page: 'imkey在菜单页面',
            imkey_pin_not_verified: 'PIN码没有认证通过',
            imkey_address_mismatch_with_path: '地址不匹配',
            imkey_insufficient_funds: '资金不足',
            imkey_sdk_illegal_argument: 'sdk参数错误',
            imkey_amount_less_than_minimum: '金额少于最小值',
            get_xpub_error: '获取xpub错误',
            address_type_mismatch: '地址类型不匹配',
            imkey_tsm_device_authenticity_check_fail: '验证真伪失败',
            imkey_tsm_device_not_activated: '设备未激活',
            imkey_tsm_device_illegal: '非法设备',
            imkey_tsm_device_stop_using: '该设备已停用',
            imkey_tsm_server_error: '服务器错误',
            imkey_se_cert_invalid: 'imkey SE证书无效',
            imkey_tsm_device_update_check_fail: '设备更新检查失败l',
            imkey_tsm_device_active_fail: 'i设备激活失败',
            imkey_tsm_receipt_check_fail: 'receipt检查失败',
            imkey_tsm_app_download_fail: '应用下载失败',
            imkey_tsm_app_update_fail: '应用更新失败',
            imkey_tsm_app_delete_fail: '应用删除失败',
            imkey_tsm_oce_cert_check_fail: '公钥验证失败',
            imkey_tsm_cos_info_no_conf: 'COS 信息未配置',
            imkey_tsm_cos_upgrade_fail: 'COS升级失败',
            imkey_tsm_upload_cos_version_is_null: '上传的COS版本为空',
            imkey_tsm_switch_bl_status_fail: '切换BL状态失败',
            imkey_tsm_write_wallet_address_fail: '写wallet地址失败',
            imkey_tsm_check_update_fail: '检查更新失败',
            imkey_auth_code_ciphertext_storage_fail: '绑定码密文存储失败',
            imkey_keyfile_io_error: '创建key文件错误',
            imkey_encrypt_auth_code_fail: '加密绑定码失败',
            imkey_save_key_file_fail: '保存key文件失败',
          },
        },
      },
    },
  });

export default i18n;
