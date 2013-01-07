var ap = require('../lib/audioPaper');
var json = require('./fixtures/audioPaper')

describe('AudioPaper ', function(){
  it('should success find one data', function(done){
		var opt = {
			query: {
				creator_id:4
			},
			limit: {
				start:1,
				end:1
			}
		}
    ap.find(opt, function(data) {
			console.log(data)
			console.log(json)
			// data.should.eql(json)
	    data.should.have.property('member')
			// data.member.should.eql(json.member)
			// data.should.have.property('word')
			done()
    }, done);
  })
})