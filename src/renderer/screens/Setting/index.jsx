/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import LearnIcon from '../../images/icon_learn.svg';
import SupportIcon from '../../images/icon_support.svg';
import BuyIcon from '../../images/icon_buy.svg';
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

export default function Setting() {
  const { t, i18n } = useTranslation();
  // const [selected, select] = useState<string>('home');
  // let history = useHistory();

  return (
    <Grid.Container
      alignContent="flex-start"
      direction="row"
      style={{
        height: '100%',
        padding: '40px 64px',
      }}
    >
      <Grid.Container direction="column">
        <div css={{ fontSize: '24px' }}>{t('imKeyManager.setting')}</div>
        <div css={{ color: '#8189A7', marginTop: '6px' }}>
          {t('imKeyManager.imKey_pro_setting_and_info')}
        </div>
        <div css={{ marginTop: '50px' }}>{t('imKeyManager.device')}</div>
      </Grid.Container>
      <Grid.Container
        style={{ border: '1px solid #F1F2FA', padding: '28px 40px' }}
      >
        <Grid.Container justify="space-between">
          <Grid>
            <Grid.Container direction="column">
              <b>imKey Pro</b>
              <span>firmware version 1.5.00</span>
            </Grid.Container>
          </Grid>
          <Grid>
            <Grid.Container alignItems="center">
              <span>{t('imKeyManager.current_least_cos_version')}</span>
              <Spacer x={0.3} />
              <Button size="small" type="secondary" auto>
                {t('imKeyManager.upgrade')}
              </Button>
            </Grid.Container>
          </Grid>
        </Grid.Container>
        <Grid.Container style={{ marginTop: '32px' }}>
          <span>{t('imKeyManager.device_SN')}SN:</span>
          <span>01R4GL3Q2PB59R37</span>
          <span css={{ marginLeft: '60px' }}>
            {t('imKeyManager.device_bind_code')}
          </span>
        </Grid.Container>
      </Grid.Container>
      <div css={{ fontWeight: '600', color: '#0e1019', marginTop: '68px' }}>
        {t('imKeyManager.understand_more')}
      </div>
      <Grid.Container style={{ marginTop: '20px' }} gap={2}>
        <Grid>
          <Grid.Container
            style={{
              width: '240px',
              height: '142px',
              backgroundColor: '#FAFAFA',
              borderRadius: '4px',
              padding: '35px 16px 0 23px',
              position: 'relative',
            }}
          >
            <img
              src={LearnIcon}
              css={{ position: 'absolute', right: '20px', top: '13px' }}
            />
            <div>{t('imKeyManager.beginner_guide')}</div>
            <p css={{ fontSize: '12px', color: '#2e3035' }}>
              {t('imKeyManager.learn_use_imKey')}
            </p>
          </Grid.Container>
        </Grid>
        <Grid>
          <Grid.Container
            style={{
              width: '240px',
              height: '142px',
              backgroundColor: '#FAFAFA',
              borderRadius: '4px',
              padding: '35px 16px 0 23px',
              position: 'relative',
            }}
          >
            <img
              src={LearnIcon}
              css={{ position: 'absolute', right: '20px', top: '13px' }}
            />
            <div>{t('imKeyManager.buy')}</div>
            <p css={{ fontSize: '12px', color: '#2e3035' }}>
              {t('imKeyManager.visit_Youzan_Mall_to_buy')}
            </p>
          </Grid.Container>
        </Grid>
        <Grid>
          <Grid.Container
            style={{
              width: '240px',
              height: '142px',
              backgroundColor: '#FAFAFA',
              borderRadius: '4px',
              padding: '35px 16px 0 23px',
              position: 'relative',
            }}
          >
            <img
              src={SupportIcon}
              css={{ position: 'absolute', right: '20px', top: '13px' }}
            />
            <div>{t('imKeyManager.user_support')}</div>
            <p css={{ fontSize: '12px', color: '#2e3035' }}>
              {t('imKeyManager.email')} <br />
              {t('imKeyManager.wechat')}
            </p>
          </Grid.Container>
        </Grid>
      </Grid.Container>
    </Grid.Container>
  );
}
