import React, { useState } from 'react'
import axios from 'axios'
import _ from 'lodash';
import SweetAlert from 'react-bootstrap-sweetalert'
import { makeStyles } from '@material-ui/core/styles'
import Assignment from '@material-ui/icons/Assignment'
import CircularProgress from '@material-ui/core/CircularProgress'
import GridContainer from 'components/Grid/GridContainer.js'
import GridItem from 'components/Grid/GridItem.js'
import CustomInput from 'components/CustomInput/CustomInput.js'
import FilialAutoComplete from 'components/FilialAutoComplete/FilialAutoComplete.js'
import Card from 'components/Card/Card.js'
import CardBody from 'components/Card/CardBody.js'
import Table from 'components/Table/Table.js'
import CardIcon from 'components/Card/CardIcon.js'
import CardHeader from 'components/Card/CardHeader.js'
import Button from 'components/CustomButtons/Button.js'
import If from 'components/If/If'
import { dadosConfiguracao, dadosTipoCarga, dadosSemana, dadosDiasDaSemana } from 'variables/general.js'
import styles from 'assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js'

const useStyles = makeStyles(styles)

export default () => {
  const classes = useStyles()

  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)
  const [configuracao, setConfiguracao] = useState(dadosConfiguracao)
  const [semana] = useState(dadosSemana)
  const [dias] = useState(dadosDiasDaSemana)
  const [tipo] = useState(dadosTipoCarga)

  const refresh = async ({ filial = null }) => {
    setLoading(true)
    await axios.get(`/carga-descarga/configuracoes?filial=${filial.codigo}`)
      .then(response => setConfiguracao(
        response.data.result
          ? response.data.result
          : { ...dadosConfiguracao, filial: filial })
      )
    console.log({ configuracao })
    setLoading(false)
  }

  const handleSave = async () => {
    const callRequest = {
      post: async () => await axios.post(`/carga-descarga/configuracoes`, configuracao),
      put: async () => await axios.put(`/carga-descarga/configuracoes/${configuracao._id}`, configuracao)
    }[configuracao._id === undefined ? 'post' : 'put']

    const response = await callRequest()
    const hasErrors = response.data.validation !== undefined ? true : false

    openAlert({
      msg: response.data.message,
      props: !hasErrors ? { type: 'success' } : null
    })

    if (!hasErrors)
      refresh({ filial: configuracao.filial })
  }
  const openAlert = ({ msg = '', props }) => {
    setAlert(
      <SweetAlert
        {...props}
        title={''}
        style={{ display: "block", marginTop: "-100px" }}
        showCancel={false}
        confirmBtnText={'Fechar'}
        onConfirm={() => setAlert(null)}
        confirmBtnCssClass={`
            MuiButtonBase-root
            MuiButton-root
            makeStyles-button-173
            makeStyles-sm-197
            makeStyles-info-176
            MuiButton-text`}>
        {msg}
      </SweetAlert >)
  }
  const getInput = (label, v, i) => {
    const objeto = v.toLowerCase()
    const tipo = label.toLowerCase()
    const dia = semana[i]().toLowerCase()
    let data = null

    if (tipo !== 'capacidades')
      data = configuracao[objeto][tipo].filter(a => a.diaSemana === dia).shift()
    else
      data = configuracao.capacidades.filter(a => a.diaSemana === dia).shift()

    return (
      <CustomInput
        labelText={label !== 'capacidades' ? label : ''}
        formControlProps={{ fullWidth: true }}
        required={true}
        inputProps={{
          type: 'number',
          value: data.tonelada,
          onChange: event => {
            let config = configuracao
            let items = []

            if (label !== 'capacidades') {
              items = _.unionBy([{ ...data, tonelada: +event.target.value }], configuracao[objeto][tipo], 'diaSemana')
              config[objeto][tipo] = items
            } else {
              items = _.unionBy([{ ...data, tonelada: +event.target.value }], configuracao.capacidades, 'diaSemana')
              config[label] = items
            }

            setConfiguracao({ ...config })
          }
        }} />
    )
  }
  const getTableDataTitle = ({ title }) => {
    return [
      <div className={classes.imgContainer} key='key'>
        <b>{title}</b>
      </div>
    ]
  }
  const mountTableHead = [''].concat(dias.map(v => semana[v]()))
  const mountTableData = [
    getTableDataTitle({ title: 'Capacidade Total:' })
      .concat(dias.map(i => <span key={i}>{getInput('capacidades', tipo.capacidade, i)}</span>))
    ,
    getTableDataTitle({ title: 'Batida:' })
      .concat(dias.map(i => (
        <span key={i}>
          {getInput('Resfriado', tipo.batida, i)}
          {getInput('Congelado', tipo.batida, i)}
          {getInput('Seco', tipo.batida, i)}
        </span>)))
    ,
    getTableDataTitle({ title: 'Paletizada:' })
      .concat(dias.map(i => (
        <span key={i}>
          {getInput('Resfriado', tipo.paletizada, i)}
          {getInput('Congelado', tipo.paletizada, i)}
          {getInput('Seco', tipo.paletizada, i)}
        </span>
      )))
  ]

  return (
    <GridItem md={12} >
      <GridContainer>
        <GridItem md={12}>
          <h4 style={{ fontWeight: '300', margin: '10px 0 30px', textAlign: 'center' }}>
            Configuração para agendar descarga fornecedor.
          </h4>
          <div>{alert}</div>
        </GridItem>

        <GridItem xs={12}>
          <div style={{ textAlign: 'center' }}>
            <FilialAutoComplete
              title={<b>Selecione a Filial</b>}
              callBackHandleFilialChange={({ data }) => refresh({ filial: data })} />
          </div>
        </GridItem>

        <If test={loading}>
          <div style={{ float: 'left', position: 'relative', left: '50%', marginTop: '10px' }}>
            <CircularProgress color='inherit' size={50} />
          </div>
        </If>

        <If test={configuracao.filial.codigo && !loading}>
          <GridItem md={12}>
            <GridContainer justify='center'>
              <GridItem xs={12}>
                <Card>
                  <CardHeader color='rose' icon>
                    <CardIcon color='rose'>
                      <Assignment />
                    </CardIcon>
                    <h4 className={classes.cardIconTitle}>Configuração</h4>
                  </CardHeader>
                  <CardBody>
                    <Table tableHead={mountTableHead} tableData={mountTableData} />
                    <GridItem>
                      <Button
                        style={{ float: 'right' }}
                        xs={3}
                        size="sm"
                        color="info"
                        onClick={() => handleSave()}>
                        Salvar
                      </Button>
                    </GridItem>
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </GridItem>
        </If>
      </GridContainer>
    </GridItem>
  )
}
