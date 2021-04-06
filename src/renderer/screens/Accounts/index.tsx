/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import logo from '../../images/nav_logo.svg';
import ManagementIcon from '../../images/icon_management.svg';
import DAppIcon from '../../images/icon_dapp.svg';
import SettingIcon from '../../images/icon_setting.svg';
import { useTranslation } from 'react-i18next';
import { Button, Grid, Spacer, Card, Text } from '@geist-ui/react';
import { useHistory } from 'react-router-dom';
import { Home as HomeIcon, Globe, Settings, Box } from '@geist-ui/react-icons';

export default function Accounts() {
  const { t, i18n } = useTranslation();
  // const [selected, select] = useState<string>('home');
  // let history = useHistory();


  return (
    <Grid.Container
      alignContent="flex-start"
      style={{
        height: '100%',
        padding: '40px 64px',
      }}
    >
      <Text size={36}>账户</Text>
      <Card>
        <Grid.Container>
          
        </Grid.Container>
      </Card>
    </Grid.Container>
  );
}
