var shell = require('shelljs'); // https://github.com/shelljs/shelljs
require('dotenv').config({ path: './basic-client/.env' })

// const userPoolId = config().UserPoolId;

// const adminCreateUser = "aws --profile sbjs-demo --region us-west-2 cognito-idp admin-create-user --user-pool-id " + process.env.REACT_APP_USER_POOL_ID + " --username foo@ondema.io --user-attributes Name=email,Value=foo@ondema.io Name=email_verified,Value=true --temporary-password '!4Password'  --message-action SUPPRESS";

const sanity = {
  profile: "sbjs-demo",
  user: "foo@ondema.io",
  email: "foo@ondema.io",
  password: "!4Password",
}
const adminCreateUser = `aws --profile ${sanity.profile} --region us-west-2 cognito-idp admin-create-user --user-pool-id ${process.env.REACT_APP_USER_POOL_ID} --username '${sanity.user}' --user-attributes Name=email,Value=${sanity.email} Name=email_verified,Value=true --temporary-password ${sanity.password} --message-action SUPPRESS`;

shell.echo("cmd: \n" + adminCreateUser)
shell.echo("\nCreating test user foo@ondema.io");

shell.exec(adminCreateUser);