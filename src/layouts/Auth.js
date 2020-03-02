import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Footer from 'components/Footer/Footer.js'
import routes from 'routes.js'
import styles from 'assets/jss/material-dashboard-pro-react/layouts/authStyle.js'
import login from 'assets/img/login.jpeg'

const useStyles = makeStyles(styles)

export default function Pages() {
  const wrapper = React.createRef()
  const classes = useStyles()

  React.useEffect(() => {
    document.body.style.overflow = 'unset'
    return function cleanup() { }
  })

  const getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.collapse) return getRoutes(prop.views)
      if (prop.layout === '/auth')
        return (<Route path={prop.layout + prop.path} component={prop.component} key={key} />)
      else return null
    })
  }

  return (
    <div>
      <div className={classes.wrapper} ref={wrapper}>
        <div className={classes.fullPage} style={{ backgroundImage: 'url(' + login + ')' }}>
          <Switch>
            {getRoutes(routes)}
            <Redirect from='/auth' to='/auth/login-page' />
          </Switch>
          <Footer white />
        </div>
      </div>
    </div>
  )
}
