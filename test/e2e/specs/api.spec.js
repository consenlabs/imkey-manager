//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
// let server = require('../server');
let should = chai.should();
let constants = require('../../../src/common/constants');


chai.use(chaiHttp);

//Our parent block
describe('Api', () => {
    // beforeEach((done) => { //Before each test we empty the database
    //     Book.remove({}, (err) => {
    //         done();
    //     });
    // });
    /*
      * Test the /GET route
      */
    describe('test btc.getXpub', () => {
        it('it should show sign result', (done) => {
            let reqJson ={
                "jsonrpc":"2.0",
                "method":"btc.getXpub",
                "params":{
                    "network":"MAINNET",
                    "path":"m/44'/0'/0'/0/0"
                },
                "id": 5
            }

            chai.request("127.0.0.1:8081")
                .post('/api/imKey')
                .send(reqJson
                    )
                .end((err, res) => {
                    // expect(res.status).to.equal(200)
                    expect(res.body.result.xpub).to.equal("xpub6FuzpGNBc46EfvmcvECyqXjrzGcKErQgpQcpvhw1tiC5yXvi1jUkzudMpdg5AaguiFstdVR5ASDbSceBswKRy6cAhpTgozmgxMUayPDrLLX")
                    done();
                });
        }).timeout(5000);

        it('test btc.getAddress', (done) => {
            chai.request("127.0.0.1:8081")
                .post('/api/imKey')
                .send({
                        "jsonrpc":"2.0",
                        "method":"btc.getAddress",
                        "params":{
                            "network":"MAINNET",
                            "path":"m/44'/0'/0'/0/0"
                        },
                        "id": 6
                    }
                )
                .end((err, res) => {
                    // expect(res.status).to.equal(200)
                    expect(res.body.result.address).to.equal("12z6UzsA3tjpaeuvA2Zr9jwx19Azz74D6g")
                    done();
                });
        }).timeout(5000);
    });

});