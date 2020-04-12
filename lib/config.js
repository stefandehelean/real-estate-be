module.exports = function (/*env*/) {
  const dev = require('./config/dev');
  /*const prod = require('./config/prod');
  switch (env) {
  case 'dev':
    return dev;
  case 'prod':
    return prod;
  default:*/
  return dev;
  /*}*/
};
