import React from 'react'
import { Redirect } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from './AuthReducer'

import { makeStyles } from '@material-ui/core/styles'
import InputAdornment from '@material-ui/core/InputAdornment'
import Icon from '@material-ui/core/Icon'
import Email from '@material-ui/icons/Email'
import CircularProgress from '@material-ui/core/CircularProgress'

import If from 'components/If/If'
import GridContainer from 'components/Grid/GridContainer.js'
import GridItem from 'components/Grid/GridItem.js'
import CustomInput from 'components/CustomInput/CustomInput.js'
import Button from 'components/CustomButtons/Button.js'
import Card from 'components/Card/Card.js'
import CardBody from 'components/Card/CardBody.js'
import CardHeader from 'components/Card/CardHeader.js'
import CardFooter from 'components/Card/CardFooter.js'

import styles from 'assets/jss/material-dashboard-pro-react/views/loginPageStyle.js'

const useStyles = makeStyles(styles)

export default props => {
  const classes = useStyles()

  const dispatch = useDispatch()
  const actions = bindActionCreators(authActions, dispatch)

  const { token } = useSelector(data => data.authReducer)

  const [cardAnimaton, setCardAnimation] = React.useState('cardHidden')
  setTimeout(() => setCardAnimation(''), 700)

  const [loading] = React.useState(false)
  const [loja, setLoja] = React.useState('')
  const [empresa, setEmpresa] = React.useState('')
  const [usuario, setUsuario] = React.useState('')
  const [senha, setSenha] = React.useState('')

  const handleSignIn = e => {
    e.preventDefault()

    const data = {
      loja: loja,
      empresa: empresa,
      usuario: usuario,
      senha: senha
    }

    if (!data.loja
      || !data.empresa
      || !data.usuario
      || !data.senha
    ) alert('Preencher campos de Login.')
    else actions.login({ data })
  }

  if (token) return <Redirect to="/admin" />
  else actions.reset()

  return (
    <div className={classes.container}>
      <GridContainer justify='center'>
        <GridItem xs={12} sm={6} md={4}>
          <Card login className={classes[cardAnimaton]}>
            <CardHeader className={`${classes.cardHeader} ${classes.textCenter}`} color='info'>
              <h4 className={classes.cardTitle}>Log In</h4>
            </CardHeader>
            <CardBody>
              <If test={loading}>
                <CircularProgress
                  style={{ float: 'left', position: 'relative', left: '41%' }}
                  color="inherit"
                  size={50} />
              </If>

              <If test={!loading}>
                <CustomInput
                  labelText='Loja...'
                  id='loja'
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    value: loja,
                    onChange: event => setLoja(event.target.value),
                    endAdornment: (
                      <InputAdornment position='end'>
                        <Email className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    )
                  }} />

                <CustomInput
                  labelText='Empresa...'
                  id='empresa'
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    value: empresa,
                    onChange: event => setEmpresa(event.target.value),
                    endAdornment: (
                      <InputAdornment position='end'>
                        <Email className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    )
                  }} />

                <CustomInput
                  labelText='Usuário...'
                  id='usuario'
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    value: usuario,
                    onChange: event => setUsuario(event.target.value),
                    endAdornment: (
                      <InputAdornment position='end'>
                        <Email className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    )
                  }} />

                <CustomInput
                  labelText='Senha...'
                  id='password'
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    value: senha,
                    onChange: event => setSenha(event.target.value),
                    endAdornment: (
                      <InputAdornment position='end'>
                        <Icon className={classes.inputAdornmentIcon}>lock_outline</Icon>
                      </InputAdornment>
                    ),
                    type: 'password',
                    autoComplete: 'off'
                  }} />
              </If>
            </CardBody>
            <CardFooter className={classes.justifyContentCenter}>
              <If test={!loading}>
                <Button color='info' simple size='lg' block onClick={handleSignIn}>ENTRAR</Button>
              </If>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div >
  )
}
