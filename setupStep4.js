var fs = require('fs');
var shell = require('shelljs'); // https://github.com/shelljs/shelljs
require('dotenv').config({ path: './basic-client/.env' }) // https://github.com/motdotla/dotenv

shell.echo("Adding GraphQL configs");

// first copy over all the files:
shell.exec("shopt -s dotglob nullglob; cp -R fragments/step4/* hello-lambda/");

// now replace token in serverless.yml:
fs.readFile("./fragments/step4/serverless.yml", 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/REACT_APP_USER_POOL_ID/g, process.env.REACT_APP_USER_POOL_ID);

  fs.writeFile("./hello-lambda/serverless.yml", result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});