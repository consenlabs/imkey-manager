//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
// let server = require('../server');
let should = chai.should();
let constants = require('../src/common/constants');


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
    describe('eos.messageSign', () => {
        it('it should show sign result', (done) => {
            chai.request("127.0.0.1:8080")
                .post('/imKey')
                .send( {
                    "action": "eos.messageSign",
                    "data": "imKey2019",
                    "isHex": false,
                    "path": "m/44'/194'/0'/0/0",
                    "publicKey": "EOS88XhiiP7Cu5TmAUJqHbyuhyYgd6sei68AU266PyetDDAtjmYWF",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.signature.should.eq("SIG_K1_K2mrf6ASTK5TCJC6kzZzyQm9uRZm7Jx4fa6gsmWx2sEreokRWmnHQGTRNwKLNF6NVJtXmjmUvR96XYct1DjMJnwRZBbTYR");
                    done();
                });
        });

        it('should throw error', (done) => {
            chai.request("127.0.0.1:8080")
                .post('/imKey')
                .send( {
                    "action": "eos.messageSign",
                    "data": "imKey2019",
                    "isHex": false,
                    "path": "m/44'/194'/0'/0/0",
                    "publicKey": "ErrorPubKey",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.signature.should.eq("SIG_K1_K2mrf6ASTK5TCJC6kzZzyQm9uRZm7Jx4fa6gsmWx2sEreokRWmnHQGTRNwKLNF6NVJtXmjmUvR96XYct1DjMJnwRZBbTYR");
                    done();
                });
        });
    });

});
