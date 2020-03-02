import React from 'react';
import axios from 'axios'
import ReactTable from "react-table";
import PropTypes from 'prop-types';
import Datetime from "react-datetime";
import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from "@material-ui/core/FormControl";

import Accordion from "components/Accordion/Accordion.js";
import GridContainer from 'components/Grid/GridContainer.js';
import GridItem from 'components/Grid/GridItem.js';
import Button from "components/CustomButtons/Button.js";

class Step3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      registro: {
        data: '',
        codigoCliente: '',
        limiteAnterior: '',
        novoLimite: '',
        prazoMedio: '',
        valorMovimentacao: '',
        percentualAcrescimo: ''
      },
      registros: [],
      data: '',
      tableLoading: false
    };
  }

  setAlert(arg) {
    this.setState({ alert: arg });
  }

  sendState() {
    return this.state;
  }

  isValidated() {
    return true;
  }

  handleDate(date) {
    this.setState({ data: '' });
    if (date) this.setState({ data: new Date(`'${date}'`).toLocaleDateString() });
  };

  handleFiltro(e) {
    const queryDataEnvio = `${this.state.data ? `?data=${this.state.data}` : ''}`;
    const url = `/registroAtualizacao${queryDataEnvio}`;

    this.setState({ tableLoading: true, registros: [] });

    axios.get(url)
      .then(response =>
        this.setState({
          registros: response.data.map(registro => ({
            id: registro._id,
            data: new Date(registro.data).toLocaleDateString(),
            codigoCliente: registro.codigoCliente,
            limiteAnterior: registro.limiteAnterior,
            novoLimite: registro.novoLimite,
            prazoMedio: registro.prazoMedio,
            valorMovimentacao: registro.valorMovimentacao,
            percentualAcrescimo: registro.percentualAcrescimo
          })),
          tableLoading: false
        }))
      .catch(err => this.setState({ tableLoading: false }));
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <GridContainer justify='center'>
          <GridItem xs={12} sm={12}>
            <h4 className={classes.infoText}>
              Filtrar registros de execução.
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
                      title: "Filtros:",
                      content:
                        <GridContainer>
                          <GridItem md={12}>
                            <GridItem md={6}>
                              <FormControl>
                                <Datetime
                                  dateFormat='DD/MM/YYYY'
                                  timeFormat={false}
                                  closeOnSelect={true}
                                  closeOnTab={true}
                                  inputProps={{ placeholder: "Data:" }}
                                  onChange={this.handleDate.bind(this)} />
                              </FormControl>

                              <Button
                                style={{ marginLeft: '5px' }}
                                size="sm"
                                color="info"
                                onClick={e => this.handleFiltro(e)}>
                                Pesquisar
                              </Button>
                            </GridItem>
                          </GridItem>
                        </GridContainer>
                    }]} />

                <Accordion
                  active={0}
                  collapses={[
                    {
                      title: "Resultados da Pesquisa:",
                      content:
                        <GridContainer>
                          <GridItem md={12}>
                            <ReactTable
                              data={this.state.registros}
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
                                  Header: <div style={{ float: 'left' }}>Data</div>,
                                  accessor: "data",
                                  sortable: false,
                                  filterable: false,
                                  Cell: row => <div>{row.value}</div>
                                },
                                {
                                  Header: <div style={{ float: 'left' }}>Cliente</div>,
                                  accessor: "codigoCliente",
                                  sortable: false,
                                  filterable: false,
                                  Cell: row => <div>{row.value}</div>
                                },
                                {
                                  Header: <div style={{ float: 'left' }}>Anterior</div>,
                                  accessor: "limiteAnterior",
                                  sortable: false,
                                  filterable: false,
                                  Cell: row => <div>{row.value}</div>
                                },
                                {
                                  Header: <div style={{ float: 'left' }}>Novo</div>,
                                  accessor: "novoLimite",
                                  sortable: false,
                                  filterable: false,
                                  Cell: row => <div>{row.value}</div>
                                },
                                {
                                  Header: <div style={{ float: 'left' }}>Prazo Médio</div>,
                                  accessor: "prazoMedio",
                                  sortable: false,
                                  filterable: false,
                                  Cell: row => <div>{row.value}</div>
                                },
                                {
                                  Header: <div style={{ float: 'left' }}>Movimentação</div>,
                                  accessor: "valorMovimentacao",
                                  sortable: false,
                                  filterable: false,
                                  Cell: row => <div>{row.value}</div>
                                },
                                {
                                  Header: <div style={{ float: 'left' }}>% Acrescimo</div>,
                                  accessor: "percentualAcrescimo",
                                  sortable: false,
                                  filterable: false,
                                  Cell: row => <div>{row.value}</div>
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

Step3.propTypes = { classes: PropTypes.object };
export default withStyles({
  infoText: { fontWeight: '300', margin: '10px 0 30px', textAlign: 'center' },
  inputAdornmentIcon: { color: '#555' },
  inputAdornment: { position: 'relative' }
})(Step3);
