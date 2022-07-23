import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/js/bootstrap.js'
import './index.css';
import App from './App';
import 'bulma/css/bulma.min.css';
import Amplify from "aws-amplify";
import config from "./Configuration.json"

Amplify.configure({
    Auth: {
      mandatorySignIn: true,
      region: config.cognitoConfiguration.REGION,
      userPoolId: config.cognitoConfiguration.USER_POOL_ID,
      userPoolWebClientId: config.cognitoConfiguration.APP_CLIENT_ID
    }
  });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
            <App/>
    </React.StrictMode>
);
