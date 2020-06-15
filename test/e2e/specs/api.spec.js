// Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const fs = require('fs')
const path = require('path')
const testJsonPath = path.resolve('./test/e2e/specs/test.json')
chai.use(chaiHttp)

describe('Api', () => {
  const testObj = readFileToJsonObj(testJsonPath)
  const testJsonArr = []
  for (const json in testObj) {
    testJsonArr.push(json)
    console.log('json:' + json)
  }
  it('test ' + testJsonArr[0], (done) => {
    const reqJson = testObj[testJsonArr[0]]
    console.log('request:' + JSON.stringify(reqJson))
    chai.request('127.0.0.1:8081')
      .post('/api/imKey')
      .send(reqJson)
      .end((err, res) => {
        if (err) {
          console.log(err.stack)
        }
        console.log('response:' + JSON.stringify(res.body))
        expect(res.status).to.equal(200)
        expect(JSON.stringify(res.body.result)).to.equal(JSON.stringify(testObj[testJsonArr[1]].result))
        done()
      })
  }).timeout(30000)

  it('test ' + testJsonArr[2], (done) => {
    const reqJson = testObj[testJsonArr[2]]
    console.log('request:' + JSON.stringify(reqJson))
    chai.request('127.0.0.1:8081')
      .post('/api/imKey')
      .send(reqJson)
      .end((err, res) => {
        if (err) {
          console.log(err.stack)
        }
        console.log('response:' + JSON.stringify(res.body))
        expect(res.status).to.equal(200)
        expect(JSON.stringify(res.body.result)).to.equal(JSON.stringify(testObj[testJsonArr[3]].result))
        done()
      })
  }).timeout(30000)
  it('test ' + testJsonArr[4], (done) => {
    const reqJson = testObj[testJsonArr[4]]
    console.log('request:' + JSON.stringify(reqJson))
    chai.request('127.0.0.1:8081')
      .post('/api/imKey')
      .send(reqJson)
      .end((err, res) => {
        if (err) {
          console.log(err.stack)
        }
        console.log('response:' + JSON.stringify(res.body))
        expect(res.status).to.equal(200)
        expect(JSON.stringify(res.body.result)).to.equal(JSON.stringify(testObj[testJsonArr[5]].result))
        done()
      })
  }).timeout(30000)
  it('test ' + testJsonArr[6], (done) => {
    const reqJson = testObj[testJsonArr[6]]
    console.log('request:' + JSON.stringify(reqJson))
    chai.request('127.0.0.1:8081')
      .post('/api/imKey')
      .send(reqJson)
      .end((err, res) => {
        if (err) {
          console.log(err.stack)
        }
        console.log('response:' + JSON.stringify(res.body))
        expect(res.status).to.equal(200)
        expect(JSON.stringify(res.body.result)).to.equal(JSON.stringify(testObj[testJsonArr[7]].result))
        done()
      })
  }).timeout(30000)
  it('test ' + testJsonArr[8], (done) => {
    const reqJson = testObj[testJsonArr[8]]
    console.log('request:' + JSON.stringify(reqJson))
    chai.request('127.0.0.1:8081')
      .post('/api/imKey')
      .send(reqJson)
      .end((err, res) => {
        if (err) {
          console.log(err.stack)
        }
        console.log('response:' + JSON.stringify(res.body))
        expect(res.status).to.equal(200)
        expect(JSON.stringify(res.body.result)).to.equal(JSON.stringify(testObj[testJsonArr[9]].result))
        done()
      })
  }).timeout(30000)
  it('test ' + testJsonArr[10], (done) => {
    const reqJson = testObj[testJsonArr[10]]
    console.log('request:' + JSON.stringify(reqJson))
    chai.request('127.0.0.1:8081')
      .post('/api/imKey')
      .send(reqJson)
      .end((err, res) => {
        if (err) {
          console.log(err.stack)
        }
        console.log('response:' + JSON.stringify(res.body))
        expect(res.status).to.equal(200)
        expect(JSON.stringify(res.body.result)).to.equal(JSON.stringify(testObj[testJsonArr[11]].result))
        done()
      })
  }).timeout(30000)
  it('test ' + testJsonArr[12], (done) => {
    const reqJson = testObj[testJsonArr[12]]
    console.log('request:' + JSON.stringify(reqJson))
    chai.request('127.0.0.1:8081')
      .post('/api/imKey')
      .send(reqJson)
      .end((err, res) => {
        if (err) {
          console.log(err.stack)
        }
        console.log('response:' + JSON.stringify(res.body))
        expect(res.status).to.equal(200)
        expect(JSON.stringify(res.body.result)).to.equal(JSON.stringify(testObj[testJsonArr[13]].result))
        done()
      })
  }).timeout(30000)
  it('test ' + testJsonArr[14], (done) => {
    const reqJson = testObj[testJsonArr[14]]
    console.log('request:' + JSON.stringify(reqJson))
    chai.request('127.0.0.1:8081')
      .post('/api/imKey')
      .send(reqJson)
      .end((err, res) => {
        if (err) {
          console.log(err.stack)
        }
        console.log('response:' + JSON.stringify(res.body))
        expect(res.status).to.equal(200)
        expect(JSON.stringify(res.body.result)).to.equal(JSON.stringify(testObj[testJsonArr[15]].result))
        done()
      })
  }).timeout(30000)
  it('test ' + testJsonArr[16], (done) => {
    const reqJson = testObj[testJsonArr[16]]
    console.log('request:' + JSON.stringify(reqJson))
    chai.request('127.0.0.1:8081')
      .post('/api/imKey')
      .send(reqJson)
      .end((err, res) => {
        if (err) {
          console.log(err.stack)
        }
        console.log('response:' + JSON.stringify(res.body))
        expect(res.status).to.equal(200)
        expect(JSON.stringify(res.body.result)).to.equal(JSON.stringify(testObj[testJsonArr[17]].result))
        done()
      })
  }).timeout(30000)
  it('test ' + testJsonArr[18], (done) => {
    const reqJson = testObj[testJsonArr[18]]
    console.log('request:' + JSON.stringify(reqJson))
    chai.request('127.0.0.1:8081')
      .post('/api/imKey')
      .send(reqJson)
      .end((err, res) => {
        if (err) {
          console.log(err.stack)
        }
        console.log('response:' + JSON.stringify(res.body))
        expect(res.status).to.equal(200)
        expect(JSON.stringify(res.body.result)).to.equal(JSON.stringify(testObj[testJsonArr[19]].result))
        done()
      })
  }).timeout(30000)
  it('test ' + testJsonArr[20], (done) => {
    const reqJson = testObj[testJsonArr[20]]
    console.log('request:' + JSON.stringify(reqJson))
    chai.request('127.0.0.1:8081')
      .post('/api/imKey')
      .send(reqJson)
      .end((err, res) => {
        if (err) {
          console.log(err.stack)
        }
        console.log('response:' + JSON.stringify(res.body))
        expect(res.status).to.equal(200)
        expect(JSON.stringify(res.body.result)).to.equal(JSON.stringify(testObj[testJsonArr[21]].result))
        done()
      })
  }).timeout(30000)
  it('test ' + testJsonArr[22], (done) => {
    const reqJson = testObj[testJsonArr[22]]
    console.log('request:' + JSON.stringify(reqJson))
    chai.request('127.0.0.1:8081')
      .post('/api/imKey')
      .send(reqJson)
      .end((err, res) => {
        if (err) {
          console.log(err.stack)
        }
        console.log('response:' + JSON.stringify(res.body))
        expect(res.status).to.equal(200)
        expect(JSON.stringify(res.body.result)).to.equal(JSON.stringify(testObj[testJsonArr[23]].result))
        done()
      })
  }).timeout(30000)
  it('test ' + testJsonArr[24], (done) => {
    const reqJson = testObj[testJsonArr[24]]
    console.log('request:' + JSON.stringify(reqJson))
    chai.request('127.0.0.1:8081')
      .post('/api/imKey')
      .send(reqJson)
      .end((err, res) => {
        if (err) {
          console.log(err.stack)
        }
        console.log('response:' + JSON.stringify(res.body))
        expect(res.status).to.equal(200)
        expect(JSON.stringify(res.body.result)).to.equal(JSON.stringify(testObj[testJsonArr[25]].result))
        done()
      })
  }).timeout(30000)

  it('test ' + testJsonArr[26], (done) => {
    const reqJson = testObj[testJsonArr[26]]
    console.log('request:' + JSON.stringify(reqJson))
    chai.request('127.0.0.1:8081')
      .post('/api/imKey')
      .send(reqJson)
      .end((err, res) => {
        if (err) {
          console.log(err.stack)
        }
        console.log('response:' + JSON.stringify(res.body))
        expect(res.status).to.equal(200)
        expect(JSON.stringify(res.body.result)).to.equal(JSON.stringify(testObj[testJsonArr[27]].result))
        done()
      })
  }).timeout(30000)
  it('test ' + testJsonArr[28], (done) => {
    const reqJson = testObj[testJsonArr[28]]
    console.log('request:' + JSON.stringify(reqJson))
    chai.request('127.0.0.1:8081')
      .post('/api/imKey')
      .send(reqJson)
      .end((err, res) => {
        if (err) {
          console.log(err.stack)
        }
        console.log('response:' + JSON.stringify(res.body))
        expect(res.status).to.equal(200)
        expect(JSON.stringify(res.body.result)).to.equal(JSON.stringify(testObj[testJsonArr[29]].result))
        done()
      })
  }).timeout(30000)

  it('test ' + testJsonArr[30], (done) => {
    const reqJson = testObj[testJsonArr[30]]
    console.log('request:' + JSON.stringify(reqJson))
    chai.request('127.0.0.1:8081')
      .post('/api/imKey')
      .send(reqJson)
      .end((err, res) => {
        if (err) {
          console.log(err.stack)
        }
        console.log('response:' + JSON.stringify(res.body))
        expect(res.status).to.equal(200)
        expect(JSON.stringify(res.body.result)).to.equal(JSON.stringify(testObj[testJsonArr[31]].result))
        done()
      })
  }).timeout(30000)
  it('test ' + testJsonArr[32], (done) => {
    const reqJson = testObj[testJsonArr[32]]
    console.log('request:' + JSON.stringify(reqJson))
    chai.request('127.0.0.1:8081')
      .post('/api/imKey')
      .send(reqJson)
      .end((err, res) => {
        if (err) {
          console.log(err.stack)
        }
        console.log('response:' + JSON.stringify(res.body))
        expect(res.status).to.equal(200)
        expect(JSON.stringify(res.body.result)).to.equal(JSON.stringify(testObj[testJsonArr[33]].result))
        done()
      })
  }).timeout(30000)
  it('test ' + testJsonArr[34], (done) => {
    const reqJson = testObj[testJsonArr[34]]
    console.log('request:' + JSON.stringify(reqJson))
    chai.request('127.0.0.1:8081')
      .post('/api/imKey')
      .send(reqJson)
      .end((err, res) => {
        if (err) {
          console.log(err.stack)
        }
        console.log('response:' + JSON.stringify(res.body))
        expect(res.status).to.equal(200)
        expect(JSON.stringify(res.body.result)).to.equal(JSON.stringify(testObj[testJsonArr[35]].result))
        done()
      })
  }).timeout(30000)
  it('test ' + testJsonArr[36], (done) => {
    const reqJson = testObj[testJsonArr[36]]
    console.log('request:' + JSON.stringify(reqJson))
    chai.request('127.0.0.1:8081')
      .post('/api/imKey')
      .send(reqJson)
      .end((err, res) => {
        if (err) {
          console.log(err.stack)
        }
        console.log('response:' + JSON.stringify(res.body))
        expect(res.status).to.equal(200)
        expect(JSON.stringify(res.body.result)).to.equal(JSON.stringify(testObj[testJsonArr[37]].result))
        done()
      })
  }).timeout(30000)
  it('test ' + testJsonArr[38], (done) => {
    const reqJson = testObj[testJsonArr[38]]
    console.log('request:' + JSON.stringify(reqJson))
    chai.request('127.0.0.1:8081')
      .post('/api/imKey')
      .send(reqJson)
      .end((err, res) => {
        if (err) {
          console.log(err.stack)
        }
        console.log('response:' + JSON.stringify(res.body))
        expect(res.status).to.equal(200)
        expect(JSON.stringify(res.body.result)).to.equal(JSON.stringify(testObj[testJsonArr[39]].result))
        done()
      })
  }).timeout(30000)

  // describe('test btc.getXpub', () => {
  //     it('it should show sign result', (done) => {
  //         const reqJson = {
  //             jsonrpc: '2.0',
  //             method: 'btc.getXpub',
  //             params: {
  //                 network: 'MAINNET',
  //                 path: "m/44'/0'/0'/0/0"
  //             },
  //             id: 5
  //         }
  //
  //         chai.request('127.0.0.1:8081')
  //             .post('/api/imKey')
  //             .send(reqJson
  //             )
  //             .end((err, res) => {
  //                 if (err) {
  //                     console.log(err.stack)
  //                 }
  //                 console.log(res.body)
  //                 expect(res.status).to.equal(200)
  //                 expect(res.body.result.xpub).to.equal('xpub6FuzpGNBc46EfvmcvECyqXjrzGcKErQgpQcpvhw1tiC5yXvi1jUkzudMpdg5AaguiFstdVR5ASDbSceBswKRy6cAhpTgozmgxMUayPDrLLX')
  //                 done()
  //             })
  //     }).timeout(30000)
  //
  //
  //     it('test btc.getAddress', (done) => {
  //         chai.request('127.0.0.1:8081')
  //             .post('/api/imKey')
  //             .send({
  //                     jsonrpc: '2.0',
  //                     method: 'btc.getAddress',
  //                     params: {
  //                         network: 'MAINNET',
  //                         path: "m/44'/0'/0'/0/0"
  //                     },
  //                     id: 6
  //                 }
  //             )
  //             .end((err, res) => {
  //                 if (err) {
  //                     console.log(err.stack)
  //                 }
  //                 console.log(res.body)
  //                 expect(res.status).to.equal(200)
  //                 expect(res.body.result.address).to.equal('12z6UzsA3tjpaeuvA2Zr9jwx19Azz74D6g')
  //                 done()
  //             })
  //     }).timeout(30000)
  // })
})

function readFileToJsonObj (filePath) {
  console.log(filePath)
  // 现将json文件读出来
  const data = fs.readFileSync(filePath, 'utf-8')
  const dataString = data.toString()// 将二进制的数据转换为字符串
  const jsonObj = JSON.parse(dataString)// 将字符串转换为json对象
  // console.log(jsonObj);
  return jsonObj
  // var str = JSON.stringify(jsonObj);//因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
}
