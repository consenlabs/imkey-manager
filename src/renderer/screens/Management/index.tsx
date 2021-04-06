/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import logo from '../../images/nav_logo.svg';
import ManagementIcon from '../../images/icon_management.svg';
import DAppIcon from '../../images/icon_dapp.svg';
import SettingIcon from '../../images/icon_setting.svg';
import { useTranslation } from 'react-i18next';
import { Button, Grid, Spacer, Card, Text, Input } from '@geist-ui/react';
import AppletItem from './AppletItem';
import { useHistory } from 'react-router-dom';
import {
  Home as HomeIcon,
  Globe,
  Settings,
  Box,
  Search,
} from '@geist-ui/react-icons';

export default function Management() {
  const { t, i18n } = useTranslation();
  // const [selected, select] = useState<string>('home');
  // let history = useHistory();

  let applets: React.ReactNode[] = [];
  for (let i = 0; i < 14; i++) {
    applets.push(<AppletItem />);
  }

  return (
    <Grid.Container
      direction="column"
      style={{
        height: '100%',
        padding: '40px 64px',
      }}
    >
      <Grid.Container direction="column">
        <div css={{ fontSize: '24px' }}>{t('imKeyManager.manager')}</div>
        <div css={{ color: '#8189A7', marginTop: '6px' }}>
          {t(
            'imKeyManager.view_imKey_Pro_support_coin_list_install_update_Apps'
          )}
        </div>
        <div css={{ marginTop: '50px' }}>{t('imKeyManager.App_list')}</div>
        <Input
          style={{
            width: '380px',
          }}
          css={{
            marginTop: '20px',
          }}
          icon={<Search />}
          placeholder={t('imKeyManager.search')}
        />
      </Grid.Container>
      <Grid.Container
        gap={1}
        style={{ margin: '36px 0 0 0', height: 'calc(100% - 244px)' }}
      >
        {applets.map((applet, idx) => {
          return (
            <Grid key={idx} xs>
              {applet}
            </Grid>
          );
        })}
      </Grid.Container>
    </Grid.Container>
  );
}
