const assert = require('assert');
const makeStub = require('mocha-make-stub');
const request = require('superagent');
const should = require('should');

const zenvia = require('..');
const Zenvia = zenvia.Zenvia

describe('zenvia', () => {
  it('exists', () => {
    assert(Zenvia);
    assert(Zenvia instanceof Function);
    assert(zenvia instanceof Zenvia);
  });

  describe('when the request is successful', function () {
    makeStub(request.Request.prototype, 'end', function (cb) {
      cb(null, {
        status: 200,
        body: {
          id: '1234',
        }
      });
    });

    it('resolves to the HTTP response', function (done) {
      zenvia.send({
        from: 'beijaflor',
        msg: 'Hello World',
        to: '123123123123',
      }, (err, result) => {
        if (err) return done(err);
        result.should.have.properties([
          'id',
          'response',
          'request',
          'error',
          'message',
        ]);
        done();
      })
    });

    it('calls options.log', function (done) {
      let logged = 0;
      zenvia.send({
        from: 'beijaflor',
        msg: 'Hello World',
        to: '123123123123',
      }, (err, result) => {
        if (err) return done(err);
        assert(logged > 0);
        result.should.have.properties([
          'id',
          'response',
          'request',
          'error',
          'message',
        ]);
        done();
      }, {
        log: () => {
          logged += 1;
        },
      });
    });
  });
});
