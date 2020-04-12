module.exports = function (app) {
  if (!app) throw new Error('Missing parameter: "app" not provided.');

  const express = require('express'),
    UserController = express.Router(),
    UserProvider = require('./UserProvider')(app),
    VerifyToken = require(__root + 'helpers/VerifyToken')(app);

  // REGISTER A USER
  UserController.post('/register', UserProvider.register);

  // LOGIN A USER
  UserController.post('/login', UserProvider.login);

  // LOGOUT A USER
  UserController.post('/logout', VerifyToken, UserProvider.logout);

  // LOGIN A USER USING FB
  UserController.post('/loginFB', UserProvider.loginFB);

  // RETURNS ALL THE USERS IN THE DATABASE
  UserController.get('/', VerifyToken, UserProvider.getAll);

  // GETS A SINGLE USER FROM THE DATABASE
  UserController.get('/:id([0-9a-z]{24})', VerifyToken, UserProvider.getById);

  // CHECK RESET PASSWORD TOKEN
  UserController.all('/*', (req, res) => {
    res.status(400).send('Bad request.');
  });

  return UserController;

};
