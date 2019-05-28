
# 1: init serverless
Stolen from sls quickstart: 
https://serverless.com/framework/docs/providers/aws/guide/quick-start/

Create sls project:
```
$ serverless create --template aws-nodejs --path hello-lambda
$ cd hello-lambda
```
Update serverless.yml by adding two lies to provider:
```
  region: us-west-2
  profile: sbjs-demo
```

Deploy & run Lambda Function:
```
$ serverless deploy -v
$ serverless invoke -f hello -l
```
Remove function, cloudwatch, etc..:
```
$ serverless remove
```

# 2: add cognito, user, check w/ web app
Stolen from:
https://serverless-stack.com/chapters/configure-cognito-user-pool-in-serverless.html

2.1: add cognito config to serverless.yml:
```
./setupStep2.sh
```

Do another deploy to create the cognito user pool:
```
$ serverless deploy -v
```

Create a test user (swap in new UserPoolId!):
```
aws --profile sbjs-demo --region us-west-2 cognito-idp admin-create-user --user-pool-id us-west-2_k1gf4SAGq --username foo@ondema.io --user-attributes Name=email,Value=foo@ondema.io Name=email_verified,Value=true --temporary-password '!4Password'  --message-action SUPPRESS

```

update basic-client appConfig w/ new UserPoolClientId && UserPoolId

from basic-client root:
```
npm start
```

Demo: can log in as `foo@ondema.io` and see a graphql error

So let's get GraphQL working...

# 3: add graphql
Using https://github.com/sid88in/serverless-appsync-plugin 

in project root folder:
```
./setupStep3.sh
```

in hello-lambda folder, update serverless.yml to point to correct UserPoolId, and then:
```
npm install serverless-appsync-plugin
sls deploy -v
```

Now we have a GraphQLApiUrl. Update appConfig & hit refresh. A different error!

Update lambda and deploy just function:
```
sls deploy -f hello
```
# 4: hack on hello

first, let's tail the logs from our lambda so we can get quick feedback:
```
serverless logs -f hello -t
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
sls deploy -f hello -v
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
- make a layer!
   - https://aws.amazon.com/blogs/aws/new-for-aws-lambda-use-any-programming-language-and-share-common-components/
   - https://serverless.com/framework/docs/providers/aws/guide/layers/

- figure out how to replace hard-coded user pool in step 3 with variable
- figure out how to get rid of uuid as username in Amplify header

# to reset demo

Do sls remove to get rid of all the stuff in AWS:
```
sls remove
```
Delete the `hello-lambda` folder