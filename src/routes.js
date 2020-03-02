import AuthPage from 'views/Pages/AuthPage'
import Cobranca from 'views/Cobranca/Cobranca'
import Limite from 'views/Limite/Limite'
import Descarga from 'views/Fornecedor/Descarga/Descarga'

var dashRoutes = [
  {
    path: '/login-page',
    name: 'Login Page',
    component: AuthPage,
    layout: '/auth'
  },
  {
    path: '/cobranca',
    name: 'Cobrança Automática',
    mini: 'C.A.',
    component: Cobranca,
    layout: '/admin'
  },
  {
    path: '/limite',
    name: 'Upgrade de Limite',
    mini: 'U.L.',
    component: Limite,
    layout: '/admin'
  },
  {
    path: '/descarga',
    name: 'Fornecedor Descarga',
    mini: 'F.D.',
    component: Descarga,
    layout: '/admin'
  }
]
export default dashRoutes
