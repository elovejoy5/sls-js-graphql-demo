'use strict';
const jwt = require('jsonwebtoken');

module.exports.hello = async (event) => {
  const token = event.authorization;
  const decodedJwt = jwt.decode(token, {
        complete: true
    });
  console.log("event: ", event);
  console.log("decodedJwt: ", decodedJwt);
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  return { greeting: 'SBJS Serverless v1.0! Your function executed successfully!', event, decodedJwt };
};
