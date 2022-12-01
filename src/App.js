import React, { Component, Suspense } from 'react'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import { CSpinner } from '@coreui/react-pro'
import './scss/style.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

// Email App
const EmailApp = React.lazy(() => import('./views/apps/email/EmailApp'))

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Suspense fallback={<CSpinner color="primary" />}>
          <Switch>
            <Route exact path="/login" name="Login Page" render={(props) => <Login {...props} />} />
            <Route
              exact
              path="/register"
              name="Register Page"
              render={(props) => <Register {...props} />}
            />
            {/*<Route exact path="/404" name="Page 404" render={(props) => <Page404 {...props} />} />
            <Route exact path="/500" name="Page 500" render={(props) => <Page500 {...props} />} />*/}
            {/*<Route
              path="/apps/email"
              name="Email App"
              render={(props) => <EmailApp {...props} />}
            />*/}
            {/*<Route path="/" name="Home" render={(props) => <DefaultLayout {...props} />} />*/}
            {}

            <Route
              path="/"
              name="Home"
              render={(props) =>
                localStorage.getItem('token') !== null ? (
                  <Route component={DefaultLayout} />
                ) : (
                  <Redirect to={{ pathname: '/login' }} />
                )
              }
            />
          </Switch>
        </Suspense>
      </HashRouter>
    )
  }
}

export default App
