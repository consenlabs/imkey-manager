import { ipcRenderer } from 'electron';

export const requestImkeyCore = (type: string, data?: object) => {
  return new Promise((resolve, reject) => {
    try {
      ipcRenderer.on(
        'message-to-renderer',
        (_, msg: { type: string; data: object }) => {
          console.log('message-to-renderer', JSON.stringify(msg));
          if (msg.type === type) {
            ipcRenderer.removeAllListeners('message-to-renderer');
            resolve(msg.data);
          }
        }
      );
      ipcRenderer.send('message-from-renderer', {
        type,
        data,
      });
    } catch (err) {
      reject(err);
    }
  });
};

