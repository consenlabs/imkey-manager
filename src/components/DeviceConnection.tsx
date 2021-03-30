import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import './AppStart.css';
import logo from '../../assets/images/imkey_logo.svg';
import device from '../../assets/images/imkey_device.svg';
import { useTranslation } from 'react-i18next';
import { Button, Spacer, Text } from '@geist-ui/react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

const OutWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ConnectionDescription = styled.div`
  display: flex;
`;

const StepDesc = styled.div`
  font-size: 16px;
  margin-top: 6px;
`

const SmallTip = styled.div`
  font-size: 14px;
  margin-top: 6px;
  color: #848484;
`
export default function DeviceConnection() {
  const { t, i18n } = useTranslation();

  // Declare a new state variable, which we'll call "count"
  function next(e) {}

  function openUrl(e) {
    ipcRenderer.send('openUrl', 'https://imkey.im/');
  }

  return (
    <OutWrapper>
      <InnerWrapper>
        <img src={logo} />
        <Text size={22} b style={{ marginTop: '22px' }}>
          {t('imKeyManager.use_imKey_connected')}
        </Text>
        <div style={{ display: 'flex', marginTop: '64px' }}>
          <img src={device} style={{marginTop: "-60px"}}/>
          <div style={{ marginLeft: '78px', maxWidth: "350px" }}>
            <div>
              <StepDesc>
                {t('imKeyManager.use_imKey_connect_computer')}
              </StepDesc>
              <StepDesc>{t('imKeyManager.click_connect_button')}</StepDesc>
              <StepDesc>{t('imKeyManager.enter_pin_on_imKey')}</StepDesc>
            </div>
            <div style={{marginTop: "42px"}}>
            <SmallTip>{t('imKeyManager.if_no_set_pin_can_jump_step3')}</SmallTip>
            <SmallTip style={{maxWidth: "480px"}}>{t('imKeyManager.if_bind_device_disconnect_bluetooth')}</SmallTip>
            </div>
          </div>
        </div>
        <Button shadow type="secondary" style={{marginTop: "66px"}}>
          {t('imKeyManager.connect')}
        </Button>
      </InnerWrapper>
    </OutWrapper>
  );
}
