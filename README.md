# bare_nodejs_app

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

Clone to your local machine:
git clone https://${username}@bitbucket.org/avangarde/bare_nodejs_app.git

Change into the cloned dir:
cd bare_nodejs_app

Install required modules:
npm install


Prerequisites:
To get up and running you need to install MongoDB and Node.js.

Install Node.js:
https://nodejs.org/en/download/

Install MongoDB:
https://www.mongodb.com/download-center/community?jmp=docs


Running natively:
Run tests:
npm test

Get a coverage object and reports for any arbitrary node script:
istanbul cover test.js

See the reports:
cd bare_nodejs_app/coverage/lcov-report/index.html

Run dev environment:
npm start

Run prod environment:
NODE_ENV=prod npm start
