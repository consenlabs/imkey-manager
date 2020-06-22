// const chai = require('chai')
const deviceManager = require('../../../src/api/devicemanagerapi')
describe('Api', () => {
  describe('test connect()', () => {
    it('it should show connect() result', (done) => {
      const response = deviceManager.connect()
      if (response.isSuccess) {
        expect(response.result).to.eq('success')
        done()
      } else {
        console.error(response.result)
      }
    }).timeout(500000)
  })

  describe('test getSn()', () => {
    it('it should show getSn() result', (done) => {
      const response = deviceManager.getSn()
      if (response.isSuccess) {
        expect(response.result).to.eq('imKey01200100010')
        done()
      } else {
        console.error(response.result)
      }
    }).timeout(500000)
  })
  describe('test getSeid()', () => {
    it('it should show getSeid result', (done) => {
      const response = deviceManager.getSeid()
      if (response.isSuccess) {
        expect(response.result).to.eq('18080000000000860001010000000106')
        done()
      } else {
        console.error(response.result)
      }
    }).timeout(500000)
  })

  describe('test getRamSize()', () => {
    it('it should show getRamSize result', (done) => {
      const response = deviceManager.getRamSize()
      if (response.isSuccess) {
        expect(response.result).to.eq(3159)
        done()
      } else {
        console.error(response.result)
      }
    }).timeout(500000)
  })

  describe('test getFirmwareVersion()', () => {
    it('it should show getFirmwareVersion result', (done) => {
      const response = deviceManager.getFirmwareVersion()
      if (response.isSuccess) {
        expect(response.result).to.eq('1.5.08')
        done()
      } else {
        console.error(response.result)
      }
    }).timeout(500000)
  })
  describe('test isBLStatus()', () => {
    it('it should show isBLStatus result', (done) => {
      const response = deviceManager.isBLStatus()
      if (response.isSuccess) {
        expect(response.result).to.eq(false)
        done()
      } else {
        console.error(response.result)
      }
    }).timeout(500000)
  })
  describe('test getSdkInfo()', () => {
    it('it should show getSdkInfo result', (done) => {
      const response = deviceManager.getSdkInfo()
      if (response.isSuccess) {
        expect(response.result).to.eq('1.2.10')
        done()
      } else {
        console.error(response.result)
      }
    }).timeout(500000)
  })
  describe('test activeDevice()', () => {
    it('it should show activeDevice result', (done) => {
      const response = deviceManager.activeDevice()
      if (response.isSuccess) {
        expect(response.result).to.eq('success')
        done()
      } else {
        console.error(response.result)
      }
    }).timeout(500000)
  })
  describe('test checkDevice()', () => {
    it('it should show checkDevice result', (done) => {
      const response = deviceManager.checkDevice()
      if (response.isSuccess) {
        expect(response.result).to.eq('success')
        done()
      } else {
        console.error(response.result)
      }
    }).timeout(500000)
  })
  describe('test cosCheckUpdate()', () => {
    it('it should show cosCheckUpdate result', (done) => {
      const response = deviceManager.cosCheckUpdate()
      if (response.isSuccess) {
        expect(response.result).to.have.a.property('seid')
        done()
      } else {
        console.error(response.result)
      }
    }).timeout(500000)
  })

  describe('test checkUpdate()', () => {
    it('it should show checkUpdate result', (done) => {
      const response = deviceManager.checkUpdate()
      if (response.isSuccess) {
        expect(response.result).to.have.a.property('sn')
        done()
      } else {
        console.error(response.result)
      }
    }).timeout(500000)
  })
  describe('test checkUpdateAppList()', () => {
    it('it should show checkUpdateAppList result', (done) => {
      const response = deviceManager.checkUpdateAppList()
      if (response.isSuccess) {
        expect(response.result).to.have.a.property('list')
        done()
      } else {
        console.error(response.result)
      }
    }).timeout(500000)
  })
  const appletNmae = 'ETH'
  describe('test deleteApplet()', () => {
    it('it should show deleteApplet result', (done) => {
      const response = deviceManager.deleteApplet(appletNmae)
      if (response.isSuccess) {
        expect(response.result).to.eq('success')
        done()
      } else {
        console.error(response.result)
      }
    }).timeout(500000)
  })

  describe('test downloadApplet()', () => {
    it('it should show downloadApplet result', (done) => {
      const response = deviceManager.downloadApplet(appletNmae)
      if (response.isSuccess) {
        expect(response.result).to.eq('success')
        done()
      } else {
        console.error(response.result)
      }
    }).timeout(500000)
  })

  describe('test updateApplet()', () => {
    it('it should show updateApplet result', (done) => {
      const response = deviceManager.updateApplet(appletNmae)
      if (response.isSuccess) {
        expect(response.result).to.eq('success')
        done()
      } else {
        console.error(response.result)
      }
    }).timeout(500000)
  })

  describe('test deviceBindCheck()', () => {
    it('it should show deviceBindCheck result', (done) => {
      const filePath = require('path').resolve('./')
      const response = deviceManager.deviceBindCheck(filePath)
      if (response.isSuccess) {
        expect(response.result).to.contain('bound')
        done()
      } else {
        console.error(response.result)
      }
    }).timeout(500000)
  })

  describe('test deviceBindAcquire()', () => {
    it('it should show deviceBindAcquire result', (done) => {
      const bindCode = 'T52MKBA3'
      const response = deviceManager.deviceBindAcquire(bindCode)
      if (response.isSuccess) {
        expect(response.result).to.contain('success')
        done()
      } else {
        console.error(response.result)
      }
    }).timeout(500000)
  })
  describe('test deviceBindDisplay()', () => {
    it('it should show deviceBindDisplay result', (done) => {
      const response = deviceManager.deviceBindDisplay()
      if (response.isSuccess) {
        expect(response.result).to.contain('success')
        done()
      } else {
        console.error(response.result)
      }
    }).timeout(500000)
  })

  describe('test cosUpdate()', () => {
    it('it should show cosUpdate result', (done) => {
      const response = deviceManager.cosUpdate()
      if (response.isSuccess) {
        expect(response.result).to.contain('success')
        done()
      } else {
        console.error(response.result)
      }
    }).timeout(500000)
  })
})
