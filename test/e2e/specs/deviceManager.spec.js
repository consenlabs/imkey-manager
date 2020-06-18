// const chai = require('chai')
const deviceManager = require('../../../src/api/devicemanager')
describe('Api', () => {
  deviceManager.connectDevice().then(result => {
    if (result.code === 200) {
      console.log('connect result:' + result.data)
    }
  }).catch(err => {
    console.log(err.stack)
  })
  describe('test getSn()', () => {
    it('it should show getSn() result', (done) => {
      deviceManager.getSn().then(result => {
        if (result.code === 200) {
          console.log('result.data:' + result.data)
          expect(result.data).to.eq('imKey01200100010')
          done()
        }
      }).catch(err => {
        console.log(err.stack)
      })
    }).timeout(500000)
  })
  describe('test getSeid()', () => {
    it('it should show getSeid result', (done) => {
      deviceManager.getSeid().then(result => {
        if (result.code === 200) {
          console.log('result.data:' + result.data)
          expect(result.data).to.eq('18080000000000860001010000000106')
          done()
        }
      }).catch(err => {
        console.log(err.stack)
      })
    }).timeout(500000)
  })

  describe('test getRamSize()', () => {
    it('it should show getRamSize result', (done) => {
      deviceManager.getRamSize().then(result => {
        if (result.code === 200) {
          console.log('result.data:' + result.data)
          expect(result.data).to.eq(3159)
          done()
        }
      }).catch(err => {
        console.log(err.stack)
      })
    }).timeout(500000)
  })

  describe('test getFirmwareVersion()', () => {
    it('it should show getFirmwareVersion result', (done) => {
      deviceManager.getFirmwareVersion().then(result => {
        if (result.code === 200) {
          console.log('result.data:' + result.data)
          expect(result.data).to.eq('1.5.08')
          done()
        }
      }).catch(err => {
        console.log(err.stack)
      })
    }).timeout(500000)
  })
  describe('test isBLStatus()', () => {
    it('it should show isBLStatus result', (done) => {
      deviceManager.isBLStatus().then(result => {
        if (result.code === 200) {
          console.log('result.data:' + result.data)
          expect(result.data).to.eq(false)
          done()
        }
      }).catch(err => {
        console.log(err.stack)
      })
    }).timeout(500000)
  })
  describe('test getSdkInfo()', () => {
    it('it should show getSdkInfo result', (done) => {
      deviceManager.getSdkInfo().then(result => {
        if (result.code === 200) {
          console.log('result.data:' + result.data)
          expect(result.data).to.eq('1.2.10')
          done()
        }
      }).catch(err => {
        console.log(err.stack)
      })
    }).timeout(500000)
  })
  describe('test activeDevice()', () => {
    it('it should show activeDevice result', (done) => {
      deviceManager.activeDevice().then(result => {
        if (result.code === 200) {
          console.log('result.data:' + result.data)
          expect(result.data).to.eq('success')
          done()
        }
      }).catch(err => {
        console.log(err.stack)
      })
    }).timeout(500000)
  })
  describe('test checkDevice()', () => {
    it('it should show checkDevice result', (done) => {
      deviceManager.checkDevice().then(result => {
        if (result.code === 200) {
          console.log('result.data:' + result.data)
          expect(result.data).to.eq('success')
          done()
        }
      }).catch(err => {
        console.log(err.stack)
      })
    }).timeout(500000)
  })
  describe('test cosCheckUpdate()', () => {
    it('it should show cosCheckUpdate result', (done) => {
      deviceManager.cosCheckUpdate().then(result => {
        if (result.code === 200) {
          console.log('result.data:' + result.data)
          expect(result.data.isLatest).to.eq(false)
          done()
        }
      }).catch(err => {
        console.log(err.stack)
      })
    }).timeout(500000)
  })

  describe('test checkUpdate()', () => {
    it('it should show checkUpdate result', (done) => {
      deviceManager.checkUpdate().then(result => {
        if (result.code === 200) {
          console.log('result.data.list:' + result.data.list)
          expect(result.data).to.have.a.property('list')
          done()
        }
      }).catch(err => {
        console.log(err.stack)
      })
    }).timeout(500000)
  })
  const appletNmae = 'ETH'
  describe('test deleteApplet()', () => {
    it('it should show deleteApplet result', (done) => {
      deviceManager.deleteApplet(appletNmae).then(result => {
        if (result.code === 200) {
          console.log('result.data:' + result.data)
          expect(result.data).to.eq('success')
          done()
        }
      }).catch(err => {
        console.log(err.stack)
      })
    }).timeout(500000)
  })

  describe('test downloadApplet()', () => {
    it('it should show downloadApplet result', (done) => {
      deviceManager.downloadApplet(appletNmae).then(result => {
        if (result.code === 200) {
          console.log('result.data:' + result.data)
          expect(result.data).to.eq('success')
          done()
        }
      }).catch(err => {
        console.log(err.stack)
      })
    }).timeout(500000)
  })

  describe('test updateApplet()', () => {
    it('it should show updateApplet result', (done) => {
      deviceManager.updateApplet(appletNmae).then(result => {
        if (result.code === 200) {
          console.log('result.data:' + result.data)
          expect(result.data).to.eq('success')
          done()
        }
      }).catch(err => {
        console.log(err.stack)
      })
    }).timeout(500000)
  })

  describe('test deviceBindCheck()', () => {
    it('it should show deviceBindCheck result', (done) => {
      const filePath = require('path').resolve('./')
      console.log('filePath:' + filePath)
      deviceManager.deviceBindCheck(filePath).then(result => {
        if (result.code === 200) {
          console.log('result.data:' + result.data)
          expect(result.data).to.contain('bound')
          done()
        }
      }).catch(err => {
        console.log(err.stack)
      })
    }).timeout(500000)
  })

  describe('test deviceBindAcquire()', () => {
    it('it should show deviceBindAcquire result', (done) => {
      const bindCode = 'T52MKBA3'
      deviceManager.deviceBindAcquire(bindCode).then(result => {
        if (result.code === 200) {
          console.log('result.data:' + result.data)
          expect(result.data).to.eq('success')
          done()
        }
      }).catch(err => {
        console.log(err.stack)
      })
    }).timeout(500000)
  })
  describe('test deviceBindDisplay()', () => {
    it('it should show deviceBindDisplay result', (done) => {
      deviceManager.deviceBindDisplay().then(result => {
        if (result.code === 200) {
          console.log('result.data:' + result.data)
          expect(result.data).to.eq('success')
          done()
        }
      }).catch(err => {
        console.log(err.stack)
      })
    }).timeout(500000)
  })

  describe('test getUserPath()', () => {
    it('it should show getUserPath result', (done) => {
      deviceManager.getUserPath().then(result => {
        if (result.code === 200) {
          console.log('result.data:' + result.data)
          expect(result).to.have.a.property('data')
          done()
        }
      }).catch(err => {
        console.log(err.stack)
      })
    }).timeout(500000)
  })

  describe('test cosUpdate()', () => {
    it('it should show cosUpdate result', (done) => {
      deviceManager.cosUpdate().then(result => {
        if (result.code === 200) {
          console.log('result.data:' + result.data)
          expect(result.data).to.eq('success')
          done()
        }
      }).catch(err => {
        console.log(err.stack)
      })
    }).timeout(500000)
  })
})
