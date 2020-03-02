import React from 'react';
import axios from 'axios'
import ReactTable from "react-table";
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import Datetime from "react-datetime";
import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from "@material-ui/core/FormControl";

import Accordion from "components/Accordion/Accordion.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import GridContainer from 'components/Grid/GridContainer.js';
import GridItem from 'components/Grid/GridItem.js';
import Button from "components/CustomButtons/Button.js";

class Step4 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      log: {
        id: '',
        idNotificacao: '',
        idConteudo: '',
        dataEnvio: '',
        codigoTitulo: '',
        conteudo: '',
        notificacao: ''
      },
      logs: [],
      tituloNotificacao: '',
      dataEnvio: '',
      codigoCliente: '',
      tableLoading: false
    };
  }

  async componentDidMount() {
    this.setState({ tableLoading: true });
    this.setState({ logs: [] });
    this.setState({ tableLoading: false });
  }

  handleDate(date) {
    this.setState({ dataEnvio: '' });

    if (date && typeof date !== 'string') {
      const data = new Date(`'${date}'`);
      this.setState({ dataEnvio: format(data, 'yyyy-MM-dd') });
    }
  };

  setAlert(arg) {
    this.setState({ alert: arg });
  }

  sendState() {
    return this.state;
  }

  isValidated() {
    return true;
  }

  async handleFiltro(e) {
    this.setState({ tableLoading: true });
    this.setState({ logs: [] });

    const queryCodigoTitulo = `${this.state.tituloNotificacao ? `&codigoTitulo=${this.state.tituloNotificacao}` : ''}`;
    const queryDataEnvio = `${this.state.dataEnvio ? `&dataEnvio=${this.state.dataEnvio}` : ''}`;
    const queryCodigoCliente = `${this.state.codigoCliente ? `&codigoCliente=${this.state.codigoCliente}` : ''}`;

    let query = `?${queryCodigoTitulo}${queryDataEnvio}${queryCodigoCliente}`.replace('?&', '?');

    query = query.length === 1 ? '' : query;

    const url = `/cobranca/envios${query}`;
    const response = await axios.get(url);

    if (response) {
      const data = response.data.result;
      const logs = await Promise.all(data.map(async log => {
        return {
          ...log,
          tabCodTitulo: log.titulo,
          tabCodCli: log.codigoCliente,
          tabCodConteudo: log.conteudo.assunto,
          tabIdNotificacao: log.notificacao ? log.notificacao._id : null,
          tabDataEnvio: format(new Date(log.dataEnvio), 'dd/MM/yyyy')
        };
      }));

      this.setState({ logs: logs });
    }

    this.setState({ tableLoading: false });
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <GridContainer justify='center'>
          <GridItem xs={12} sm={12}>
            <h4 className={classes.infoText}>
              Filtrar logs das notificações.
            </h4>
            <div>{this.state.alert}</div>
          </GridItem>
          <GridItem md={12}>
            <GridContainer>
              <GridItem md={12}>

                <Accordion
                  active={0}
                  collapses={[
                    {
                      title: "Filtros",
                      content:
                        <GridContainer>
                          <GridItem md={12}>
                            <GridItem md={6}>
                              <CustomInput
                                id="codigoCliente"
                                labelText={<span>Código do cliente cobrado:</span>}
                                formControlProps={{ fullWidth: true }}
                                inputProps={{
                                  value: this.state.codigoCliente,
                                  onChange: event => this.setState({ codigoCliente: event.target.value })
                                }}
                              />
                            </GridItem>
                          </GridItem>

                          <GridItem md={12}>
                            <GridItem md={6}>
                              <CustomInput
                                id="titulo"
                                labelText={<span>Código do título referente a notificação:</span>}
                                formControlProps={{ fullWidth: true }}
                                inputProps={{
                                  value: this.state.tituloNotificacao,
                                  onChange: event => this.setState({ tituloNotificacao: event.target.value })
                                }}
                              />
                            </GridItem>
                          </GridItem>

                          <GridItem md={12}>
                            <GridItem md={6}>
                              <FormControl fullWidth>
                                <Datetime
                                  dateFormat={'DD/MM/YYYY'}
                                  timeFormat={false}
                                  closeOnSelect={true}
                                  closeOnTab={true}
                                  inputProps={{ placeholder: "Data Envio:" }}
                                  onChange={this.handleDate.bind(this)} />
                              </FormControl>
                            </GridItem>
                          </GridItem>

                          <GridItem>
                            <Button
                              xs={3}
                              size="sm"
                              color="info"
                              onClick={e => this.handleFiltro(e)}>
                              Pesquisar
                            </Button>
                          </GridItem>
                        </GridContainer>
                    }]} />

                <Accordion
                  active={0}
                  collapses={[
                    {
                      title: "Resultados",
                      content:
                        <GridContainer>
                          <GridItem md={12}>
                            <ReactTable
                              data={this.state.logs}
                              filterable
                              nextText={'Próximo'}
                              previousText={'Voltar'}
                              rowsText={'Logs'}
                              pageText={'Página'}
                              ofText={'de'}
                              noDataText={''}
                              loading={this.state.tableLoading}
                              columns={[
                                {
                                  Header: <div style={{ float: 'left' }}><b>Cliente</b></div>,
                                  accessor: "tabCodCli",
                                  sortable: false,
                                  filterable: false,
                                  Cell: row => <div><b>{row.value}</b></div>
                                },
                                {
                                  Header: <div style={{ float: 'left' }}><b>Título</b></div>,
                                  accessor: "tabCodTitulo",
                                  sortable: false,
                                  filterable: false,
                                  Cell: row => <div><b>{row.value}</b></div>
                                },
                                {
                                  Header: <div style={{ float: 'left' }}><b>Conteúdo</b></div>,
                                  accessor: "tabCodConteudo",
                                  sortable: false,
                                  filterable: false,
                                  width: 200,
                                  Cell: row => <div><b>{row.value}</b></div>
                                },
                                {
                                  Header: <div style={{ float: 'left' }}><b>ID Notificação</b></div>,
                                  accessor: "tabIdNotificacao",
                                  sortable: false,
                                  filterable: false,
                                  Cell: row => <div><b>{row.value}</b></div>
                                },
                                {
                                  Header: <div style={{ float: 'left' }}><b>Data Envio</b></div>,
                                  accessor: "tabDataEnvio",
                                  sortable: false,
                                  filterable: false,
                                  Cell: row => <div><b>{row.value}</b></div>
                                }
                              ]}
                              defaultPageSize={5}
                              showPaginationTop
                              showPaginationBottom={false}
                              className="-striped -highlight"
                            />
                          </GridItem>
                        </GridContainer>
                    }]} />

              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
      </React.Fragment>
    );
  }
}

Step4.propTypes = { classes: PropTypes.object };
export default withStyles({
  infoText: { fontWeight: '300', margin: '10px 0 30px', textAlign: 'center' },
  inputAdornmentIcon: { color: '#555' },
  inputAdornment: { position: 'relative' }
})(Step4);
