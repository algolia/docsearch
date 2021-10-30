/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-commonjs */
const percyHealthCheck = require('@percy/cypress/task');

module.exports = (on) => {
  on('task', percyHealthCheck);
};
