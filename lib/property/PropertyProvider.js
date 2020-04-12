const Property = require('./Property.js');

module.exports = function () {
  function create(req, res, next) {
    const {name, description, location, city, sold_price, currency, images, type} = req.body;

    if (!name) {
      return next(new HttpError(400, 'Name is required.'));
    }

    if (!location) {
      return next(new HttpError(400, 'Location is required.'));
    }

    if (!city) {
      return next(new HttpError(400, 'City is required.'));
    }

    if (!sold_price) {
      return next(new HttpError(400, 'Sold price is required.'));
    }

    if (!images) {
      return next(new HttpError(400, 'Images is required.'));
    }

    if (!type) {
      return next(new HttpError(400, 'Type is required.'));
    }

    return Property.findOne({name: name, location: location, sold_price: sold_price, type: type})
      .then(propertyFind => {
        if (propertyFind) {
          return Promise.reject(new HttpError(400, 'Property already exists.'));
        } else {
          return Promise.resolve();
        }
      })
      .then(() => Property.create({
        name: name,
        description: description,
        location: location,
        city: city,
        sold_price: sold_price,
        currency: currency,
        images: images,
        type: type
      }))
      .then(propertySend => res.status(201).send(propertySend))
      .catch(err => next(new Error(err)));
  }

  function getAll(req, res, next) {
    //eslint-disable-next-line
    console.log(req.query);
    const filter = {};
    const {priceMax, city} = req.query;

    if (priceMax) {
      filter.sold_price = { $lte: priceMax };
    }

    if (city) {
      filter.city = city;
    }

    //eslint-disable-next-line
    console.log(filter);

    return Property.find(filter).sort({ isDeleted: 1, year: 1 })
      .then(properties => res.status(200).send(properties))
      .catch(err => next(new Error(err)));
  }

  function getById(req, res, next) {
    const id = req.params.id;

    return Property.findById({_id: id})
      .then(property => {
        if (property) {
          res.status(200).send(property);
        } else {
          res.status(400).send(`No property with id: ${id} was found.`);
        }
      })
      .catch(err => next(new Error(err)));
  }

  return {
    create,
    getAll,
    getById,
  };
};