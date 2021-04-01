/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import logo from '../../images/imkey_logo.svg';
import device from '../../images/imkey_device.svg';
import { useTranslation } from 'react-i18next';
import ConnectingDialog from './ConnectingDialog';
import { Button, Spacer, Text, Grid, useModal, Modal } from '@geist-ui/react';

export default function DeviceConnection() {
  const { t, i18n } = useTranslation();

  const { visible, setVisible, bindings } = useModal();

  const dialog = <ConnectingDialog />;
  return (
    <Grid.Container
      justify="center"
      alignContent="center"
      css={{
        width: '100%',
        height: '100%',
      }}
    >
      <Grid.Container direction="column" alignItems="center">
        <img src={logo} />
        <Text size={22} b style={{ marginTop: '22px' }}>
          {t('imKeyManager.use_imKey_connected')}
        </Text>
        <div css={{ display: 'flex', marginTop: '64px' }}>
          <img src={device} style={{ marginTop: '-60px' }} />
          <div css={{ marginLeft: '78px', maxWidth: '350px' }}>
            <ol
              css={{
                '& li': {
                  fontSize: '16px',
                  lineHeight: '1.1em',
                },
              }}
            >
              <li>{t('imKeyManager.use_imKey_connect_computer')}</li>
              <li>{t('imKeyManager.click_connect_button')}</li>
              <li>{t('imKeyManager.enter_pin_on_imKey')}</li>
            </ol>
            <ul
              css={{
                marginTop: '42px',
                '& li': {
                  fontSize: '14px',
                  lineHeight: '1.2em',
                  listStyleType: 'none',
                  color: '#888',
                  '&:before': {
                    content: '"*"',
                  },
                },
              }}
            >
              <li>{t('imKeyManager.if_no_set_pin_can_jump_step3')}</li>
              <li css={{ maxWidth: '480px' }}>
                {t('imKeyManager.if_bind_device_disconnect_bluetooth')}
              </li>
            </ul>
          </div>
        </div>
        <Button
          shadow
          type="secondary"
          css={{ marginTop: '66px' }}
          onClick={() => setVisible(true)}
        >
          {t('imKeyManager.connect')}
        </Button>
      </Grid.Container>
      <Modal open>
        <Modal.Content style={{ padding: '0 36px' }}>{dialog}</Modal.Content>
      </Modal>
    </Grid.Container>
  );
}
