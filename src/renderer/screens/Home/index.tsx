/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import logo from '../../images/nav_logo.svg';
import ManagementIcon from '../../images/icon_management.svg';
import DAppIcon from '../../images/icon_dapp.svg';
import SettingIcon from '../../images/icon_setting.svg';
import { useTranslation } from 'react-i18next';
import { Button, Grid, Spacer, Text } from '@geist-ui/react';
import { useHistory } from 'react-router-dom';
import { Home as HomeIcon, Globe, Settings, Box } from '@geist-ui/react-icons';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [selected, select] = useState<string>('home');
  let history = useHistory();

  // Declare a new state variable, which we'll call "count"
  function connect() {
    history.replace('/deviceConnection');
  }

  return (
    <Grid.Container
      alignContent="flex-start"
      style={{
        height: '100%',
        padding: '40px 64px',
      }}
    >
      <Text size={24}>{t('imKeyManager.welcome_used_imkKey_manager')}</Text>
      <Text size={16}>
        {t('imKeyManager.imKey_manager_is_desktop_manager')}
      </Text>
      <ul
        css={{
          li: {
            listStyle: 'circle',
            color: '#8189A7',
            
          },
        }}
      >
        <li>{t('imKeyManager.imKey_manager_is_desktop_manager')}</li>
        <li>{t('imKeyManager.imKey_APP_version_manager')}</li>
        <li>{t('imKeyManager.fast_connect_desktop_APP')}</li>
      </ul>
    </Grid.Container>
  );
}
