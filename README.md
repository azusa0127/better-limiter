# better-limiter
A simple and smart rate limiter for general use with promise support.

## Install
```bash
npm install better-limiter
```

## Requirement

`NodeJS 7.6.0+` as async/await feature is used.

## API
```javascript
class Limiter {
  /**
   * Creates an instance of Limiter.
   *
   * @param {number} [interval=1.01] Time interval length in seconds for a rate period.
   * @param {number} [rate=10] Rate limit in an time interval.
   * @param {bool} [evenMode=false] Spread the task evenly in the time interval, resolve a single task for every (interval/rate) second.
   *
   * @memberof Limiter
   */
  constructor(interval = 1.01, rate = 10, evenMode = false) {}

  /**
   * Enter the limiter queue.
   *
   * It automatically starts the interval loop at the first call and terminates the interval loop when no waiting task left.
   *
   * @async This is an async function.
   * @return a promise that only resolves if meets the rate limit. This promise never rejacts.
   * @memberof Limiter
   */
  async enter() {}

  /**
   * Manually ternimate the interval loop and release all waiting task task in the queue.
   *
   * @memberof Limiter
   */
  release() {}
}

module.exports = Limiter;
```

## Example
See a full example in [`example.js`](/example.js)

Require
```javascript
const Limiter = require(`better-limiter`);
```
Initiliaze
```javascript
const limt = new Limiter(3.0, 3);
const even_limt = new Limiter(3.0, 3, true);
```
Redirect the request() function through the limiter
```javascript
const rp = require(`util`).promisify(require(`request`)); // Promisified reqeust()

const request = async (...args) => {
  await limt.enter(); // That's the only line you need :).
  return rp(...args);
};
// Or in promise style.
const request = (...args) => limt.enter().then(() => rp(...args));

// You may now use request() as you do as usual with promise.
```
## Changelog
1.0.1 / 2017-08-09
  * README typo-fix.

1.0.0 / Initial Release.

## Lisense
Licensed under MIT
Copyright (c) 2017 Phoenix Song
