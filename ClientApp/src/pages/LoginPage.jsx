import { Link, useHistory } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import {
  getUserId,
  recordAuthentication,
  authHeader,
  isLoggedIn,
  getUser,
} from '../auth'

export function LoginPage() {
  function LoginPageHeader() {
    return (
      <header>
        <h1 className="login">
          <Link to="/">Forecast Finder</Link>
        </h1>
        <div className="loginAndSignup">
          <Link to="/SignUp" className="signup">
            Sign Up
          </Link>
        </div>
      </header>
    )
  }

  const [errorMessage, setErrorMessage] = useState()

  const [user, setUser] = useState({
    username: '',
    password: '',
  })

  function handleStringFieldChange(event) {
    const value = event.target.value
    const fieldName = event.target.name

    const updatedUser = { ...user, [fieldName]: value }
    setUser(updatedUser)
  }

  async function handleFormSubmission(event) {
    event.preventDefault()

    const response = await fetch('/api/Sessions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(user),
    })

    const apiResponse = await response.json()
    console.log(apiResponse)
    if (apiResponse.status === 400) {
      setErrorMessage(Object.values(apiResponse.errors).join(' '))
    } else {
      recordAuthentication(apiResponse)
      window.location.assign(`/User/${getUserId()}`)
    }
  }

  return (
    <>
      <main>
        <LoginPageHeader />
        <form className="login" onSubmit={handleFormSubmission}>
          {errorMessage ? <p>{errorMessage}</p> : null}
          <p className="login">Username</p>
          <input
            className="login"
            name="username"
            value={user.userName}
            onChange={handleStringFieldChange}
            type="text"
          />
          <p className="login">Password</p>
          <input
            className="login"
            name="password"
            value={user.password}
            onChange={handleStringFieldChange}
            type="password"
          />
          <input className="loginsubmit" type="submit" value="Log In" />
        </form>
      </main>
      <footer></footer>
    </>
  )
}
