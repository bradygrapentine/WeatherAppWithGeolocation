// import React, { useState, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
// import axios from 'axios'
import { UserPage } from './pages/UserPage.jsx'
import './custom.scss'

export function App() {
  return (
    <>
      <Switch>
        <Route exact path="/">
          {/* <PetList /> */}
        </Route>
        <Route exact path="/UserDemo">
          <UserPage />
        </Route>
        {/* <Route exact path="/:id">
          {/* <PetPage />
        </Route> */}
        <Route path="*">Not Found...</Route>
      </Switch>
    </>
  )
}
