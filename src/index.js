import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createHashHistory } from 'history'
import { Router, Route, Switch, Redirect } from 'react-router-dom'
import axios from 'axios'
import store from './store'
import AuthLayout from 'layouts/Auth.js'
import AdminLayout from 'layouts/Admin.js'

import 'assets/scss/material-dashboard-pro-react.scss?v=1.8.0'
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const hist = createHashHistory({ hashType: 'slash' })

axios.defaults.baseURL = 'http://104.154.117.141:3500/api/v1/'

ReactDOM.render(
  <Provider store={store}>
    <Router history={hist}>
      <Switch>
        <Route path='/auth' component={AuthLayout} />
        <Route path='/admin' component={AdminLayout} />
        <Redirect from='*' to='/auth' />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
)
