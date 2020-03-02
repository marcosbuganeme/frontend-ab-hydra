import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import cx from 'classnames'
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import { makeStyles } from '@material-ui/core/styles'
import AdminNavbar from 'components/Navbars/AdminNavbar.js'
import Footer from 'components/Footer/Footer.js'
import Sidebar from 'components/Sidebar/Sidebar.js'
import FixedPlugin from 'components/FixedPlugin/FixedPlugin.js'
import routes from 'routes.js'
import styles from 'assets/jss/material-dashboard-pro-react/layouts/adminStyle.js'

var ps

const useStyles = makeStyles(styles)

export default function Dashboard(props) {
  const classes = useStyles()
  const { ...rest } = props
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [miniActive, setMiniActive] = React.useState(false)
  const [image, setImage] = React.useState(require('assets/img/sidebar-2.jpg'))
  const [color, setColor] = React.useState('blue')
  const [bgColor, setBgColor] = React.useState('black')
  const [fixedClasses, setFixedClasses] = React.useState('dropdown')
  const [logo, setLogo] = React.useState(require('assets/img/ab-logo-w.png'))

  const mainPanelClasses = classes.mainPanel + ' ' +
    cx({
      [classes.mainPanelSidebarMini]: miniActive,
      [classes.mainPanelWithPerfectScrollbar]: navigator.platform.indexOf('Win') > -1
    })
  const mainPanel = React.createRef()

  React.useEffect(() => {
    if (navigator.platform.indexOf('Win') > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      })
      document.body.style.overflow = 'hidden'
    }
    window.addEventListener('resize', resizeFunction)
    return function cleanup() {
      if (navigator.platform.indexOf('Win') > -1) {
        ps.destroy()
      }
      window.removeEventListener('resize', resizeFunction)
    }
  })

  const { token } = useSelector(data => data.authReducer)
  if (!token) return props.history.push('/auth')
  else axios.defaults.headers.common['Authorization'] = token ? 'Bearer ' + token : token

  const handleImageClick = image => {
    setImage(image)
  }
  const handleColorClick = color => {
    setColor(color)
  }
  const handleBgColorClick = bgColor => {
    switch (bgColor) {
      case 'white':
        setLogo(require('assets/img/ab-logo-b.png'))
        break
      default:
        setLogo(require('assets/img/ab-logo-w.png'))
        break
    }
    setBgColor(bgColor)
  }
  const handleFixedClick = () => {
    if (fixedClasses === 'dropdown') setFixedClasses('dropdown show')
    else setFixedClasses('dropdown')

  }
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }
  const getRoute = () => {
    return window.location.pathname !== '/admin/full-screen-maps'
  }
  const getActiveRoute = routes => {
    let activeRoute = ''
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].views)
        if (collapseActiveRoute !== activeRoute) return collapseActiveRoute
        else if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) return routes[i].name
      }
    }
    return activeRoute
  }
  const getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.collapse) return getRoutes(prop.views)
      if (prop.layout === '/admin') {
        return (<Route path={prop.layout + prop.path} component={prop.component} key={key} />)
      }
      else return null
    })
  }
  const sidebarMinimize = () => {
    setMiniActive(!miniActive)
  }
  const resizeFunction = () => {
    if (window.innerWidth >= 960) setMobileOpen(false)
  }

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes.filter(route => route.layout !== '/auth')}
        logoText={'Creative Tim'}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        bgColor={bgColor}
        miniActive={miniActive}
        {...rest}
      />
      <div className={mainPanelClasses} ref={mainPanel}>
        <AdminNavbar
          sidebarMinimize={sidebarMinimize.bind(this)}
          miniActive={miniActive}
          brandText={getActiveRoute(routes)}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />
        {getRoute() ? (
          <div className={classes.content}>
            <div className={classes.container}>
              <Switch>
                {getRoutes(routes)}
                <Redirect from='/admin' to='/admin/cobranca' />
              </Switch>
            </div>
          </div>
        ) : (
            <div className={classes.map}>
              <Switch>
                {getRoutes(routes)}
                <Redirect from='/admin' to='/admin/cobranca' />
              </Switch>
            </div>
          )}
        {getRoute() ? <Footer fluid /> : null}
        <FixedPlugin
          handleImageClick={handleImageClick}
          handleColorClick={handleColorClick}
          handleBgColorClick={handleBgColorClick}
          color={color}
          bgColor={bgColor}
          bgImage={image}
          handleFixedClick={handleFixedClick}
          fixedClasses={fixedClasses}
          sidebarMinimize={sidebarMinimize.bind(this)}
          miniActive={miniActive}
        />
      </div>
    </div>
  )
}
