# better-limiter
A simple and smart rate limiter in promise.

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

### Require and Initiliaze
```javascript
const Limiter = require(`better-limiter`);

const limt = new Limiter(3.0, 3); // 3 operations allowed for every 3 seconds.
const even_limt = new Limiter(3.0, 3, true); // 1 operation allowed for every (3.0/3)=1.0 second.
```
### Throttle function calles
```javascript
// Limit log scrolling speed.
for (let i = 0; i < 7; ++i) {
  limt.throttle(console.log, `better-limiter Demo: NormalMode - ${i}`);
  even_limt.throttle(console.error, `better-limiter Demo: EvenMode - ${i}`);
}
```
### Make Throttled Functions and redirect the calls.
```javascript
const request = require(`request`);
// redirect request.get() to a throttled version get()
const get = limt.makeThrottledFn(request.get);

for (let i = 0; i < 10; ++i)
  get(`http://google.com`, (err, res) => console.log(`Request#${i} - ${res.statusCode}`));
```

## Changelog
2.0.0 / 2017-08-10
  * (Performance) Performance imporvement with updated `simple-semaphore`.
  + (New API) `throttle(fn, ...args)` and `makeThrottledFn(fn)` added.
  * (Deprecate) Renamed `release()` into `terminate(releaseLeftoverTasks)` with minor functionality tweak.
  * (JSDoc) Style improvement.

1.0.3 / 2017-08-09
  * README revision and bug-fix.

1.0.0 / Initial Release.

## Lisense
Licensed under MIT
Copyright (c) 2017 Phoenix Song
