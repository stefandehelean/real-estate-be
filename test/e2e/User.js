const expect = require('chai').expect;
const request = require('chai').request;
/*
 * Server setup
*/
const app = mutil.getApp();
let token, resetPasswordToken, userId;

const rTestUserWithEmail = {
  email: 'stefan.dehelean@avangarde-software.com',
  password: 'password123',
  confirmPassword: 'password123',
  fullName: 'Test Test'
};

const testUpdateUser = {
  email: 'test@gmail.com',
  fullName: 'Test Test',
  phone: '5559993330'
};

const testUpdateUserWithEmptyStringPhone = {
  email: 'test@gmail.com',
  fullName: 'Test Test',
  phone: ''
};

const testUpdateUserWithEmptyStringEmail = {
  email: '',
  fullName: 'Test Test',
  phone: '0003338882'
};

const testUpdateUserWithEmptyStringPhoneWhenEmailIsNull = {
  fullName: 'Test Test',
  phone: '',
  email: ''
};

const testUpdateUserWithEmptyStringEmailWhenPhoneIsNull = {
  fullName: 'Test Test',
  email: '',
  phone: ''
};

const testUpdateUserWithInvalidEmail = {
  email: 'invalidemail.com'
};

const testUpdateUserWithInvalidPhone = {
  phone: 'phonenumber'
};

const testUpdateUserWithInvalidFullName = {
  fullName: 'a'
};

const rTestUserWithPhoneNumber = {
  phone: '0333111222',
  password: 'password123',
  confirmPassword: 'password123',
  fullName: 'Test Test'
};

const rTestUserWithEmailNumber = {
  email: 23452346,
  fullName: 'Test Test',
  password: 'password123',
  confirmPassword: 'password123',
};

const rTestUserWithFullNameNumber = {
  email: 'test@gmail.com',
  fullName: 12312415,
  password: 'password123',
  confirmPassword: 'password123',
};

const rTestUserWithEmptyPassword = {
  email: 'test@gmail.com',
  fullName: 'Test Test',
  password: '',
  confirmPassword: 'password123'
};

const rTestUserWithEmptyConfirmPassword = {
  email: 'test@gmail.com',
  fullName: 'Test Test',
  password: 'password123',
  confirmPassword: ''
};

const rTestUserWithDifferentPassword = {
  email: 'test@gmail.com',
  fullName: 'Test Test',
  password: 'password123',
  confirmPassword: '123password'
};

const rTestUserWithEmptyFullName = {
  email: 'test@gmail.com',
  fullName: '',
  password: 'password123',
  confirmPassword: 'password123'
};

const rTestUserWithEmailEmptyString = {
  email: '',
  password: 'password123',
  confirmPassword: 'password123',
  fullName: 'Test Test'
};

const rTestUserWithInvalidEmail = {
  email: 'testgmailcom',
  password: '!QWEqwe123',
  confirmPassword: '!QWEqwe123',
  fullName: 'Test Test'
};

const rTestUserWithEmptyStringPhoneNumber = {
  phone: '',
  password: 'password123',
  confirmPassword: 'password123',
  fullName: 'Test Test'
};

const rTestUserWithInvalidPhoneNumber = {
  phone: '0766554',
  password: 'password123',
  confirmPassword: 'password123',
  fullName: 'Test Test'
};

const rTestUserWithInvalidPassword = {
  phone: '0123123123',
  password: '11',
  confirmPassword: '11',
  fullName: 'Test Test'
};

const rTestUserWithInvalidConfirmPassword = {
  phone: 'j483hsd',
  password: 'password123',
  confirmPassword: '123password',
  fullName: 'Test Test'
};

const testUserWithPhoneNumber = {
  phone: '0333111222',
  password: 'password123',
  confirmPassword: 'password123',
  fullName: 'Test Test'
};

const testUserWithEmailNumber = {
  email: 123,
  password: 'password123'
};

const testUserWithEmailEmptyString = {
  email: '',
  password: 'password123'
};

const testUserWithInvalidEmail = {
  email: 'test@c',
  password: 'password123'
};

const testUserWithEmptyStringPhoneNumber = {
  phone: '',
  password: 'password123'
};

const testUserWithStringPhoneNumber = {
  phone: 'phone',
  password: 'password123'
};

