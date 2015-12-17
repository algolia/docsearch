/* eslint-env mocha */
global.ddescribe = describe.only;
global.xdescribe = describe.skip;
global.iit = it.only;
global.xit = it.skip;
