/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import logo from '../../images/imkey_logo.svg';
import device from '../../images/imkey_device.svg';
import { useTranslation } from 'react-i18next';
import { Button, Spacer, Text, Grid, Modal } from '@geist-ui/react';

export default function ConnectingDialog() {
  const { t, i18n } = useTranslation();


  return (
    <Grid.Container alignItems="center" justify="center">
      <Text size={18} b>
        {t('imKeyManager.usb_connect_error')}
      </Text>
      <Text>{t('imKeyManager.check_usb_connect')}</Text>
      <Button shadow type="secondary">
        {t('imKeyManager.ok')}
      </Button>
    </Grid.Container>
  );
}
