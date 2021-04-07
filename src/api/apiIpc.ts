import { ipcRenderer } from 'electron';

let callbackCache: { type: string; callback: (data: object) => void };
export const apiIpc = {
  send: (msgType: string, msgData?: object) => {
    ipcRenderer.send('message-from-renderer', {
      type: msgType,
      data: msgData,
    });
  },
  on: (type: string, callback: (data: object) => void) => {
    callbackCache = {
      type,
      callback,
    };
  },
};

ipcRenderer.on('message-to-renderer', (_, msg) => {
  if (callbackCache.type === msg.type) {
    callbackCache.callback(msg.data);
  }
});
