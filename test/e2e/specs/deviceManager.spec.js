const chai = require('chai')
const deviceManager = require('../../../src/api/devicemanager')

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
            const  sid = deviceManager.getSn();
            expect(sid).to.eq("");
        }).timeout(500000)


    })
})
