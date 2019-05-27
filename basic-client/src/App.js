import React, {Component} from 'react'
import './App.css';
import { withAuthenticator } from 'aws-amplify-react';
import Amplify,  { Auth, API, graphqlOperation }  from 'aws-amplify';

const appConfig = {
  GraphQLEndpoint: "https://7bbkgagv75dg7mqiv2nswnred4.appsync-api.us-west-2.amazonaws.com/graphql",
  region: "us-west-2"
}

Amplify.configure({
    Auth: {
        // REQUIRED - Amazon Cognito Region
        region: 'us-west-2',
        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: 'us-west-2_lZSr5ThO5',

        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: '68tcfd6jrh29fsekqgc72saulh',

    },
    aws_appsync_graphqlEndpoint: appConfig.GraphQLEndpoint,
    aws_appsync_region: appConfig.region,
    aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
    API: {
      graphql_endpoint: appConfig.GraphQLEndpoint,
      graphql_headers: async () => {
            //console.log("%c Human session", "color: black; font-weight: bold");
            return {
              'Authorization': (await Auth.currentSession()).idToken.jwtToken,
            }
          }
    },
});

// function App() {
class App extends Component {
  render(){
    fetchGreeting().then(console.log("done!"))
    return (
      <div className="App">
        hello world
      </div>
    );  
  }
}

export default withAuthenticator(App, {
  // Render a sign out button once logged in
  includeGreetings: true 
});

const fetchGreeting = () => {
  const getGreeting = `query getGreeting{
    getGreeting{
      greeting
    }
  }`
  return new Promise(function(resolve, reject) {
    API.graphql( graphqlOperation(getGreeting) )
    .then((response) => {
      console.log('getGreeting => ', response);
      resolve(response);
    }).catch((err) => {
      console.error('getGreeting => err => ', err);
      reject(err);
    })
  })
}