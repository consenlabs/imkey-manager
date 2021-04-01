/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import logo from '../../images/imkey_logo.svg';
import device from '../../images/imkey_device.svg';
import { useTranslation } from 'react-i18next';
import { Button, Spacer, Text, Grid, Modal, Spinner } from '@geist-ui/react';
import { CheckInCircleFill } from '@geist-ui/react-icons'

const CheckIcon = ({ ...props }) => <CheckInCircleFill size={14} {...props}/>;
const InlineSpinner = () => <Spinner size='mini' style={{display: "inline-block", width: "14px", height: "14px"}}/> ;

export default function ConnectingDialog() {
  const { t, i18n } = useTranslation();

  return (
    <Grid.Container alignItems="center" justify="center">
      <Text size={18} b>
        {t('imKeyManager.imKey_connecting_wait')}
      </Text>
      <ul
        css={{
          marginTop: "32px",
          '& li': {
            fontSize: "16px",
            lineHeight: '1.1em',
            listStyleType: 'none',
            color: '#888',
            '&:before': {
              content: '""',
            },
          },
        }}
      >
        <li><CheckIcon color="black"/> {t('imKeyManager.check_firmware_version_update')}</li>
        <li><InlineSpinner /> {t('imKeyManager.check_device_bind_code')}</li>
        <li><CheckIcon/> {t('imKeyManager.check_pin_wallet')}</li>
        <li><CheckIcon/> {t('imKeyManager.check_secure_test')}</li>
      </ul>
      {/* <Button shadow type="secondary">
        {t('imKeyManager.ok')}
      </Button> */}
    </Grid.Container>
  );
}
