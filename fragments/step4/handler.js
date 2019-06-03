'use strict';
const jwt = require('jsonwebtoken');

module.exports.hello = async (event) => {
  const token = event.authorization;
  const decodedJwt = jwt.decode(token, {
        complete: true
    });
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  return { greeting: 'Hello ' + decodedJwt.payload.email };
};