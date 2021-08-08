import { Link, useHistory } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { authHeader } from '../auth'

export function SignupPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState()
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
  })
  const history = useHistory()
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropFile,
  })

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

  async function onDropFile(acceptedFiles) {
    setErrorMessage(null)
    // Do something with the files
    const fileToUpload = acceptedFiles[0]
    console.log(fileToUpload)
    // Create a formData object so we can send this
    // to the API that is expecting som form data.
    const formData = new FormData()
    // Append a field that is the form upload itself
    formData.append('file', fileToUpload)
    setIsUploading(true)

    try {
      // Use fetch to send an authorization header and
      // a body containing the form data with the file
      const response = await fetch('/api/Uploads', {
        method: 'POST',
        headers: {
          ...authHeader(),
        },
        body: formData,
      })
      // If we receive a 200 OK response, set the
      // URL of the photo in our state so that it is
      // sent along when creating the restaurant,
      // otherwise show an error
      if (response.status === 200) {
        const apiResponse = await response.json()
        const url = apiResponse.url
        setNewUser({ ...newUser, photoURL: url })
      } else {
        if (newUser.photoURL) {
          setErrorMessage('Unable to upload new image')
        } else {
          setErrorMessage('Unable to upload image')
        }
      }
    } catch {
      // Catch any network errors and show the user we could not process their upload
      // console.debug(error)
      if (newUser.photoURL) {
        setErrorMessage('Unable to upload new image')
      } else {
        setErrorMessage('Unable to upload image')
      }
    }
    setIsUploading(false)
  }

  let dropZoneMessage = 'Drag a profile picture here!'

  if (isUploading) {
    dropZoneMessage = 'Uploading...'
  }
  if (isDragActive) {
    dropZoneMessage = 'Drop the files here ...'
  } else if (newUser.photoURL) {
    dropZoneMessage = 'Drag a new profile picture here!'
  }

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
          {errorMessage ? <p className="errorMessage">{errorMessage}</p> : null}
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
          {newUser.photoURL ? (
            <p>
              <img alt="Restaurant" width={200} src={newUser.photoURL} />
            </p>
          ) : null}

          <div className="file-drop-zone">
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {dropZoneMessage}
            </div>
          </div>
          <input className="loginsubmit" type="submit" value="Submit" />
        </form>
      </main>
      <footer></footer>
    </>
  )
}
