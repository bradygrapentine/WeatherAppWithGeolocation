import { Link } from 'react-router-dom'

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

  return (
    <>
      <main>
        <LoginPageHeader />
        <form className="login">
          <p className="login">Username</p>
          <input className="login" type="text" />
          <p className="login">Password</p>
          <input className="login" type="text" />
          <input className="loginsubmit" type="submit" value="Log In" />
        </form>
      </main>
      <footer></footer>
    </>
  )
}
