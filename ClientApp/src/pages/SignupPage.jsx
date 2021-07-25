import { Link } from 'react-router-dom'

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

  return (
    <>
      <main>
        <SignupPageHeader />
        <form className="login">
          <p className="login">New Username</p>
          <input className="login" type="text" />
          <p className="login"> New Password</p>
          <input className="login" type="text" />
          <input className="loginsubmit" type="submit" value="Log In" />
        </form>
      </main>
      <footer></footer>
    </>
  )
}