const testUserWithInvalidPhoneNumber = {
  phone: '07449',
  password: 'password123'
};

const testUserWithoutPassword = {
  phone: '0123123123'
};

const testUserWithInvalidCredentials = {
  phone: '0333111222',
  password: 'password'
};

const testUserWithInvalidPassword = {
  email: 'test@test.com',
  password: '3',
};

describe('UserController', function () {
  describe('UserProvider', function () {
    describe('.registerUser', function () {

      it('should add a new User with email to the user collection', (done) => {
        request(app)
          .post('/api/users/register')
          .send(rTestUserWithEmail)
          .then(res => {
            const user = res.body;
            expect(res).to.have.status(201);
            expect(user.email).to.be.equal(rTestUserWithEmail.email);
            expect(user.fullName).to.be.equal(rTestUserWithEmail.fullName);
            done();
          })
          .catch(err => {
            done();
          });
      });

      it('should fail to add the same User to the user collection', (done) => {
        request(app)
          .post('/api/users/register')
          .send(rTestUserWithEmail)
          .catch(err => {
            expect(err).to.have.status(400);
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('User already exists.');
            done();
          });
      });

      it('should add a new User with phone number to the user collection', (done) => {
        request(app)
          .post('/api/users/register')
          .send(rTestUserWithPhoneNumber)
          .then(res => {
            const user = res.body;
            expect(res).to.have.status(201);
            expect(user.phone).to.be.equal(rTestUserWithPhoneNumber.phone);
            expect(user.fullName).to.be.equal(rTestUserWithPhoneNumber.fullName);
            done();
          })
          .catch(err => {
            done();
          });
      });

      it('should not register a user with numeric full name.', function (done) {
        request(app)
          .post('/api/users/register')
          .send(rTestUserWithFullNameNumber)
          .catch(err => {
            expect(err).to.have.status(400);
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('Invalid full name.');
            done();
          });
      });

      it('should not register a user with empty password.', function (done) {
        request(app)
          .post('/api/users/register')
          .send(rTestUserWithEmptyPassword)
          .catch(err => {
            expect(err).to.have.status(400);
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('Password is required.');
            done();
          });
      });

      it('should not register a user with empty confirmPassword.', function (done) {
        request(app)
          .post('/api/users/register')
          .send(rTestUserWithEmptyConfirmPassword)
          .catch(err => {
            expect(err).to.have.status(400);
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('Password is required.');
            done();
          });
      });

      it('should not register a user with different passwords.', function (done) {
        request(app)
          .post('/api/users/register')
          .send(rTestUserWithDifferentPassword)
          .catch(err => {
            expect(err).to.have.status(400);
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('Password and confirm password must match.');
            done();
          });
      });

      it('should not register a user with empty string  full name.', function () {
        request(app)
          .post('/api/users/register')
          .send(rTestUserWithEmptyFullName)
          .catch(err => {
            expect(err).to.have.status(400);
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('Full name is required.');
          });
      });

      it('should not register a user with numeric email.', function () {
        request(app)
          .post('/api/users/register')
          .send(rTestUserWithEmailNumber)
          .catch(err => {
            expect(err).to.have.status(400);
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('Invalid email.');
          });
      });

      it('should not register a user with empty string email.', function () {
        request(app)
          .post('/api/users/register')
          .send(rTestUserWithEmailEmptyString)
          .catch(err => {
            expect(err).to.have.status(400);
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('Email or phone number is required.');
          });
      });

      it('should not register a user with invalid email.', function () {
        request(app)
          .post('/api/users/register')
          .send(rTestUserWithInvalidEmail)
          .catch(err => {
            expect(err).to.have.status(400);
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('Invalid email.');
          });
      });

      it('should not register a user with empty string phone number.', function () {
        request(app)
          .post('/api/users/register')
          .send(rTestUserWithEmptyStringPhoneNumber)
          .catch(err => {
            expect(err).to.have.status(400);
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('Email or phone number is required.');
          });
      });

      it('should not register a user with invalid phone number.', function () {
        request(app)
          .post('/api/users/register')
          .send(rTestUserWithInvalidPhoneNumber)
          .catch(err => {
            expect(err).to.have.status(400);
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('Invalid phone number.');
          });
      });

      it('should not register a user with invalid password.', function () {
        request(app)
          .post('/api/users/register')
          .send(rTestUserWithInvalidPassword)
          .catch(err => {
            expect(err).to.have.status(400);
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('Invalid password.');
          });
      });

      it('should not register a user with invalid confirm password.', function () {
        request(app)
          .post('/api/users/register')
          .send(rTestUserWithInvalidConfirmPassword)
          .catch(err => {
            expect(err).to.have.status(400);
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('Password and confirm password must match.');
          });
      });
    });

    describe('.loginUser', function () {
      it('should login the user ', (done) => {
        request(app)
          .post('/api/users/login')
          .send(testUserWithPhoneNumber)
          .then(res => {
            const body = res.body, user = body.user;
            token = body.token;
            userId = user._id;
            expect(res).to.have.status(200);
            expect(body).to.have.property('token');
            expect(body).to.have.property('user');
            expect(user).to.have.property('_id');
            expect(user.phone).to.equal(testUserWithPhoneNumber.phone);
            done();
          });
      });

      it('should not login a user without an email.', function () {
        request(app)
          .post('/api/users/login')
          .send({password: 'parola124'})
          .catch(err => {
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('Email or phone number is required.');
          });
      });

      it('should not login a user with numeric email.', function () {
        request(app)
          .post('/api/users/login')
          .send(testUserWithEmailNumber)
          .catch(err => {
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('No user found.');
          });
      });

      it('should not login a user with empty string email.', function () {
        request(app)
          .post('/api/users/login')
          .send(testUserWithEmailEmptyString)
          .catch(err => {
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('Email or phone number is required.');
          });
      });

      it('should not login a user with invalid email.', function () {
        request(app)
          .post('/api/users/login')
          .send(testUserWithInvalidEmail)
          .catch(err => {
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('No user found.');
          });
      });

      it('should not login a user with phone number string.', function () {
        request(app)
          .post('/api/users/login')
          .send(testUserWithStringPhoneNumber)
          .catch(err => {
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('No user found.');
          });
      });

      it('should not login a user with empty string phone number.', function () {
        request(app)
          .post('/api/users/login')
          .send(testUserWithEmptyStringPhoneNumber)
          .catch(err => {
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('Email or phone number is required.');
          });
      });

      it('should not login a user with invalid phone number.', function () {
        request(app)
          .post('/api/users/login')
          .send(testUserWithInvalidPhoneNumber)
          .catch(err => {
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('No user found.');
          });
      });

      it('should not login a user without password.', function () {
        request(app)
          .post('/api/users/login')
          .send(testUserWithoutPassword)
          .catch(err => {
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('Password is required.');
          });
      });

      it('should not login a user with invalid credentials.', function () {
        request(app)
          .post('/api/users/login')
          .send(testUserWithInvalidCredentials)
          .catch(err => {
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('Invalid credentials.');
          });
      });

      it('should not login a user with invalid password.', function () {
        request(app)
          .post('/api/users/login')
          .send(testUserWithInvalidPassword)
          .catch(err => {
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('No user found.');
          });
      });
    });

    describe('.forgotPassword', function () {
      it('should send an email', () => {
        request(app)
          .post('/api/users/forgot-password')
          .send({email: 'florina.dascal@avangarde-software.com'})
          .then((res) => {
            const body = res.body, data = body.data;
            resetPasswordToken = data.token;
            expect(body.status).to.be.equal('success');
            expect(body.message).to.be.equal('Email sent.');
          });
      });

      it('should not send an email to an invalid email address', () => {
        request(app)
          .post('/api/users/forgot-password')
          .send({email: 'admin.com'})
          .catch(err => {
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('Invalid email.');
          });
      });
      it('should not send an email to an email that isn`t in the database', () => {
        request(app)
          .post('/api/users/forgot-password')
          .send({email: 'admin1@admin.com'})
          .catch(err => {
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('No user found.');
          });
      });
    });

    describe('.checkResetPasswordToken', function () {
      it('should return success message. valid token', () => {
        request(app)
          .post('/api/users/check-token')
          .send({token: resetPasswordToken})
          .then(res => {
            const body = res.body;
            expect(res.status).to.equal(201);
            expect(body.status).to.equal('success');
            expect(body.message).to.equal('Valid token.');
          });
      });
      it('should return an error. invalid token', () => {
        request(app)
          .post('/api/users/check-token')
          .send({token: 'token'})
          .catch(err => {
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('Invalid token.');
          });
      });
    });

    describe('.resetPassword', function () {
      it('should not reset the password. invalid token', () => {
        request(app)
          .post('/api/users/reset-password')
          .send({token: 'token'})
          .catch(err => {
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('Invalid token.');
          });
      });

      it('should not reset the password. invalid password', () => {
        request(app)
          .post('/api/users/reset-password')
          .send({token: resetPasswordToken, password: '12'})
          .catch(err => {
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('Invalid password.');
          });
      });

      it('should not reset the password. invalid confirm password', () => {
        request(app)
          .post('/api/users/reset-password')
          .send({token: resetPasswordToken, password: '!23Qwerty', confirmPassword: '123'})
          .catch(err => {
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('Invalid password.');
          });
      });

      it('should not reset the password. passwords do not match', () => {
        request(app)
          .post('/api/users/reset-password')
          .send({token: resetPasswordToken, password: '!23Qwerty', confirmPassword: '!123Qwerty'})
          .catch(err => {
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.response.res.text).to.be.equal('Password and confirm password must match.');
          });
      });

      it('should reset the password', () => {
        request(app)
          .post('/api/users/reset-password')
          .send({token: resetPasswordToken, password: '!23Qwerty', confirmPassword: '!23Qwerty'})
          .then(res => {
            const body = res.body;
            expect(res.status).to.equal(201);
            expect(body.status).to.equal('success');
            expect(body.message).to.equal('Password updated!');
          });
      });
    });

    describe('.updateUser', function () {
      it('should return all users from DB', (done) => {
        request(app)
          .get('/api/users')
          .set('x-access-token', token)
          .then(res => {
            const body = res.body;
            expect(res.status).to.equal(200);
            expect(body.length >= 1);
            done();
          });
      });

      it('should not return all users from DB. invalid token', (done) => {
        request(app)
          .get('/api/users')
          .set('x-access-token', `${token}123`)
          .catch(err => {
            expect(err.status).to.equal(500);
            expect(JSON.parse(err.response.res.text).message).to.be.equal('Failed to authenticate token.');
            done();
          });
      });

      it('should get user by id from DB', (done) => {
        request(app)
          .get(`/api/users/${userId}`)
          .set('x-access-token', token)
          .then(res => {
            const body = res.body;
            expect(res.status).to.equal(200);
            expect(body).to.have.property('fullName');
            done();
          });
      });

      it('should not get user by id from DB. invalid id', (done) => {
        request(app)
          .get('/api/users/5c0a4af2829c5c0950566666')
          .set('x-access-token', token)
          .catch(err => {
            expect(err.status).to.equal(400);
            expect(err.response.res.text).to.be.equal('No user found.');
            done();
          });
      });

      it('should update user with email, phone and fullName', (done) => {
        request(app)
          .put(`/api/users/${userId}`)
          .set('x-access-token', token)
          .send(testUpdateUser)
          .then(res => {
            const user = res.body;
            expect(res.status).to.equal(200);
            expect(user).to.have.property('fullName');
            done();
          })
          .catch(err => {
            done();
          });
      });

      it('should update user with empty string phone from DB', (done) => {
        request(app)
          .put(`/api/users/${userId}`)
          .set('x-access-token', token)
          .send(testUpdateUserWithEmptyStringPhone)
          .then(res => {
            const user = res.body;
            expect(res.status).to.equal(200);
            expect(user.phone).to.be.equal(null);
            done();
          })
          .catch(err => {
            done();
          });
      });

      it('should update user with email, phone and fullName ', (done) => {
        request(app)
          .put(`/api/users/${userId}`)
          .set('x-access-token', token)
          .send(testUpdateUser)
          .then(res => {
            const user = res.body;
            expect(res.status).to.equal(200);
            expect(user).to.have.property('fullName');
            done();
          })
          .catch(err => {
            done();
          });
      });

      it('should update user with empty string email', (done) => {
        request(app)
          .put(`/api/users/${userId}`)
          .set('x-access-token', token)
          .send(testUpdateUserWithEmptyStringEmail)
          .then(res => {
            const user = res.body;
            expect(res.status).to.equal(200);
            expect(user.email).to.be.equal(null);
            done();
          })
          .catch(err => {
            done();
          });
      });

      it('should not update user with empty string phone. email is null', (done) => {
        request(app)
          .put(`/api/users/${userId}`)
          .set('x-access-token', token)
          .send(testUpdateUserWithEmptyStringPhoneWhenEmailIsNull)
          .catch(err => {
            expect(err.status).to.equal(400);
            expect(err.response.res.text).to.be.equal('Email is required.');
            done();
          })
          .catch(err => {
            done();
          });
      });

      it('should update user with valid email', (done) => {
        request(app)
          .put(`/api/users/${userId}`)
          .set('x-access-token', token)
          .send(testUpdateUser)
          .then(res => {
            const user = res.body;
            expect(res.status).to.equal(200);
            expect(user).to.have.property('fullName');
            done();
          })
          .catch(err => {
            done();
          });
      });

      it('should update user with empty string phone', (done) => {
        request(app)
          .put(`/api/users/${userId}`)
          .set('x-access-token', token)
          .send(testUpdateUserWithEmptyStringPhone)
          .then(res => {
            const user = res.body;
            expect(res.status).to.equal(200);
            expect(user.phone).to.be.equal(null);
            done();
          })
          .catch(err => {
            done();
          });
      });

      it('should not update user with empty string email. phone is null', (done) => {
        request(app)
          .put(`/api/users/${userId}`)
          .set('x-access-token', token)
          .send(testUpdateUserWithEmptyStringEmailWhenPhoneIsNull)
          .catch(err => {
            expect(err.status).to.equal(400);
            expect(err.response.res.text).to.be.equal('Phone number is required.');
            done();
          });
      });

      it('should not update user. invalid email', (done) => {
        request(app)
          .put(`/api/users/${userId}`)
          .set('x-access-token', token)
          .send(testUpdateUserWithInvalidEmail)
          .catch(err => {
            expect(err.status).to.equal(400);
            expect(err.response.res.text).to.be.equal('Invalid email.');
            done();
          });
      });

      it('should not update user. invalid phone number', (done) => {
        request(app)
          .put(`/api/users/${userId}`)
          .set('x-access-token', token)
          .send(testUpdateUserWithInvalidPhone)
          .catch(err => {
            expect(err.status).to.equal(400);
            expect(err.response.res.text).to.be.equal('Invalid phone number.');
            done();
          })
          .catch(err => {
            done();
          });
      });

      it('should not update user. invalid fullName', (done) => {
        request(app)
          .put(`/api/users/${userId}`)
          .set('x-access-token', token)
          .send(testUpdateUserWithInvalidFullName)
          .catch(err => {
            expect(err.status).to.equal(400);
            expect(err.response.res.text).to.be.equal('Invalid full name.');
            done();
          })
          .catch(err => {
            done();
          });
      });

      it('should not update user. invalid id', (done) => {
        request(app)
          .put('/api/users/5c0a4af2829c5c0950503333')
          .set('x-access-token', token)
          .send(testUpdateUser)
          .catch(err => {
            expect(err.status).to.equal(400);
            expect(err.response.res.text).to.equal('No user found.');
            done();
          });
      });

      it('should not update user. invalid email, phone and fullname', (done) => {
        request(app)
          .put(`/api/users/${userId}`)
          .set('x-access-token', token)
          .send({})
          .catch(err => {
            expect(err.status).to.equal(400);
            expect(err.response.res.text).to.equal('No user found.');
            done();
          })
          .catch(err => {
            done();
          });
      });

      it('should logout the user', (done) => {
        request(app)
          .post('/api/users/logout')
          .set('x-access-token', token)
          .send({id: userId})
          .then(res => {
            expect(res).to.have.status(200);
            done();
          })
          .catch(err => {
            done();
          });
      });

      it('should fail to logout the user', (done) => {
        request(app)
          .post('/api/users/logout')
          .set('x-access-token', token)
          .send({id: '5c0a4af2829c5c0950566664'})
          .catch(err => {
            expect(err.status).to.equal(400);
            expect(err.response.res.text).to.equal('No user found.');
            done();
          })
          .catch(err => {
            done();
          });
      });
    });
  });
});
