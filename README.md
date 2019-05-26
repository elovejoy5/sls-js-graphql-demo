
# 1: init serverless
Stolen from sls quickstart: 
https://serverless.com/framework/docs/providers/aws/guide/quick-start/

Create sls project:
```
$ serverless create --template aws-nodejs --path hello-lambda
$ cd my-service
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

# 2: add cognito
Stolen from:
https://serverless-stack.com/chapters/configure-cognito-user-pool-in-serverless.html

from hello-lambda folder
```
cp ../fragments/cognito-user-pool.yml ./cognito-user-pool.yml
cp ../fragments/step2_serverless.yml ./serverless.yml
```

Do another deploy to create the cognito user pool:
```
$ serverless deploy -v
```

# 3: add graphql

in hello-lambda folder:

```
npm install serverless-appsync-plugin
```

try a curl:
```
curl \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: 1234" \
  --data '{ "query": "{ getGreeting { greeting } }" }' \
  https://tjblfcoda5a6davacddnrreac4.appsync-api.us-west-2.amazonaws.com/graphql
```
so we'll need a user!

```
aws --profile sbjs-demo --region us-west-2 cognito-idp \
admin-create-user --user-pool-id us-west-2_nwDYnGR9h \
--username foo@ondema.io  --temporary-password '!2_nwDYnGR9h'

```