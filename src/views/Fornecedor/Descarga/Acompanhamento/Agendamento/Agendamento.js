import React, { useState } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import ReactTable from 'react-table'
import Datetime from 'react-datetime'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Dvr from '@material-ui/icons/Dvr'
import Close from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'

import FilialAutoComplete from 'components/FilialAutoComplete/FilialAutoComplete.js'
import Accordion from 'components/Accordion/Accordion.js'
import GridContainer from 'components/Grid/GridContainer.js'
import GridItem from 'components/Grid/GridItem.js'
import Button from 'components/CustomButtons/Button.js'
import styles from './AgendamentoStyle'

const useStyles = makeStyles(styles)
export default () => {
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(false)
  const [data, setData] = useState('')
  const [filial, setFilial] = useState({ codigo: '', razaoSocial: '' })
  const [entregas, setEntregas] = useState([])
  const [entrega, setEntrega] = useState({
    filial: { codigo: '', razaoSocial: '' },
    dataEntrega: '',
    transportador: '',
    tipoFrete: '',
    produtos: [],
    comprador: '',
    tipoCarga: '',
    tipoMercadoria: '',
    peso: '',
    observacao: '',
    dataChegada: '',
    status: ''
  })

  const handleForm = entrega => {
    setModal(true)
    setEntrega(entrega)
  }

  const handleSave = async () => {
    if (entrega.dataChegada && entrega.status) {
      await axios.put(`/carga-descarga/entregas/${entrega._id}`, entrega)
      search()
      setModal(false)
      setEntrega({
        filial: { codigo: '', razaoSocial: '' },
        dataEntrega: '',
        transportador: '',
        tipoFrete: '',
        produtos: [],
        comprador: '',
        tipoCarga: '',
        tipoMercadoria: '',
        peso: '',
        observacao: '',
        dataChegada: '',
        status: ''
      })
    } else {
      alert('Favor, preencher dados corretamente.')
    }
  }

  const search = async () => {
    setLoading(true)

    let query = `${filial.codigo ? `&filial=${filial.codigo}` : ''}${data ? `&dataEntrega=${data}` : ''}`
    const url = `/carga-descarga/entregas?${query}`.replace('?&', '?')
    const res = await axios.get(url)

    setEntregas(res.data.result.map(entrega => ({
      ...entrega, actions: (
        <div className='actions-right'>
          <Button
            justIcon
            round
            simple
            onClick={() => handleForm(entrega)}
            color='warning'
            className='edit'>
            <Dvr />
          </Button>
        </div>
      )
    })))
    setLoading(false)
  }

  return (
    <GridContainer justify='center'>
      <GridItem xs={12} sm={12}>
        <h4 style={{ fontWeight: '300', margin: '10px 0 30px', textAlign: 'center' }}>
          Acompanhar Agendamentos
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
                            title={'Filial:'}
                            callBackHandleFilialChange={filial => setFilial(filial.data)} />
                        </GridItem>

                        <GridItem xs={12} sm={12} md={6}>
                          <p>Data:</p>
                          <FormControl fullWidth>
                            <Datetime
                              dateFormat={'DD/MM/YYYY'}
                              timeFormat={false}
                              closeOnSelect={true}
                              closeOnTab={true}
                              onChange={value => setData(value ? format(new Date(value), 'yyyy-MM-dd') : null)} />
                          </FormControl>
                        </GridItem>

                        <GridItem>
                          <Button
                            xs={3}
                            size='sm'
                            color='info'
                            onClick={search.bind(this)}>
                            Pesquisar
                          </Button>
                        </GridItem>
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
                        <ReactTable
                          data={entregas}
                          filterable
                          nextText={'Próximo'}
                          previousText={'Voltar'}
                          rowsText={'Logs'}
                          pageText={'Página'}
                          ofText={'de'}
                          noDataText={''}
                          loading={loading}
                          columns={[
                            {
                              Header: <div style={{ float: 'left' }}><b>Ações</b></div>,
                              accessor: 'actions',
                              sortable: false,
                              filterable: false
                            },
                            {
                              Header: <div style={{ float: 'left' }}><b>Data Entrega</b></div>,
                              accessor: 'dataEntrega',
                              sortable: false,
                              filterable: false,
                              width: 150,
                              Cell: row => <div><b>{format(new Date(row.value), 'dd/MM/yyyy')}</b></div>
                            },
                            {
                              Header: <div style={{ float: 'left' }}><b>Transportador</b></div>,
                              accessor: 'transportador',
                              sortable: false,
                              filterable: false,
                              width: 200,
                              Cell: row => <div><b>{row.value.toUpperCase()}</b></div>
                            },
                            {
                              Header: <div style={{ float: 'left' }}><b>Tipo Frete</b></div>,
                              accessor: 'tipoFrete',
                              sortable: false,
                              filterable: false,
                              Cell: row => <div><b>{row.value.toUpperCase()}</b></div>
                            },
                            {
                              Header: <div style={{ float: 'left' }}><b>Produtos</b></div>,
                              accessor: 'produtos',
                              sortable: false,
                              filterable: false,
                              width: 250,
                              Cell: row => <div><b>{row.value.toString().toUpperCase()}</b></div>
                            },
                            {
                              Header: <div style={{ float: 'left' }}><b>Comprador</b></div>,
                              accessor: 'comprador',
                              sortable: false,
                              filterable: false,
                              width: 350,
                              Cell: row => <div><b>{row.value.toUpperCase()}</b></div>
                            },
                            {
                              Header: <div style={{ float: 'left' }}><b>Tipo Carga</b></div>,
                              accessor: 'tipoCarga',
                              sortable: false,
                              filterable: false,
                              Cell: row => <div><b>{row.value.toUpperCase()}</b></div>
                            },
                            {
                              Header: <div style={{ float: 'left' }}><b>Tipo Mercadoria</b></div>,
                              accessor: 'tipoMercadoria',
                              sortable: false,
                              filterable: false,
                              width: 200,
                              Cell: row => <div><b>{row.value.toUpperCase()}</b></div>
                            },
                            {
                              Header: <div style={{ float: 'left' }}><b>Peso</b></div>,
                              accessor: 'peso',
                              sortable: false,
                              filterable: false,
                              Cell: row => <div><b>{row.value}</b></div>
                            },
                            {
                              Header: <div style={{ float: 'left' }}><b>Observação</b></div>,
                              accessor: 'observacao',
                              sortable: false,
                              filterable: false,
                              width: 500,
                              Cell: row => <div><b>{row.value.toUpperCase()}</b></div>
                            },
                          ]}
                          defaultPageSize={5}
                          showPaginationTop
                          showPaginationBottom={false}
                          className='-striped -highlight'
                        />
                      </GridItem>
                    </GridContainer>
                }]} />
          </GridItem>

          <GridItem md={12}>
            <Dialog
              fullWidth={false}
              fullScreen={true}
              classes={{ paper: classes.modal }}
              open={modal}
              transition={
                React.forwardRef(function Transition(props, ref) {
                  return <Slide direction='down' ref={ref} {...props} />
                })
              }
              keepMounted
              scroll={'body'}
              onClose={() => setModal(false)}
              aria-labelledby='modal-slide-title'
              aria-describedby='modal-slide-description'>

              <DialogTitle
                id='classic-modal-slide-title'
                disableTypography
                className={classes.modalHeader}>
                <Button
                  justIcon
                  className={classes.modalCloseButton}
                  key='close'
                  aria-label='Close'
                  color='transparent'
                  onClick={() => setModal(false)}>
                  <Close className={classes.modalClose} />
                </Button>
                <h4 className={classes.modalTitle}>Confirmar Entrega</h4>
              </DialogTitle>
              <DialogContent id='modal-slide-description' className={classes.modalBody}>

                <div style={{ marginBottom: '20px' }}>
                  <GridItem md={6}>
                    <FormControl fullWidth>
                      <Datetime
                        dateFormat={'DD/MM/YYYY'}
                        timeFormat={true}
                        closeOnSelect={true}
                        closeOnTab={true}
                        inputProps={{ placeholder: 'Data e Hora da Chegada *' }}
                        value={new Date(entrega.dataChegada)}
                        onChange={date => setEntrega({ ...entrega, dataChegada: new Date(date) })} />
                    </FormControl>
                  </GridItem>
                </div>

                <GridItem md={6}>
                  <FormControl fullWidth>
                    <InputLabel
                      htmlFor="simple-select"
                      className={classes.selectLabel}>
                      Status *
                    </InputLabel>
                    <Select
                      MenuProps={{ className: classes.selectMenu }}
                      classes={{ select: classes.select }}
                      value={entrega.status}
                      onChange={event => setEntrega({ ...entrega, status: event.target.value })}
                      inputProps={{ name: 'simpleSelect', id: 'simple-select' }}>
                      <MenuItem
                        classes={{ root: classes.selectMenuItem, selected: classes.selectMenuItemSelected }}
                        value={'realizada'}
                        key={0}>
                        Realizada
                      </MenuItem>
                      <MenuItem
                        classes={{ root: classes.selectMenuItem, selected: classes.selectMenuItemSelected }}
                        value={'emdescarga'}
                        key={1}>
                        Em Descarga
                      </MenuItem>
                      <MenuItem
                        classes={{ root: classes.selectMenuItem, selected: classes.selectMenuItemSelected }}
                        value={'noshow'}
                        key={2}>
                        NoShow
                      </MenuItem>
                      <MenuItem
                        classes={{ root: classes.selectMenuItem, selected: classes.selectMenuItemSelected }}
                        value={'aguardandodescarga'}
                        key={3}>
                        Aguardando Descarga
                      </MenuItem>
                    </Select>
                  </FormControl>
                </GridItem>
              </DialogContent>
              <DialogActions className={classes.modalFooter + ' ' + classes.modalFooterCenter}>
                <Button onClick={() => handleSave()} color='success'>Salvar</Button>
              </DialogActions>
            </Dialog>
          </GridItem>
        </GridContainer>
      </GridItem>
    </GridContainer>
  )
}
