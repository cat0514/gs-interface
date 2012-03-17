var request = require('./support/http');

function getCookie(res) {
  return res.headers['set-cookie'][0].split(';')[0];
}

function auth(theID) {
    return  request()
            .post('/login')
            .set('content-type', 'application/json')
            .write(JSON.stringify(theID));
}

describe('member', function() {
    var cookie;
    describe('#login unit test', function() {
        it('#should can not authenticate for wrong email', function(done) {
            auth({
                    identification: {
                        username:"do_not_exist@gste.com",
                        password:"e10adc3949ba59abbe56e057f20f883e"
                    }
            })
            .expect(404, done);
        })

        it('#should can not authenticate for wrong password', function(done) {
            auth({
                    identification: {
                        username:"gbo@gste.com",
                        password:"this is wrong password"
                    }
            })
            .expect(401, done);
        })

        it('#should can not authenticate for forbidden', function(done) {
            auth({
                    identification: {
                        username:"forbiddenUser",
                        password:"e10adc3949ba59abbe56e057f20f883e"
                    }
            })
            .expect(403, done);
        })

        it('#should authenticate with nickname', function(done) {
            auth({
                    identification: {
                        username:"张三",
                        password:"e10adc3949ba59abbe56e057f20f883e"
                    }
            })
            .end(function(res) {
                res.statusCode.should.equal(200);
                res.should.be.json;
                res.headers.should.have.property('set-cookie');
                res.body.should.include("张三");
                done();
            })
        })
        
        it('#should authenticate with email', function(done) {
            auth({
                    identification: {
                        username:"gbo@gste.com",
                        password:"e10adc3949ba59abbe56e057f20f883e"
                    }
            })
            .end(function(res) {
                res.statusCode.should.equal(200);
                res.should.be.json;
                res.headers.should.have.property('set-cookie');
                res.body.should.include("张三");
                done();
            })
        })
        
        it('#should authenticate with phone', function(done) {
            auth({
                    identification: {
                        username:"18912345678",
                        password:"e10adc3949ba59abbe56e057f20f883e"
                    }
            })
            .end(function(res) {
                res.statusCode.should.equal(200);
                res.should.be.json;
                res.headers.should.have.property('set-cookie');
                res.body.should.include("张三");
                done();
            })
        })
    })
})