/**
 * better-limiter example - Request rate limiting.
 *
 * @author Phoenix(github.com/azusa0127)
 */
const rp = require(`util`).promisify(require(`request`));
const Limiter = require(`./index`);

// Setup a limiter with rate of 3 per 3 second.
const limt = new Limiter(3.0, 3);
// Setup a limiter in evenMode with rate of 3 per 3 second.
const even_limt = new Limiter(3.0, 3, true);

// Redirect the promisified request() through the limiter.
const request = (...args) => limt.enter().then(() => rp(...args));

// Redirect the promisified request() through the limiter in evenMode.
const evenRequest = async (...args) => {
  await even_limt.enter();
  return rp(...args);
};

// Async wrapped main function.
const main = async () => {
  console.log(`${new Date().toLocaleTimeString()} - Start limt demo...`);
  await Promise.all(
    [...Array(6)].map(() =>  // [...Array(6)] is simply an list of 6 undefined elements.
      request(`http://google.com`).then(res =>
        console.log(`${new Date().toLocaleTimeString()} - ResponseCode - ${res.statusCode}`),
      ),
    ),
  );
  console.log(`${new Date().toLocaleTimeString()} - End limt demo...`);
  console.log();
  console.log(`${new Date().toLocaleTimeString()} - Start even_limt demo...`);
  await Promise.all(
    [...Array(6)].map(() =>
      evenRequest(`http://google.com`).then(res =>
        console.log(`${new Date().toLocaleTimeString()} - ResponseCode - ${res.statusCode}`),
      ),
    ),
  );
  console.log(`${new Date().toLocaleTimeString()} - End even_limt demo...`);
};

// invoke the main function.
main().then(() => console.log(`Done!`), err => console.error(err) && console.trace(err));
