
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Amplify from "aws-amplify";
import awsExports from "./aws-exports";
import { withAuthenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css';


// Routes
import routes from './routes.js';

// Cmps
import { AppHeader } from './cmps/AppHeader';

// The aws-exports file holds the information required
// to connect and interact with the back-end service.
Amplify.configure(awsExports);


export function RootCmp() {
  return (
    <div className="root-cmp">
      <AppHeader />
      <main>
        <Switch>
          {routes.map(route => (
            <Route key={route.path} component={route.component} path={route.path} />
          ))}
        </Switch>
      </main>
    </div>

  );
}


export default withAuthenticator(RootCmp)