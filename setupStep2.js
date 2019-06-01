var shell = require('shelljs'); // https://github.com/shelljs/shelljs
// require('dotenv').config({ path: './basic-client/.env' }) // https://github.com/motdotla/dotenv

shell.echo("Adding cognito config to serverless.yml");

shell.exec("shopt -s dotglob nullglob; cp fragments/step2/* hello-lambda/");


// #!/bin/bash
// shopt -s dotglob nullglob
// cp fragments/step2/* hello-lambda/