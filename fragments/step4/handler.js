'use strict';

module.exports.hello = async (event) => {
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  return { greeting: 'SBJS Serverless v1.0! Your function executed successfully!' };
};
