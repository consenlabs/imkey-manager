/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import logo from '../../images/imkey_logo.svg';
import device from '../../images/imkey_device.svg';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Spacer,
  Text,
  Grid,
  Modal,
  Spinner,
  Divider,
} from '@geist-ui/react';

export default function FirmwareUpdatingDialog() {
  const { t, i18n } = useTranslation();

  return (
    <Grid.Container alignItems="center" justify="center" direction="column">
      <Spinner size="large" />
      <Spacer y={1} />
      <Text size={18} b>
        {t('imKeyManager.imKey_pro_firmware_update_wait')}
      </Text>
      <Divider style={{ width: '90%' }} />
      <Text style={{ color: '#4d4a5d' }}>
        {t('imKeyManager.imKey_pro_firmware_update_no_disconnect')}
      </Text>
    </Grid.Container>
  );
}
