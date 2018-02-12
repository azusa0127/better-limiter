/**
 * better-limiter example - Request rate limiting.
 *
 * @author Phoenix(github.com/azusa0127)
 */
const got = require('got');
const Limiter = require(`./index`);

// Setup a limiter with rate of 3 per 3 second.
const Limt = new Limiter(3.0, 3);
// Setup a limiter in evenMode with rate of 3 per 3 second.
const EvenLimt = new Limiter(3.0, 3, true);

// Redirect the promisified request() through the limiter.
const request = (...args) => Limt.enter().then(() => got(...args));

// Redirect the promisified request() through the limiter in evenMode.
const evenRequest = async (...args) => {
  await EvenLimt.enter();
  return got(...args);
};

// Async wrapped main function.
const main = async () => {
  console.log(`${new Date().toLocaleTimeString()} - Start Limt demo...`);
  await Promise.all(
    [...Array(6)].map(() =>
      // [...Array(6)] is simply a list of 6 undefined elements.
      request(`http://google.com`).then(res =>
        console.log(`${new Date().toLocaleTimeString()} - ResponseCode - ${res.statusCode}`)
      )
    )
  );
  console.log(`${new Date().toLocaleTimeString()} - End Limt demo...`);
  console.log();
  console.log(`${new Date().toLocaleTimeString()} - Start EvenLimt demo...`);
  await Promise.all(
    [...Array(6)].map(() =>
      evenRequest(`http://google.com`).then(res =>
        console.log(`${new Date().toLocaleTimeString()} - ResponseCode - ${res.statusCode}`)
      )
    )
  );
  console.log(`${new Date().toLocaleTimeString()} - End EvenLimt demo...`);
  console.log();
  console.log(`${new Date().toLocaleTimeString()} - Manual Interception demo...`);
  const p = Promise.all(
    [...Array(10)].map(() =>
      request(`http://google.com`).then(
        res => console.log(`${new Date().toLocaleTimeString()} - ResponseCode - ${res.statusCode}`),
        err =>
          console.error(
            `${new Date().toLocaleTimeString()} - Request task rejected - ${err.message}`
          )
      )
    )
  );
  Limt.terminate(false);
  await p;
  console.log(`${new Date().toLocaleTimeString()} - Manual Interception demo...`);
};

// invoke the main function.
main().then(() => console.log(`Done!`), err => console.error(err) && console.trace(err));
