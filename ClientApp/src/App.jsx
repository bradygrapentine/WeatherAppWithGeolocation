// import React, { useState, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
// import axios from 'axios'
import { LandingPage } from './pages/LandingPage.jsx'
import { UserPage } from './pages/UserPage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { SignupPage } from './pages/SignupPage.jsx'
import './custom.scss'

export function App() {
  return (
    <>
      <Switch>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route exact path="/User/:id">
          <UserPage />
        </Route>
        <Route exact path="/Login">
          <LoginPage />
        </Route>
        <Route exact path="/SignUp">
          <SignupPage />
        </Route>
        <Route path="*">Not Found...</Route>
      </Switch>
    </>
  )
}
