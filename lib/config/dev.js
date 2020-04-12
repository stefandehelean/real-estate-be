const tokenSecret = process.env.SECRET || 'supersecret';
const env = 'dev';
const db = 'mongodb://localhost:27017/node-server-dev';
const fbAppId = '333179914323347';
const fbAppSecret = '4662a1e472586d9c64b2156e82417f34';

module.exports = {
  'tokenSecret': tokenSecret,
  'tokenExpires': 3600,
  'env': env,
  'db': db,
  'fbAppId': fbAppId,
  'fbAppSecret': fbAppSecret,
  'fbRedirect_uri': 'http://localhost:3000/facebookauth'
};
