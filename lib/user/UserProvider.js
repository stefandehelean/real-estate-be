const User = require('./User.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs-then');
const axios = require('axios');

module.exports = function (app) {
  function signToken(id) {
    return jwt.sign({
      id: id
    }, app.config.tokenSecret, {
      expiresIn: app.config.tokenExpires
    });
  }

  async function getFBAccessTokenFromCode(code) {
    const { data } = await axios({
      url: 'https://graph.facebook.com/v6.0/oauth/access_token',
      method: 'get',
      params: {
        client_id: app.config.fbAppId,
        client_secret: app.config.fbAppSecret,
        redirect_uri: 'http://localhost:3000/facebookauth',
        code: code,
      },
    });
    return getFacebookUserData(data.access_token);
  }

  async function getFacebookUserData(access_token) {
    const { data } = await axios({
      url: 'https://graph.facebook.com/me',
      method: 'get',
      params: {
        fields: ['id', 'email', 'first_name', 'last_name'].join(','),
        access_token: access_token,
      },
    });
    return data;
  }

  function hashGenerate(password) {
    return bcrypt.hash(password, 8);
  }

  function register(req, res, next) {
    const {
      fullName,
      password,
      confirmPassword,
      email,
      phone
    } = req.body;

    const createByEmailOrPhone = {};

    if (!fullName) {
      return next(new HttpError(400, 'Full name is required.'));
    }

    if (!password) {
      return next(new HttpError(400, 'Password is required.'));
    }

    if (!confirmPassword) {
      return next(new HttpError(400, 'Password is required.'));
    }

    if (password !== confirmPassword) {
      return next(new HttpError(400, 'Password and confirm password must match.'));
    }

    if (email) {
      createByEmailOrPhone.email = email;
    } else {
      return next(new HttpError(400, 'Email or phone number is required.'));
    }

    return User.findOne(createByEmailOrPhone)
      .then(user => {
        if (user) {
          return next(new HttpError(400, 'User already exists.'));
        } else {
          return hashGenerate(password)
            .then(hash => {
              const registerUser = {
                email: email,
                password: hash,
                phone: phone,
                fullName: fullName.trim(),
                resetPassword: {}
              };

              return User.create(registerUser)
                .then(createdUser => {
                  res.status(201).send(createdUser);
                })
                .catch(err => {
                  return next(err);
                });
            });
        }
      })
      .catch(err => next(new Error(err)));
  }

  function login(req, res, next) {
    let _token, _user, query;
    const {
      email,
      password,
      phone
    } = req.body;
    if (email) {
      query = {email: email};
    } else if (phone) {
      query = {phone: phone};
    } else {
      return next(new HttpError(400, 'Email or phone number is required.'));
    }

    if (!password) {
      return next(new HttpError(400, 'Password is required.'));
    }

    return User.findOne(query)
      .then(user => {
        if (!user) {
          if (query.email) {
            return Promise.reject((new HttpError(400, 'No user found.')));
          } else {
            return Promise.reject((new HttpError(400, 'No user found.')));
          }
        }
        _user = user;
        return user.password;
      })
      .then(userPassword => {
        if (password) {
          return bcrypt.compare(password, userPassword);
        }
      })
      .then(passwordIsValid => {
        if (passwordIsValid) {
          _token = signToken(_user._id);
          res.status(200).send({
            user: _user,
            token: _token
          });
        } else {
          return next(new HttpError(400, 'Invalid credentials.'));
        }
      })
      .catch(err => next(err));
  }

  function logout(req, res, next) {
    const token = req.headers['x-access-token'];
    const {
      id
    } = req.body;
    let query = {_id: id, 'tokens': {$elemMatch: {token: token}}};

    return User.findOne(query).then((user) => {
      if (user) {
        const arrTokens = user.tokens;
        arrTokens.forEach(element => {
          if (element.token === token) {
            let elemIndex = user.tokens.indexOf(element);
            user.tokens.splice(elemIndex, 1);
          }
        });
        User.findByIdAndUpdate(id, user, {new: true}).then((updatedUser) => {
          if (updatedUser) {
            res.status(200).send(updatedUser);
          }
        }).catch(err => next(err));
      } else {
        return next(new HttpError(400, 'No user found.'));
      }
    }).catch(err => next(err));
  }

  function loginFB(req, res, next) {
    let _token, _user;
    const {
      code,
    } = req.body;
    return getFBAccessTokenFromCode(code)
      .then(data => {
        _token = signToken(data.id);
        _user = data;
        res.status(200).send({
          user: _user,
          token: _token
        });
      })
      .catch(err => next(err));
  }

  function getAll(req, res, next) {
    return User.find({})
      .then(users => {
        let parseUsers = [];
        users.forEach(user => {
          parseUsers.push(user);
        });
        res.status(200).send(parseUsers);
      })
      .catch(err => next(new Error(err)));
  }

  function getById(req, res, next) {
    const id = req.params.id;
    return User.findById({_id: id})
      .then(user => {
        if (user) {
          return res.status(200).send(user);
        }
        return next(new HttpError(400, 'No user found.'));
      })
      .catch(err => {
        return next(new Error(err));
      });
  }

  return {
    register,
    login,
    logout,
    getAll,
    getById,
    loginFB
  };
};
