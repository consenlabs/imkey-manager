
/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import logo from '../../images/imkey_logo.svg';
import device from '../../images/imkey_device.svg';
import { useTranslation } from 'react-i18next';
import { Button, Spacer, Text, Grid, Modal, Spinner } from '@geist-ui/react';
import { CheckInCircleFill } from '@geist-ui/react-icons'


export const CheckIcon = ({ ...props }) => <CheckInCircleFill size={14} {...props}/>;
export const InlineSpinner = ({...props}) => <Spinner size='mini' style={{display: "inline-block", width: "14px", height: "14px"}} {...props}/> ;