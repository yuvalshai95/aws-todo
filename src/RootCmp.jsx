
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Amplify from "aws-amplify";
import awsExports from "./aws-exports";
import { withAuthenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css';

// Routes
import routes from './routes.js';

// Cmps
import { AppHeader } from './cmps/AppHeader';
import { UserMsg } from './cmps/UserMsg';



// The aws-exports file holds the information required
// to connect and interact with the back-end service.
Amplify.configure(awsExports);


export function RootCmp() {
  return (
    <div className="root-cmp">
      <AppHeader />
      <main>
        <Routes>
          {routes.map(route => (
            <Route key={route.path} element={route.component} path={route.path} />
          ))}
        </Routes>
      </main>
      <UserMsg />
    </div>

  );
}


export default withAuthenticator(RootCmp)