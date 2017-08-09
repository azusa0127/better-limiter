/**
 * better-limiter
 * A simple and smart rate limiter for general use with promise support.
 *
 * @author Phoenix (github.com/azusa0127)
 * @version 1.0.2
 */
const Semaphore = require(`simple-semaphore`);

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
  constructor(interval = 1.01, rate = 10, evenMode = false) {
    // Initialize the internal semaphore.
    this.sem = new Semaphore(evenMode ? 1 : rate);
    // Initialize the timer to be null and only start it at the first call.
    this.timer = null;
    // Handle for the first enter call to start the interval loop.
    this._setTimer = () => {
      this.timer = evenMode
        ? setInterval(() => this.sem.signal(1 - this.sem._sem), interval * 1000 / rate)
        : setInterval(() => this.sem.signal(rate - this.sem._sem), interval * 1000);
    };
  }

  /**
   * Enter the limiter queue.
   *
   * It automatically starts the interval loop at the first call and terminates the interval loop when no waiting task left.
   *
   * @async This is an async function.
   * @return a promise that only resolves if meets the rate limit.
   * @memberof Limiter
   */
  async enter() {
    await this.sem.wait();
    if (!this.timer && this.sem._queue) this._setTimer();
    else if (!this.sem._queue.length) this.release();
  }

  /**
   * Manually ternimate the interval loop and release all waiting task task in the queue.
   *
   * @memberof Limiter
   */
  release() {
    clearInterval(this.timer);
    this.timer = null;
    if (this.sem._queue.length) this.sem.signal(this.sem._queue.length);
  }
}

module.exports = Limiter;
