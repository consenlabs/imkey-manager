/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import logo from '../images/imkey_logo.svg';
import { useTranslation } from 'react-i18next';
import { Button, Spacer, Text } from '@geist-ui/react';
import { useHistory } from 'react-router-dom';

export default function AppStart() {
  const { t, i18n } = useTranslation();
  let history = useHistory();

  // Declare a new state variable, which we'll call "count"
  function connect() {
    history.replace('/deviceConnection');
  }

  function openUrl(e) {
    ipcRenderer.send('openUrl', 'https://imkey.im/');
  }

  return (
    <div
      css={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
        height: "100%"
      }}
    >
      <div css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <img src={logo} />
        <Spacer y={1} />
        <Text size={42} b>
          {t('imKeyManager.imKey_manager')}
        </Text>
        <Spacer y={0.4} />
        <Text size={18}>{t('imKeyManager.your_imKey_manager')}</Text>
        <Spacer y={5} />
        <Button shadow type="secondary" className="red-txt" onClick={connect}>
          {t('imKeyManager.use_now')}
        </Button>

        <div
          css={{
            color: 'hotpink',
          }}
        />

        <Text style={{ color: '#A8A8A8' }}>
          {t('imKeyManager.no_have_imKey_pro')}
        </Text>
      </div>
    </div>
  );
}
