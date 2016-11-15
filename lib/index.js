'use strict';
const assert = require('assert');
const debug = require('debug')('zenvia');
const request = require('superagent');
const uuid = require('uuid');

class Zenvia {
  constructor(options = {}) {
    this.user = options.user;
    this.password = options.password;
    this.log = options.log;
  }

  /**
   * Sends a SMS message with zenvia.
   *
   * `options.log` receives an object with: `error` (boolean), `request`,
   * `response`, `responseStatus`, `responseHeaders`, `cause` (Error)
   *
   * @param {Object} message
   * @param {String} [message.id=uuid()] The client id for the message
   * @param {String} message.to The recipient for the message including country
   * and area codes
   * @param {String} message.from The label to show on the beginning of the message
   * @param {String} message.msg The body of the message
   * @param {String} [message.aggregateId]
   *
   * @param {Function} cb A callback function
   *
   * @param {Object} options
   * @param {Function} [options.log] A function to use to log reqs and res
   * @param {String} [options.user=process.env.ZENVIA_API_USER]
   * @param {String} [options.password=process.env.ZENVIA_API_PASSWORD]
   */

  send(message, cb, options) {
    if (!options) options = {};
    if (!options.log && this.log) {
      options.log = (obj) => this.log(obj);
    }
    if (!options.log) {
      options.log = () => {};
    }

    // Don't modify the parameter
    message = Object.assign({}, message);

    // Generate client id
    if (!message.id) {
      message.id = uuid();
    }

    try {
      assert(message.id, 'Missing `message.id`');
      assert(message.to, 'Missing `message.recipient`');
      assert(message.from, 'Missing `message.from`');
      assert(message.msg, 'Missing `message.msg`');
      assert(message.msg.length <= 140, '`message.msg` needs to be shorter or equal to 140 characters');
    } catch (err) {
      return cb(err);
    }

    const messageRequest = {
      sendSmsRequest: message,
    };

    debug('Sending SMS request', message.id);
    request
      .post('https://api-rest.zenvia360.com.br/services/send-sms')
      .auth(
        options.user || this.user || process.env.ZENVIA_API_USER,
        options.password || this.password || process.env.ZENVIA_API_PASSWORD
      )
      .set('accept', 'application/json')
      .send(messageRequest)
      .end((err, res) => {
        if (err) {
          debug('Error with SMS request', message.id, err.message || err);
          options.log({
            error: true,
            cause: err,
            responseStatus: res && res.status,
            responseHeaders: res && res.headers,
            response: res && (res.body || res.text),
            request: messageRequest,
          });
          cb(err);
          return;
        }

        if (!res || res.status !== 200) {
          err = new Error('Failed to create zenvia message');
          debug('Error with SMS request', message.id, err.message || err);
          options.log({
            error: true,
            cause: err,
            responseStatus: res && res.status,
            responseHeaders: res && res.headers,
            response: res && (res.body || res.text),
            request: messageRequest,
          });
          cb(err);
          return;
        }

        const success = {
          id: message.id,
          response: res.body || res.text,
          message: message,
          error: false,
          request: messageRequest,
        };

        debug('Success with SMS request', message.id);
        options.log({
          error: false,
          responseStatus: res && res.status,
          responseHeaders: res && res.headers,
          response: res && (res.body || res.text),
          request: messageRequest,
        });
        cb(null, success);
      });
  }
}

exports = module.exports = new Zenvia();
exports.Zenvia = Zenvia;
