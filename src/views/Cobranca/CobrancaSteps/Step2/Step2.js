import React from 'react';
import axios from 'axios'
import PropTypes from 'prop-types';
import _ from 'lodash';
import ReactTable from "react-table";
import SweetAlert from "react-bootstrap-sweetalert";
import withStyles from '@material-ui/core/styles/withStyles';
import Dvr from "@material-ui/icons/Dvr";
import Close from "@material-ui/icons/Close";
import Accordion from "components/Accordion/Accordion.js";
import GridContainer from 'components/Grid/GridContainer.js';
import GridItem from 'components/Grid/GridItem.js';
import Button from "components/CustomButtons/Button.js";
import NotificacaoForm from './NotificacaoForm.js';

class Step2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notificacao: { id: null, acao: '', dias: '', idConteudo: '', conteudo: '' },
      notificacoes: [],
      tableLoading: false,
      notificacaoAlert: null
    };
  }

  async componentDidMount() {
    axios.get(`/cobranca/notificacoes`)
      .then(response => response.data.result
        .map(async notificacao => {
          const data = {
            ...notificacao,
            id: notificacao._id,
            acao: notificacao.acao.toUpperCase(),
            idConteudo: notificacao.conteudo._id,
            conteudo: notificacao.conteudo.assunto
          }

          this.setState({ notificacoes: _.unionBy([data], this.state.notificacoes, 'id') });
        }))
  }

  setNotificacaoAlert(arg) {
    this.setState({ notificacaoAlert: arg });
  }

  sendState() {
    return this.state;
  }

  isValidated() {
    return true;
  }

  handleEditClick(notificacao) {
    this.handleForm('edicao', notificacao)
  }

  handleForm(type, data) {
    if (type) {
      if (type === 'cadastro') {
        this.setState({
          modalTitle: 'Cadastro de Notificação',
          notificacao: { id: null, acao: '', dias: '', idConteudo: '' }
        });
      } else {
        this.setState({ modalTitle: 'Edição de Notificação', notificacao: data });
      }
      this.setState({ modal: true });
    }
  }

  handleModal(arg, data) {
    this.setState({ modal: arg });

    if (data) {
      this.setState({ tableLoading: true });

      if (data.id !== '')
      axios.put(`/cobranca/notificacoes/${data.id}`, data)
          .then(async response => {
            let notificacao = response.data.result;

            const res = await axios.get(`/cobranca/conteudos/${notificacao.conteudo}`);

            notificacao = {
              ...notificacao,
              id: notificacao._id,
              acao: notificacao.acao.toUpperCase(),
              idConteudo: res.data.result._id,
              conteudo: res.data.result.assunto
            };

            this.setState({
              tableLoading: false,
              notificacoes: _.unionBy([notificacao], this.state.notificacoes, 'id')
            });
          })
          .catch(err => this.setState({ tableLoading: false }))
      else
      axios.post(`/cobranca/notificacoes`, data)
          .then(async response => {
            let notificacao = response.data.result;

            const res = await axios.get(`/cobranca/conteudos/${notificacao.conteudo}`);

            notificacao = {
              ...notificacao,
              id: notificacao._id,
              acao: notificacao.acao.toUpperCase(),
              idConteudo: res.data.result._id,
              conteudo: res.data.result.assunto
            };

            this.setState({
              tableLoading: false,
              notificacoes: _.unionBy([notificacao], this.state.notificacoes, 'id')
            });
          });

      this.setState({ tableLoading: false });
    }
  }

  render() {
    const { classes } = this.props;
    const tableColumns = [
      // { Header: "ID", accessor: "id" },
      { Header: "Dias", accessor: "dias" },
      { Header: "Ação", accessor: "acao" },
      { Header: "Conteúdo", accessor: "conteudo" },
      { Header: "Ações", accessor: "actions", sortable: false, filterable: false, width: 100 }
    ];
    const hideNotificacaoAlert = () => {
      this.setNotificacaoAlert(null);
    }
    const openNotificacaoAlert = ({ type, data }) => {
      this.setNotificacaoAlert(null);
      if (type === 'delete')
        this.setNotificacaoAlert(
          <SweetAlert
            danger
            style={{ display: "block", marginTop: "-100px" }}
            showCancel={true}
            confirmBtnText={'Confirmar'}
            cancelBtnText={'Cancelar'}
            onConfirm={() => {
              this.setState({ tableLoading: true });
              hideNotificacaoAlert();
              axios.delete(`/cobranca/notificacoes/${data.id}`)
                .then(response => {
                  _.remove(this.state.notificacoes, { id: data.id });
                  this.setState({ tableLoading: false });
                });
            }}
            onCancel={() => hideNotificacaoAlert()}
            cancelBtnCssClass={`
              MuiButtonBase-root
              MuiButton-root
              makeStyles-button-173
              makeStyles-sm-197
              MuiButton-text`}
            confirmBtnCssClass={`
              MuiButtonBase-root
              MuiButton-root
              makeStyles-button-173
              makeStyles-sm-197
              makeStyles-info-176
              MuiButton-text`}>
            Excluir notificação ?
          </SweetAlert>);

    }
    const tableActions = (notificacao) => ({
      ...notificacao,
      actions: (
        <div className="actions-right">
          <Button
            justIcon
            round
            simple
            onClick={() => this.handleEditClick(notificacao)}
            color="warning"
            className="edit">
            <Dvr />
          </Button>

          <Button
            justIcon
            round
            simple
            onClick={() => openNotificacaoAlert({ type: 'delete', data: notificacao })}
            color="danger"
            className="remove">
            <Close />
          </Button>
        </div>
      )
    });

    return (
      <React.Fragment>
        <GridContainer justify='center'>
          <GridItem xs={12} sm={12}>
            <h4 className={classes.infoText}>
              Cadastro e edição de notificações.
            </h4>
            {/* CX. DIALOGO */}
            <div>{this.state.notificacaoAlert}</div>
          </GridItem>
          <GridItem xs={12}>
            <Accordion
              active={0}
              collapses={[
                {
                  title: "Notificações Cadastradas",
                  content:
                    <GridItem md={12}>
                      <ReactTable
                        data={this.state.notificacoes.map(notificacao => tableActions(notificacao))}
                        filterable
                        nextText={'Próximo'}
                        previousText={'Voltar'}
                        rowsText={'Notificações'}
                        pageText={'Página'}
                        ofText={'de'}
                        noDataText={''}
                        loading={this.state.tableLoading}
                        columns={tableColumns}
                        defaultPageSize={5}
                        showPaginationTop
                        showPaginationBottom={false}
                        className="-striped -highlight"
                      />
                      <Button
                        xs={3}
                        size="sm"
                        color="info"
                        onClick={() => this.handleForm('cadastro')}>
                        Cadastrar Notificação
                     </Button>
                    </GridItem>
                }]} />
          </GridItem>
        </GridContainer >

        <NotificacaoForm
          modal={this.state.modal}
          modalAction={this.handleModal.bind(this)}
          title={this.state.modalTitle}
          id={this.state.notificacao.id}
          acao={this.state.notificacao.acao}
          dias={this.state.notificacao.dias}
          idConteudo={this.state.notificacao.idConteudo}
          clientes={this.state.notificacao.clientes}
          cobrancas={this.state.notificacao.cobrancas}
          filiais={this.state.notificacao.filiais} />
      </React.Fragment>
    );
  }
}

Step2.propTypes = { classes: PropTypes.object };
export default withStyles({
  infoText: { fontWeight: '300', margin: '10px 0 30px', textAlign: 'center' },
  inputAdornmentIcon: { color: '#555' },
  inputAdornment: { position: 'relative' }
})(Step2);
