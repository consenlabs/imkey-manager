//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
// let server = require('../server');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Api', () => {
    beforeEach((done) => { //Before each test we empty the database
        Book.remove({}, (err) => {
            done();
        });
    });
    /*
      * Test the /GET route
      */
    describe('/GET book', () => {
        it('it should GET all the books', (done) => {
            chai.request("http://127.0.0.1:8888")
                .post('/imkey', {})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

});
