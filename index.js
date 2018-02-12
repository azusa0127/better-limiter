/**
 * better-limiter
 * A simple and smart rate limiter with promises.
 *
 * @author Phoenix (github.com/azusa0127)
 * @version 2.1.0
 */
const Semaphore = require(`simple-semaphore`);

/** Throttling limiter class to be exported. */
class Limiter {
  /**
   * Creates a limiter.
   * @param {number} [interval=1.01] - The time interval in seconds.
   * @param {number} [rate=10] - The number of operations allowed in the time interval.
   * @param {bool} [evenMode=false] - If to resolve a single task for every (interval/rate) second instead of resolving [rate] tasks for every [interval] second.
   */
  constructor (interval = 1.01, rate = 10, evenMode = false) {
    // Initialize the internal semaphore.
    this.sem = new Semaphore(evenMode ? 1 : rate);
    // Initialize the timer to be null and only start it at the first call.
    this._timer = null;
    // Handle for the first enter call to start the interval loop.
    this._setTimer = () => {
      if (this._timer) return; // Escape when timer is already set.
      this._timer = evenMode
        ? setInterval(() => this.sem.signal(1 - this.sem._sem), interval * 1000 / rate)
        : setInterval(() => this.sem.signal(rate - this.sem._sem), interval * 1000);
    };
  }

  /**
   * Enqueue into the limiter and return a promise to be resolved automatically at the right time.
   * @async
   * @return {Promise<void>} - a promise that resolves automatically at the right time.
   */
  enter () {
    if (!this._timer) this._setTimer();
    return this.sem.wait().then(() => {
      if (!this.sem._queue.length) this.terminate(true);
    });
  }

  /**
   * Throttle a function call.
   * @async
   * @param {Function} fn - Function to be called after waiting.
   * @param {...*} args - Arguments for calling fn().
   * @return {Promise<*>} - Promise of the result returned from fn(args).
   */
  throttle (fn, ...args) {
    return this.enter().then(() => fn(...args));
  }

  /**
   * Make a throttled version of function fn.
   * @param {Function} fn - Function to be throttled.
   * @return {Function} - The throttled fn with return type of promise from @see Limiter.throttle
   */
  makeThrottledFn (fn) {
    return (...args) => this.throttle(fn, ...args);
  }

  /**
   * Manually ternimate the interval loop. [This is normally invoked by this.enter() automaticly.]
   * @param {bool} [releaseLeftoverTasks=false] - If to release tasks in the queue or reject them.
   */
  terminate (releaseLeftoverTasks = false) {
    clearInterval(this._timer);
    this._timer = null;
    if (this.sem._queue.length) {
      releaseLeftoverTasks ? this.sem.signal(this.sem._queue.length) : this.sem.rejectAll();
    }
  }
}

module.exports = Limiter;
