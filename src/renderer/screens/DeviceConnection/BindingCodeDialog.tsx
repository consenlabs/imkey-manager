/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { MutableRefObject, useRef, useState } from 'react';
import { ipcRenderer } from 'electron';

import { useTranslation } from 'react-i18next';
import { Button, Spacer, Text, Grid, Modal } from '@geist-ui/react';
import { CheckIcon, InlineSpinner } from '../../components/base';
import { AlertOctagon } from '@geist-ui/react-icons';

const validBindingCodeRe = /\w/;
export default function BindingCodeDialog() {
  const { t, i18n } = useTranslation();

  const inputRefs = Array<MutableRefObject<null | HTMLInputElement>>();
  for (let i = 0; i < 8; i++) {
    inputRefs.push(useRef(null));
  }

  function keyUpHandler(
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) {
    e.preventDefault();
    e.stopPropagation();
    if (
      e.key.length == 1 &&
      validBindingCodeRe.test(e.key) &&
      inputRefs[index].current !== null
    ) {
      inputRefs[index].current.value = e.key.toLocaleUpperCase();

      if (index < 7) {
        inputRefs[index + 1].current?.focus();
      }
    }
    if (e.key === 'Backspace') {
      inputRefs[index].current.value = '';

      if (index > 0) {
        inputRefs[index - 1].current?.focus();
      }
    }

    console.log('keyup, index', JSON.stringify(e.key), index);
  }

  let tip = (
    <Text size={14} css={{ lineHeight: '1em' }}>
      <InlineSpinner /> {t('imKeyManager.verifying')}
    </Text>
  );

  tip = (
    <Text type="error" size={14} css={{ lineHeight: '1em' }}>
      <AlertOctagon size={14} />{' '}
      {t('imKeyManager.bind_code_error_please_check')}
    </Text>
  );

  tip = (
    <Text size={14} style={{color: '#1bad3b' }} css={{ lineHeight: '1em', }}>
      <AlertOctagon size={14} />{' '}
      {t('imKeyManager.bind_code_error_please_check')}
    </Text>
  );

  return (
    <Grid.Container alignItems="center" justify="center">
      <Text size={18} b>
        {t('imKeyManager.enter_bind_code')}
      </Text>
      <Spacer y={2} />
      <Grid.Container
        justify="center"
        css={{
          '& input': {
            margin: '2px',
            display: 'inline-block',
            width: '32px',
            height: '32px',
            textAlign: 'center',
          },
        }}
      >
        {inputRefs.map((refInput, index) => {
          return (
            <input
              type="text"
              ref={refInput}
              onKeyUp={(e) => keyUpHandler(e, index)}
              maxLength={1}
              size={1}
            />
          );
        })}
      </Grid.Container>
      {tip}
    </Grid.Container>
  );
}
