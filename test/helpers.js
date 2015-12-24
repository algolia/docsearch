/* eslint-env mocha */
global.ddescribe = describe.only;
global.xdescribe = describe.skip;
global.iit = it.only;
global.xit = it.skip;

/**
 * Wait for max `escapeTime` ms and run `runFunction` except if `escapeFunction` returned true
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
