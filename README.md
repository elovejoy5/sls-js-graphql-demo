A quick technical demo of how to set up a GraphQL API w/ Javascript on AWS. Video:

[![Video of this demo](https://img.youtube.com/vi/U2ASfG69yRY/0.jpg)](https://www.youtube.com/embed/U2ASfG69yRY?start=815) 

# So how do we setup a GraphQL API in under an hour?

First, we make a bunch of assumptions: 
- working AWS account
- local environment with node, npm, serverless, editor, etc...
- the network tonight is going to be fast enough to let us connect to AWS in Oregon and deploy a few services
- We can setup GraphQL, Lambda functions, roles, policies, userpools, etc... without explaining what all the services are and how they work

Second, we set out to quickly set up a very hello-world GraphQL API:
1. Start with a JavaScript Lambda function
2. Add a cognito user pool & a test account
3. Add an Appsync instance with a super simple GraphQL API
4. Quickly edit the lambda to support the GraphQL API
5. Add a layer so that we can use a library without bundling it with the lambda
6. Use the library to itterate on our API & Lambda function

Along the way, we'll probably look at yaml files, logging, environment variables, a quick-and-dirty react client, etc...

# 0: To run through this demo on your local
Assuming you have node & npm dialed in:
1. create an AWS account and create a profile called sbjs-demo
2. install serverless (`npm install -g serverless`)
3. clone this repo, cd into root folder && npm install
4. do an npm install in basic-client folder too


# 1: init serverless
We can use the sls quickstart to create a lambda function: 
https://serverless.com/framework/docs/providers/aws/guide/quick-start/

Create sls project:
```
sbjs-demo$ serverless create --template aws-nodejs --path hello-lambda
sbjs-demo$ cd hello-lambda
```
Update serverless.yml by adding two lies to provider:
```
  region: us-west-2
  profile: sbjs-demo # not needed if you only have one AWS  account
```

Deploy & run Lambda Function:
```
hello-lambda$ serverless deploy -v
hello-lambda$ serverless invoke -f hello -l
```

## Result:
- serverless.yml configuration file
- a lambda function we can invoke via CLI or AWS console

# 2: add cognito, user, check w/ web app
Stolen from:
https://serverless-stack.com/chapters/configure-cognito-user-pool-in-serverless.html

add cognito config to serverless.yml:
```
sbjs-demo$ node setupStep2.js
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

## Result:
In addition to the lambda from first deploy:
- a directory and a user account in the directory
- updated serverless.yml configuration file
- a mechanism for sharing configuration information

# 3: add graphql
Using https://github.com/sid88in/serverless-appsync-plugin 

in project root folder:
```
sbjs-demo$ node setupStep3.js
```

in hello-lambda folder:
```
hello-lambda$ npm install serverless-appsync-plugin
hello-lambda$ sls deploy -v
```
Now we have a GraphQLApiUrl. Update .env & restart basic-client. A different error!

Update lambda to something like this:

```
'use strict';
module.exports.hello = async (event) => {
  console.log ("hello sbjs!")
  return { greeting: 'Go Serverless v1.0! Your function executed successfully!', event };
};
```

and deploy just function:
```
hello-lambda$ sls deploy -f hello
```
when we hit refresh, greeting should show up in browser: GraphQL working!

## Result:
In addition to the lambda, directory, and user account from first two deploys:
- an appsync instance to serve GraphQL queries
- A GraphQL schema
- Our lambda function can now answer GraphQL queries

# 4: make a layer
borrowing from  https://github.com/nsriram/aws-lambda-layer-example 

problem: adding npm modules and libraries make lambda functions bigger, slower, harder to manage, and can involve duplicate code.

solution: put modules into a layer using AWS weird `nodejs/node_modules/` instead of plain old `node_modules` the way nature intended.

create a layer directory:
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
cd ..
```

update serverless config to create layer:
```
sbjs-demo$ node setupStep4.js
```

Update lambda to use the module that we put in our layer:
```
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
```

deploy & tail the logs from our lambda so we can get quick feedback:
```
hello-lambda$ serverless deploy -v
hello-lambda$ serverless logs -f hello -t
```
## Result:
In addition to the lambda, directory, user account, & GraphQL endpoint from first two deploys:
- A layer that lambda function can use
- Lambda function using a node module from the layer
- Dynamically adding a value from Coginto to the GraphQL API
- We learned how to tail a function while coding

# Links
Serverless:
https://serverless.com/framework/docs/getting-started/
Appsync pluggin for serverless:
https://github.com/sid88in/serverless-appsync-plugin 
AWS Amplify JS library:
https://github.com/aws-amplify/amplify-js
GraphQL:
https://graphql.org/learn/

# to reset demo

Do sls remove to get rid of all the stuff in AWS:
```
hello-lambda$ sls remove
cd ..
rm -R ./hello-lambda
```
## Prep for demo:
1. make sure hello-lambda removed from AWS
2. make sure hello-lambda folder is deleted
3. log into AWS console
4. VS open to sbjs-demo: font big!
5. terminal open to sbjs-demo: font big!
