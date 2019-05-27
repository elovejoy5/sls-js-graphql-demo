import React from 'react';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react';
import Amplify from 'aws-amplify';

Amplify.configure({
    Auth: {
        // REQUIRED - Amazon Cognito Region
        region: 'us-west-2',
        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: 'us-west-2_lZSr5ThO5',

        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: '68tcfd6jrh29fsekqgc72saulh',

      }
});

function App() {
  return (
    <div className="App">
      hello world
    </div>
  );
}

export default withAuthenticator(App, {
  // Render a sign out button once logged in
  includeGreetings: true 
});