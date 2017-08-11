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
   * Creates a limiter.
   * @param {number} [interval=1.01] - The time interval in seconds.
   * @param {number} [rate=10] - The number of operations allowed in the time interval.
   * @param {bool} [evenMode=false] - If to resolve a single task for every (interval/rate) second instead of resolving [rate] tasks for every [interval] second.
   */
  constructor(interval = 1.01, rate = 10, evenMode = false) {}

  /**
   * Enqueue into the limiter and return a promise to be resolved automatically at the right time.
   * @async
   * @return {Promise<undefind>} a promise that resolves automatically at the right time.
   */
  enter() {}

  /**
   * Throttle a function call.
   * @param {Function} fn Function to be called after waiting.
   * @param {...any} [...args] Arguments for calling fn().
   * @async
   * @return {Promise<any>} promise of return from fn(args).
   */
  throttle(fn, ...args) {}

  /**
   * Make a throttled version of function fn.
   * @param {Function} fn Function to be throttled.
   * @return {Function} The throttled fn with return type of promise from @see Limiter.throttle
   */
  makeThrottledFn(fn) {}

  /**
   * Manually ternimate the interval loop. [This is normally invoked by this.enter() automaticly.]
   * @param {bool} [releaseLeftoverTasks=false] If to release tasks in the queue or reject them.
   */
  terminate(releaseLeftoverTasks = false) {}
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
2.0.1 / 2017-08-10
  * (README) API document update.

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
