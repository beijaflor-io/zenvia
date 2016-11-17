# zenvia
[![npm downloads per month](http://img.shields.io/npm/dm/zenvia.svg)](https://www.npmjs.org/package/zenvia)
[![npm version](https://img.shields.io/npm/v/zenvia.svg)](https://www.npmjs.org/package/zenvia)
- - -

API wrapper for Zenvia SMSs API

## Install
```
npm install zenvia
```

## Usage
```javascript
const zenvia = require('zenvia');
zenvia.send({
  to: '5511971730898',
  from: 'agenda0',
  msg: 'Não se esqueça do seu compromisso amanhã às 16h com Pedro. Veja mais em: https://ag0.io/asdfdf',
}, (err, result) => {
  // ...
});
```

## Usage with promises
```javascript
const Promise = require('bluebird');
const zenvia = require('zenvia');
Promise.promisifyAll(zenvia);

zenvia.sendAsync({
  to: '5511971730898',
  from: 'agenda0',
  msg: 'Não se esqueça do seu compromisso amanhã às 16h com Pedro. Veja mais em: https://ag0.io/asdfdf',
}).then((result) => {
});
```

## Logging the requests and responses
```javascript
const zenvia = require('zenvia');

zenvia.send({
  to: '5511971730898',
  from: 'agenda0',
  msg: 'Não se esqueça do seu compromisso amanhã às 16h com Pedro. Veja mais em: https://ag0.io/asdfdf',
}, (err, result) => {
  // Handle response
}, {
  log: (log) => {
    // Insert in a database for auditting
  },
});
```

## Creating multiple instances of the Zenvia class
```javascript
const Zenvia = require('zenvia').Zenvia;
const zenvia1 = new Zenvia(options1);
const zenvia2 = new Zenvia(options2);
// ...
```

## TODO
- Receiving messages

## License
AGPLv3
