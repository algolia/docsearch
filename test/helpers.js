/* eslint-env mocha */
global.ddescribe = describe.only;
global.xdescribe = describe.skip;
global.iit = it.only;
global.xit = it.skip;

/**
 * Runs `runFunction` only when `escapeFunction` returns true. Timeout after
 * `escapeTime`ms.
 * @function waitForAndRun
 * @param {function} escapeFunction Function to wait for. Once it returns
 * `true`, we execute `runFunction`
 * @param {function} runFunction Function to run once `escapeFunction` returns
 * `true.
 * @param  {number} escapeTime Time (in ms) after which we timeout.
 * @returns {void}
 */
function waitForAndRun(escapeFunction, runFunction, escapeTime) {
  // check the escapeFunction every millisecond so as soon as it is met we can escape the function
  var interval = setInterval(function() {
    if (escapeFunction()) {
      clearMe();
      runFunction();
    }
  }, 1);
  // in case we never reach the escapeFunction, we will time out
  // at the escapeTime
  var timeOut = setTimeout(function() {
    clearMe();
    runFunction();
  }, escapeTime);
  // clear the interval and the timeout
  function clearMe() {
    clearInterval(interval);
    clearTimeout(timeOut);
  }
}

module.exports = {
  waitForAndRun
};
