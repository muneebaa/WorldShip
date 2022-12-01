import React, { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { CSpinner } from '@coreui/react-pro'

import { Compose, Inbox, Message, Template } from './index'

const TheEmailApp = () => {
  return (
    <Template>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Switch>
          <Route
            exact
            path="/apps/email/inbox"
            name="Login Page"
            render={(props) => <Inbox {...props} />}
          />
          <Route
            exact
            path="/apps/email/compose"
            name="Register Page"
            render={(props) => <Compose {...props} />}
          />
          <Route
            exact
            path="/apps/email/message"
            name="Message"
            render={(props) => <Message {...props} />}
          />
          <Redirect from="/apps/email" to="/apps/email/inbox" />
        </Switch>
      </Suspense>
    </Template>
  )
}

export default React.memo(TheEmailApp)
