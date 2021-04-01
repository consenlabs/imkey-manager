/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import logo from '../../images/imkey_logo.svg';
import device from '../../images/imkey_device.svg';
import { useTranslation } from 'react-i18next';
import { Button, Spacer, Text, Grid, Modal } from '@geist-ui/react';
import { AlertOctagon } from '@geist-ui/react-icons'


export default function FirmwareNeedUpdateDialog() {
  const { t, i18n } = useTranslation();


  return (
    <Grid.Container alignItems="center" justify="center" direction="column">
      <Grid><AlertOctagon size={32}/></Grid>
      <Text size={18} b>
        {t('imKeyManager.firmware_update_fail')}
      </Text>
      <Text style={{color: '#4d4a5d'}}>{t('imKeyManager.find_firmware_update_fail_continue')}</Text>
      <Button shadow type="secondary">
        {t('imKeyManager.ok')}
      </Button>
    </Grid.Container>
  );
}
