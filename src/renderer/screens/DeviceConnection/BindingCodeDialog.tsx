/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import logo from '../../images/imkey_logo.svg';
import device from '../../images/imkey_device.svg';
import { useTranslation } from 'react-i18next';
import { Button, Spacer, Text, Grid, Modal } from '@geist-ui/react';

export default function BindingCodeDialog() {
  const { t, i18n } = useTranslation();


  return (
    <Grid.Container alignItems="center" justify="center">
      <Text size={18} b>
        {t('imKeyManager.enter_bind_code')}
      </Text>
      <Grid.Container>
      <input type="text" maxLength={1} size={1} pattern={"/[^\w\.\/]/ig"}/>
      <input type="text" maxLength={1} size={1} autoFocus pattern={"/[^\w\.\/]/ig"}/>
      </Grid.Container>
    </Grid.Container>
  );
}
