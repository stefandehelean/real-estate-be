const Mocha = require('mocha');

const mocha = new Mocha();

//// Add test files
const testDir = 'test';
var files = Mocha.utils.lookupFiles(testDir,['js'], true);
files.forEach(function(file) {
  mocha.addFile(file);
});

global.__root = __dirname + '/';

//// Global export of mutil
global.mutil = {
  getApp: getApp
};

//// Chai - Configure
const chai = require('chai');
chai.use(require('chai-http'));
chai.use(require('chai-as-promised'));


//// run the server and get the app object
const server = require('./lib/server');
let appToReturn;
server.serve('test')
  .then(function (app) {
    appToReturn = app;
    mocha.ui('bdd').run(() => process.exit()); // exit the node process on test end
  })
  .catch('Failed to start test server.');

///////////////////////////
//// MUTIL functions 
///////////////////////////
function getApp(){
  return appToReturn;
}
