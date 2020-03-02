import React, { useState } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import Datetime from 'react-datetime'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { makeStyles } from '@material-ui/core/styles'
import Assignment from '@material-ui/icons/Assignment'
import FormControl from '@material-ui/core/FormControl'
import CircularProgress from '@material-ui/core/CircularProgress'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import CustomInput from 'components/CustomInput/CustomInput.js'
import Table from 'components/Table/Table.js'
import If from 'components/If/If'
import Card from 'components/Card/Card.js'
import CardBody from 'components/Card/CardBody.js'
import CardHeader from 'components/Card/CardHeader.js'
import CardIcon from 'components/Card/CardIcon.js'
import FilialAutoComplete from 'components/FilialAutoComplete/FilialAutoComplete'
import Accordion from 'components/Accordion/Accordion'
import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem'
import Button from 'components/CustomButtons/Button'
import styles from '../Acompanhamento/Agendamento/AgendamentoStyle'

const useStyles = makeStyles(styles)
export default () => {
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const [dataInicial, setDataInicial] = useState('')
  const [dataFinal, setDataFinal] = useState('')
  const [tipo, setTipo] = useState('')
  const [filial, setFilial] = useState({ codigo: '', razaoSocial: '' })
  const [relatorios, setRelatorios] = useState([])

  const search = async () => {
    if (filial.codigo && tipo) {
      setLoading(true)
      const queryFilial = `${filial.codigo ? `&filial=${filial.codigo}` : ''}`
      const queryDataInicial = `${dataInicial ? `&dataInicial=${dataInicial}` : ''}`
      const queryDataFinal = `${dataFinal ? `&dataFinal=${dataFinal}` : ''}`
      const queryTipo = `${tipo ? `&tipo=${tipo}` : ''}`

      let query = `${queryFilial}${queryDataInicial}${queryDataFinal}${queryTipo}`

      const url = `/carga-descarga/relatorios?${query}`.replace('?&', '?')
      const res = await axios.get(url)
      setRelatorios(res.data.result)
      setLoading(false)
    } else alert('Informe os filtros corretamente')
  }

  const PDF = () => {
    const input = document.getElementById('table')
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF()
        pdf.addImage(imgData, 'JPEG', 0, 0)
        pdf.save("download.pdf")
      })
  }
  const getInputImperial = (objeto) => {
    return (
      <div>
        <CustomInput
          labelText={'Capacidade'}
          formControlProps={{ fullWidth: true }}
          required={true}
          inputProps={{
            type: 'number',
            value: objeto.capacidadeTotal,
            disabled: true
          }} />
        <CustomInput
          labelText={'Real'}
          formControlProps={{ fullWidth: true }}
          required={true}
          inputProps={{
            type: 'number',
            value: objeto.real,
            disabled: true
          }} />
        <CustomInput
          labelText={'Delta'}
          formControlProps={{ fullWidth: true }}
          required={true}
          inputProps={{
            type: 'number',
            value: objeto.delta,
            disabled: true
          }} />
      </div>
    )
  }
  const getInput = (objeto) => {
    return (
      <div>
        <b>{format(new Date(objeto._id.dataEntrega), 'dd/MM/yyyy')}</b>
        <CustomInput
          labelText={'CAPACIDADE'}
          formControlProps={{ fullWidth: true }}
          required={true}
          inputProps={{
            type: 'number',
            value: objeto.capacidadeTotal,
            disabled: true
          }} />
        <CustomInput
          labelText={'REAL'}
          formControlProps={{ fullWidth: true }}
          required={true}
          inputProps={{
            type: 'number',
            value: objeto.real,
            disabled: true
          }} />
        <CustomInput
          labelText={'DELTA'}
          formControlProps={{ fullWidth: true }}
          required={true}
          inputProps={{
            type: 'number',
            value: objeto.delta,
            disabled: true
          }} />
        <CustomInput
          labelText={objeto._id.tipoMercadoria.toUpperCase()}
          formControlProps={{ fullWidth: true }}
          required={true}
          inputProps={{
            type: 'number',
            value: objeto.capacidadePorTipoCarga,
            disabled: true
          }} />
      </div>
    )
  }
  const getTableDataTitle = ({ title }) => {
    return [
      <div className={classes.imgContainer} key='key'>
        <b>{title}</b>
      </div>
    ]
  }
  const mountTableHead = ['']
  const mountTableData = [
    getTableDataTitle({ title: 'Imperial' })
      .concat(relatorios
        .filter(f => f._id.tipoCarga === 'imperial')
        .map(rel => <span key={rel._id.filial}>{getInputImperial(rel)}</span>))
    ,
    getTableDataTitle({ title: 'Batida' })
      .concat(relatorios
        .filter(f => f._id.tipoCarga === 'batida')
        .map(rel => <span key={rel._id.filial}>{getInput(rel)}</span>))
    ,
    getTableDataTitle({ title: 'Paletizada' })
      .concat(relatorios
        .filter(f => f._id.tipoCarga === 'paletizada')
        .map(rel => <span key={rel._id.filial}>{getInput(rel)}</span>))
  ].filter(table => table.length > 1)

  return (
    <GridContainer justify='center'>
      <GridItem xs={12} sm={12}>
        <h4 style={{ fontWeight: '300', margin: '10px 0 30px', textAlign: 'center' }}>
          Relatórios
        </h4>
      </GridItem>
      <GridItem md={12}>
        <GridContainer>
          <GridItem md={12}>
            <Accordion
              active={0}
              collapses={[
                {
                  title: 'Filtros',
                  content:
                    <GridItem md={12}>
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={6}>
                          <FilialAutoComplete
                            title={'* Filial:'}
                            callBackHandleFilialChange={filial => setFilial(filial.data)} />
                        </GridItem>

                        <GridItem xs={12} sm={12} md={3}>
                          <p>Data Inicial:</p>
                          <FormControl fullWidth>
                            <Datetime
                              dateFormat={'DD/MM/YYYY'}
                              timeFormat={false}
                              closeOnSelect={true}
                              closeOnTab={true}
                              onChange={value => setDataInicial(value ? format(new Date(value), 'yyyy-MM-dd') : null)} />
                          </FormControl>
                        </GridItem>

                        <GridItem xs={12} sm={12} md={3}>
                          <p>Data Final:</p>
                          <FormControl fullWidth>
                            <Datetime
                              dateFormat={'DD/MM/YYYY'}
                              timeFormat={false}
                              closeOnSelect={true}
                              closeOnTab={true}
                              onChange={value => setDataFinal(value ? format(new Date(value), 'yyyy-MM-dd') : null)} />
                          </FormControl>
                        </GridItem>

                        <GridItem md={6}>
                          <FormControl fullWidth>
                            <InputLabel
                              htmlFor="simple-select"
                              className={classes.selectLabel}>
                              * Status
                            </InputLabel>
                            <Select
                              MenuProps={{ className: classes.selectMenu }}
                              classes={{ select: classes.select }}
                              value={tipo}
                              onChange={event => setTipo(event.target.value)}
                              inputProps={{ name: 'simpleSelect', id: 'simple-select' }}>
                              <MenuItem
                                classes={{ root: classes.selectMenuItem, selected: classes.selectMenuItemSelected }}
                                value={'resumido'}
                                key={0}>
                                Resumido
                              </MenuItem>
                              <MenuItem
                                classes={{ root: classes.selectMenuItem, selected: classes.selectMenuItemSelected }}
                                value={'detalhado'}
                                key={1}>
                                Detalhado
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </GridItem>

                        <div style={{ marginTop: '15px' }}>
                          <GridItem>
                            <Button
                              xs={3}
                              size='sm'
                              color='info'
                              onClick={search.bind(this)}>
                              Pesquisar
                            </Button>
                          </GridItem>
                        </div>
                      </GridContainer>
                    </GridItem>
                }]} />

            <Accordion
              active={0}
              collapses={[
                {
                  title: 'Resultados',
                  content:
                    <GridContainer>
                      <GridItem md={12}>
                        <If test={loading}>
                          <div style={{ float: 'left', position: 'relative', left: '50%', marginTop: '10px' }}>
                            <CircularProgress color='inherit' size={50} />
                          </div>
                        </If>

                        <If test={!loading && relatorios.length > 0}>
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
                                    <div id='table'>
                                      <Table tableHead={mountTableHead} tableData={mountTableData} />
                                    </div>
                                    <Button
                                      style={{ float: 'right' }}
                                      xs={3}
                                      size="sm"
                                      color="info"
                                      onClick={() => PDF()}>
                                      PDF
                                    </Button>
                                  </CardBody>
                                </Card>
                              </GridItem>
                            </GridContainer>
                          </GridItem>
                        </If>
                      </GridItem>
                    </GridContainer>
                }]} />
          </GridItem>
        </GridContainer>
      </GridItem>
    </GridContainer>
  )
}
