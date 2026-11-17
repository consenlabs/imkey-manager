import { expect, it, vi } from 'vitest'
import { DeviceApi } from '../src/service/deviceApi'
import { api, decode, invoke } from '../src/service/protobuf'

vi.mock('../src/common/constants', async original => ({
  default: {
    ...(await original<typeof import('../src/common/constants')>()).default,
    serverUrl: 'https://tsm-config.invalid:10444/imkey',
    sdkVersion: 'test-sdk-version',
    terminalType: 'PC'
  }
}))

it('passes the shared service configuration through the native init protobuf', () => {
  let request = ''
  const native = new DeviceApi(
    {
      callImKeyApi(hex) {
        request = hex
        return ''
      },
      getLastErrorMessage: () => ''
    },
    '/fixture/userData'
  )
  expect(native.initImKeyCore().isSuccess).toBe(true)
  const action = decode(api, 'ImkeyAction', request)
  expect(invoke(action, 'getMethod')).toBe('init_imkey_core_x')
  const any = invoke<Record<string, () => Uint8Array>>(action, 'getParam')
  const init = api.InitImKeyCoreXParam.deserializeBinary(any.getValue_asU8())
  expect(invoke(init, 'getServerurl')).toBe('https://tsm-config.invalid:10444/imkey')
  expect(invoke(init, 'getSdkversion')).toBe('test-sdk-version')
  expect(invoke(init, 'getTerminaltype')).toBe('PC')
  expect(invoke(init, 'getIsdebug')).toBe(false)
})
