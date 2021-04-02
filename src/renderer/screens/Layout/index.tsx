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

export default function Layout(props: any) {
  const { t, i18n } = useTranslation();
  const [selected, select] = useState<string>('home');
  let history = useHistory();

  return (
    <Grid.Container
      style={{
        height: '100%',
      }}
    >
      <Grid.Container
        style={{
          height: '100%',
          boxShadow: '3px 0px 20px rgba(0, 0, 0, 0.06)',
        }}
        alignItems="flex-start"
        alignContent="flex-start"
        xs={5}
      >
        <Grid.Container direction="row" justify="center" alignItems="center">
          <Spacer y={5} x={0} />
          <img
            src={logo}
            css={{ height: '36px', width: '36px', display: 'inline-block' }}
          />
          <Spacer x={0.2} y={0} />
          <Text size={16} b>
            {t('imKeyManager.imKey_manager')}
          </Text>
        </Grid.Container>

        <Grid.Container xs>
          <ul
            css={{
              margin: '0 8px',
              width: '100%',
              '& li': {
                display: 'flex',
                justifyContent: 'flex-start',
                lineHeight: '2em',
                alignItems: 'center',
                padding: '4px 16px',
                cursor: 'pointer',
                ':hover  svg, .selected svg': {
                  color: '#2979fe !important',
                },
                ':before': {
                  content: '""',
                },
                '&.selected': {
                  backgroundColor: '#ebf0fd',
                },
                '& svg': {
                  marginRight: '16px',
                },
              },
            }}
          >
            <li
              className={selected === 'home' ? 'selected' : ''}
              onClick={() => select('home')}
            >
              <HomeIcon /> {t('imKeyManager.home')}
            </li>
            <li
              className={selected === 'management' ? 'selected' : ''}
              onClick={() => select('management')}
            >
              <Box /> {t('imKeyManager.manager')}
            </li>
            <li
              className={selected === 'dapp' ? 'selected' : ''}
              onClick={() => select('dapp')}
            >
              <Globe /> DApp
            </li>
            <li
              className={selected === 'setting' ? 'selected' : ''}
              onClick={() => select('setting')}
            >
              <Settings /> {t('imKeyManager.setting')}
            </li>
          </ul>
        </Grid.Container>
      </Grid.Container>
      <Grid.Container
        justify="center"
        alignItems="center"
        alignContent="center"
        xs
        css={{
          height: '100%',
        }}
      >
       {props.children}
      </Grid.Container>
    </Grid.Container>
  );
}
