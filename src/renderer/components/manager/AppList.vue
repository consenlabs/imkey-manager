<script setup lang="ts">
import { Search as SearchIcon } from '@element-plus/icons-vue'
import type { AppletView } from '../../models/applets'
const appName = defineModel<string>('appName', { required: true })
defineProps<{ getApps: AppletView[] }>()
const emit = defineEmits<{
  installApp: [item: AppletView]
  updateApp: [item: AppletView]
}>()
</script>
<template>
  <h2>{{ $t('m.imKeyManager.manager') }}</h2>
  <p class="msg">{{ $t('m.imKeyManager.view_imKey_Pro_support_coin_list_install_update_Apps') }}</p>
  <h3>{{ $t('m.imKeyManager.App_list') }}</h3>
  <div class="searchBox">
    <input type="text" :placeholder="$t('m.imKeyManager.search')" v-model="appName" />
    <el-icon class="el-icon-search"><SearchIcon /></el-icon>
  </div>
  <el-scrollbar style="height: 430px" :wrap-style="{ 'overflow-x': 'hidden' }">
    <div v-for="item in getApps" :key="item.id" class="appItem">
      <ul>
        <li>
          <div class="app">
            <img :src="item.icon" alt="/" />
          </div>
          <div>
            <p>{{ item.displayName }}</p>
            <p>{{ item.desc }}</p>
          </div>
          <div>
            <a class="col" v-if="item.installed === true" href="#" @click.prevent>{{
              $t('m.imKeyManager.installed')
            }}</a>
            <a
              v-if="item.installDis === false"
              href="#"
              @click.prevent="emit('installApp', item)"
              >{{ $t('m.imKeyManager.install') }}</a
            >
            <a v-if="item.updateDis === false" href="#" @click.prevent="emit('updateApp', item)">{{
              $t('m.imKeyManager.upgrade')
            }}</a>

            <el-tooltip
              class="item"
              trigger="manual"
              v-if="item.installLoading === true"
              :visible="item.installLoading"
              :content="$t('m.imKeyManager.APP_installing_do_not_disconnect_usb')"
              effect="dark"
              placement="top-start"
            >
              <span v-if="item.installLoading === true" class="fas fa-circle-notch fa-spin"></span>
            </el-tooltip>
            <el-tooltip
              class="item"
              trigger="manual"
              v-if="item.updateLoading === true"
              :visible="item.updateLoading"
              :content="$t('m.imKeyManager.APP_upgrading_do_not_disconnect_usb')"
              effect="dark"
              placement="top-start"
            >
              <span v-if="item.updateLoading === true" class="fas fa-circle-notch fa-spin"></span>
            </el-tooltip>
          </div>
        </li>
      </ul>
    </div>
  </el-scrollbar>
</template>
