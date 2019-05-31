import React, {Component} from 'react'
import { withAuthenticator } from 'aws-amplify-react';
import Amplify,  { Auth, API, graphqlOperation }  from 'aws-amplify';


const appConfig = {
  GraphQLEndpoint: process.env.REACT_APP_GRAPHQL_API,
  userPoolId: process.env.REACT_APP_USER_POOL_ID,
  userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
}

console.log("appConfig: ", appConfig);

Amplify.configure({
    Auth: {
        region: "us-west-2",
        userPoolId: appConfig.userPoolId,
        userPoolWebClientId: appConfig.userPoolWebClientId
    },
    aws_appsync_graphqlEndpoint: appConfig.GraphQLEndpoint,
    aws_appsync_region: "us-west-2",
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
  constructor(props) {
    super(props);
    this.state = {result: "loading..."};
  }
  componentDidMount(){
    fetchGreeting().then((res) => {
      console.log("fetchGreeting.res: ", res)
      this.setState({
        result: "GraphQL returned: \n\n" + JSON.stringify(res,null,2)
      });
    }).catch((e) => {
      this.setState({
        result: "GraphQL request failed: \n\n" + JSON.stringify(e,null,2)
      });
    })
  }

  render(){
    return (
      <div className="App" style={{padding:"1em"}}>
          <pre>{this.state.result}</pre>
        <hr/>
          <pre>{JSON.stringify(appConfig,null,2)}</pre>
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