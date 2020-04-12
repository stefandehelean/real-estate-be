module.exports = function (app) {
  const mongoose = require('mongoose');
  let reconnect = 0;

  if (app.config.env === 'test') {
    const Mockgoose = require('mockgoose').Mockgoose;
    const mockgoose = new Mockgoose(mongoose);
    mockgoose.prepareStorage().then(function () {
      mongoose.connect('mongodb://127.0.0.1:27017/db-test', {
        socketTimeoutMS: 0,
        keepAlive: true,
        reconnectTries: 30
      });
    });
  } else {
    /**
     * need to plug in native promises to work with promises instead of callbacks
     */
    mongoose.Promise = global.Promise;

    const connectWithRetry = () => {
      mongoose.connect(app.config.db, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, function (err) {
        if (err) {
          reconnect++;
          if (reconnect === 3) {
            reconnect = 0;
            logger.log('Failed to connect to mongodb ', err);
          } else {
            setTimeout(connectWithRetry, 1000);
          }
        }
      });
    };
    connectWithRetry();

  }

};
