module.exports = function (app) {
  if (!app) throw new Error('Missing parameter: "app" not provided.');

  const express = require('express'),
    PropertyController = express.Router(),
    PropertyProvider = require('./PropertyProvider')(),
    VerifyToken = require(__root + 'helpers/VerifyToken')(app);

  // ADD PROPERTY INTO THE DATABASE
  PropertyController.post('/', VerifyToken, PropertyProvider.create);

  // RETURNS ALL THE PROPERTIES FROM THE DATABASE
  PropertyController.get('/', VerifyToken, PropertyProvider.getAll);

  // GETS A SINGLE PROPERTY FROM THE DATABASE
  PropertyController.get('/:id([0-9a-z]{24})', VerifyToken, PropertyProvider.getById);

  return PropertyController;

};
