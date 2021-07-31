import { Link, useHistory } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

export function SignupPage() {
  function SignupPageHeader() {
    return (
      <header>
        <h1 className="login">
          <Link to="/">Forecast Finder</Link>
        </h1>
        <div className="loginAndSignup">
          <Link to="/LogIn" className="signup">
            Log In
          </Link>
        </div>
      </header>
    )
  }

  const [errorMessage, setErrorMessage] = useState()
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
  })
  const history = useHistory()

  function handleStringFieldChange(event) {
    const value = event.target.value
    const fieldName = event.target.name

    const updatedUser = { ...newUser, [fieldName]: value }
    setNewUser(updatedUser)
  }

  async function handleFormSubmission(event) {
    event.preventDefault()
    const response = await fetch('api/Users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(newUser),
    })

    const apiResponse = await response.json()

    if (apiResponse.status === 400) {
      setErrorMessage(Object.values(apiResponse.errors).join(' '))
    } else {
      history.push('/Login')
    }
  }

  return (
    <>
      <main>
        <SignupPageHeader />
        <form className="login" onSubmit={handleFormSubmission}>
          {errorMessage ? <p>{errorMessage}</p> : null}
          <p className="login">New Username</p>
          <input
            className="login"
            name="username"
            value={newUser.userName}
            onChange={handleStringFieldChange}
            type="text"
          />
          <p className="login"> New Password</p>
          <input
            className="login"
            name="password"
            value={newUser.password}
            onChange={handleStringFieldChange}
            type="password"
          />
          <input className="loginsubmit" type="submit" value="Submit" />
        </form>
      </main>
      <footer></footer>
    </>
  )
}
