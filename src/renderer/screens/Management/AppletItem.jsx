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
import { useHistory } from 'react-router-dom';
import {
  Home as HomeIcon,
  Globe,
  Settings,
  Box,
  Search,
} from '@geist-ui/react-icons';

export default function AppletItem() {
  const { t, i18n } = useTranslation();
  // const [selected, select] = useState<string>('home');
  // let history = useHistory();

  return (
    <Grid.Container
      alignContent="center"
      alignItems="center"
      direction="row"
      style={{
        width: '320px',
        height: '80px',
        backgroundColor: '#fafafa',
        borderRadius: '5px',
        padding: '0 20px',
      }}
    >
      <Grid>
        <img
          css={{ width: '34px', height: '34px' }}
          src="https://aave.com/favicon.ico"
        />
      </Grid>
      <Grid xs style={{marginLeft: '16px'}}>
        <Grid.Container direction="column">
          <span css={{ fontWeight: '600', color: '#0e1019' }}>imKey 软件</span>
          <span css={{ color: '#8189a7' }}>version 1.2.00</span>
        </Grid.Container>
      </Grid>
      <Grid>
        <span css={{color: '#b8ac97'}}>install</span>
      </Grid>
    </Grid.Container>
  );
}
