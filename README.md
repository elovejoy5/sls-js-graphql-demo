
# 1: init serverless
Stolen from sls quickstart: 
https://serverless.com/framework/docs/providers/aws/guide/quick-start/

Create sls project:
```
sbjs-demo$ serverless create --template aws-nodejs --path hello-lambda
sbjs-demo$ ccd hello-lambda
```
Update serverless.yml by adding two lies to provider:
```
  region: us-west-2
  profile: sbjs-demo // not needed if you only have one AWS  account
```

Deploy & run Lambda Function:
```
hello-lambda$ serverless deploy -v
hello-lambda$ serverless invoke -f hello -l
```

# 2: add cognito, user, check w/ web app
Stolen from:
https://serverless-stack.com/chapters/configure-cognito-user-pool-in-serverless.html

2.1: add cognito config to serverless.yml:
```
sbjs-demo$ ./setupStep2.sh
```

Do another deploy to create the cognito user pool:
```
hello-lambda$ serverless deploy -v
```
IMPORTANT: put UserPoolClientId && UserPoolId into `basic-client/.env` file!

Create a test user (swap in new UserPoolId!):
```
sbjs-demo$ node setupCognitoUser.js
```

open a terminal in basic-client root:
```
basic-client$ npm start
```

Demo: can log in as `foo@ondema.io` and see a graphql error

So let's get GraphQL working...

# 3: add graphql
Using https://github.com/sid88in/serverless-appsync-plugin 

in project root folder:
```
sbjs-demo$ ./setupStep3.sh
```

in hello-lambda folder, update serverless.yml to point to correct UserPoolId, and then:
```
hello-lambda$ npm install serverless-appsync-plugin
hello-lambda$ sls deploy -v
```

Now we have a GraphQLApiUrl. Update .env & restart basic-client. A different error!

Update lambda and deploy just function:

```
hello-lambda$ sls deploy -f hello
```
# 4: hack on hello

first, let's tail the logs from our lambda so we can get quick feedback:
```
hello-lambda$ serverless logs -f hello -t
```
second, let's get a greeting by editing lambda:
```
'use strict';
module.exports.hello = async (event) => {
  console.log ("hello sbjs!")
  return { greeting: 'Go Serverless v1.0! Your function executed successfully!', event };
};
```

& deploying
```
hello-lambda$ sls deploy -f hello -v
```
when we hit refresh, greeting should show up in browser, and console 

# 5: make a layer

using https://github.com/nsriram/aws-lambda-layer-example to try to make jsonwebtoken-lambda-layer


create a layer directory
```
mkdir jsonwebtoken-lambda-layer
cd jsonwebtoken-lambda-layer
npm init -y
npm install jsonwebtoken
```

put node_modules inside a new nodejs folder:
```
mkdir nodejs
mv node_modules/ nodejs/node_modules/
```

working code:
```
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

```
# Next steps

- figure out how to replace hard-coded user pool in serverless.yml step 3 & 4 with variable!
- clean up comments in step 4 serverless.yml

# questions / issues
1. figure out why username is not being set correctly for demo cognito account

# useful links

TODO

# to reset demo

Do sls remove to get rid of all the stuff in AWS:
```
sls remove
```
Delete the `hello-lambda` folder
