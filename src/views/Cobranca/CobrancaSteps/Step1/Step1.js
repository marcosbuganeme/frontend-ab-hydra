import React from "react";
import _ from 'lodash';
import PropTypes from "prop-types";
import ReactTable from "react-table";
import rt from "react-table/react-table.css";
import axios from 'axios'
import SweetAlert from "react-bootstrap-sweetalert";
import withStyles from "@material-ui/core/styles/withStyles";
import Close from "@material-ui/icons/Close";
import Dvr from "@material-ui/icons/Dvr";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Accordion from "components/Accordion/Accordion.js";
import Button from "components/CustomButtons/Button.js";
import ConteudoForm from './ConteudoForm.js';
import ReactNullTextLoad from 'components/ReactNullTextLoad/ReactNullTextLoad'

class Step1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assunto: {
        id: null,
        assunto: '',
        mensagem: '',
        enviarAssinatura: false,
        geraPdf: false
      },
      assuntos: [],
      modal: false,
      modalTitle: '',
      tableLoading: true,
      alert: null
    };
  }

  componentDidMount() {
    axios.get(`/cobranca/conteudos`)
      .then(result => this.setState({
        assuntos: result.data.result.map(assunto => ({ ...assunto, id: assunto._id })),
        tableLoading: false
      }))
      .catch(err => this.setState({ assuntos: [], tableLoading: false }))
  }

  sendState() {
    return this.state;
  }

  isValidated() {
    return true;
  }

  handleForm(type, data) {
    const callForm = {
      'cadastro': () => this.setState({
        modal: true,
        modalTitle: 'Cadastro de Conteúdo',
        assunto: {
          id: null,
          assunto: '',
          mensagem: '',
          enviarAssinatura: false,
          geraPdf: false
        }
      }),
      'edicao': () => this.setState({ modal: true, modalTitle: 'Edição de Conteúdo', assunto: data })
    }[type];

    callForm();
  }

  handleModal(arg, data) {
    this.setState({ modal: arg });

    if (data) {
      const conteudo = {
        id: data.id,
        assunto: data.assunto,
        mensagem: data.mensagem,
        enviarAssinatura: data.enviarAssinatura,
        geraPdf: data.geraPdf
      };

      this.setState({ tableLoading: true });

      if (conteudo.id !== null)
        axios.put(`/cobranca/conteudos/${conteudo.id}`, conteudo)
          .then(response => {
            const assunto = response.data.result;
            this.setState({
              tableLoading: false,
              assuntos: _.unionBy([{
                id: assunto._id,
                assunto: assunto.assunto,
                mensagem: assunto.mensagem,
                enviarAssinatura: assunto.enviarAssinatura,
                geraPdf: assunto.geraPdf
              }], this.state.assuntos, 'id')
            });
          })
          .catch(err => this.setState({ tableLoading: false }))
      else if (conteudo.id === null && conteudo.assunto !== '')
        axios.post(`/cobranca/conteudos`, conteudo)
          .then(response => {
            const assunto = response.data.result;
            this.setState({
              tableLoading: false,
              assuntos: _.unionBy([{
                id: assunto._id,
                assunto: assunto.assunto,
                mensagem: assunto.mensagem,
                enviarAssinatura: assunto.enviarAssinatura,
                geraPdf: assunto.geraPdf
              }], this.state.assuntos, 'id')
            })
          })
          .catch(err => this.setState({ tableLoading: false }))

      this.setState({ tableLoading: false })
    }
  }

  render() {
    const { classes } = this.props;

    const openAlert = ({ data }) => {
      this.setState({
        alert: (
          <SweetAlert
            danger
            style={{ display: "block", marginTop: "-100px" }}
            showCancel={true}
            confirmBtnText={'Confirmar'}
            cancelBtnText={'Cancelar'}
            onConfirm={
              () => this.setState({ tableLoading: true, alert: null },
                () => axios.delete(`/cobranca/conteudos/${data.id}`)
                  .then(() => _.remove(this.state.assuntos, { id: data.id }))
                  .then(() => this.setState({ tableLoading: false })))
            }
            onCancel={() => this.setState({ alert: null })}
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
            Excluir conteúdo, <b>{data.assunto}</b> ?
          </SweetAlert>)
      });
    }

    const tableActions = (assunto) => ({
      ...assunto,
      actions: (
        <div className="actions-right">
          <Button
            justIcon
            round
            simple
            onClick={() => this.handleForm('edicao', assunto)}
            color="warning"
            className="edit">
            <Dvr />
          </Button>

          <Button
            justIcon
            round
            simple
            onClick={() => openAlert({ data: assunto })}
            color="danger"
            className="remove">
            <Close />
          </Button>
        </div>
      )
    });

    return (
      <React.Fragment>
        <GridContainer justify="center">
          <GridItem md={12}>
            <h4 className={classes.infoText}>
              Listagem e cadastro de conteúdo para ser enviado como notificação.
            </h4>
            {/* CX. DIALOGO */}
            <div>{this.state.alert}</div>
          </GridItem>

          {/* CONTEUDOS */}
          <GridItem md={12}>
            <Accordion
              active={0}
              collapses={[
                {
                  title: "Conteúdos Cadastrados",
                  content:
                    <GridItem md={12}>
                      <ReactTable
                        data={this.state.assuntos.map(assunto => tableActions(assunto))}
                        filterable
                        nextText={'Próximo'}
                        previousText={'Voltar'}
                        rowsText={'Conteúdos'}
                        pageText={'Página'}
                        ofText={'de'}
                        NoDataComponent={ReactNullTextLoad}
                        loading={this.state.tableLoading}
                        columns={[
                          // { Header: "ID", accessor: "id" },
                          { Header: "Conteúdo", accessor: "assunto" },
                          { Header: "Ações", accessor: "actions", sortable: false, filterable: false, width: 100 }
                        ]}
                        defaultPageSize={5}
                        showPaginationTop
                        showPaginationBottom={false}
                        className="-striped -highlight" />
                      <Button
                        xs={3}
                        size="sm"
                        color="info"
                        onClick={() => this.handleForm('cadastro')}>
                        Cadastrar Conteúdo
                      </Button>
                    </GridItem>
                }]} />
          </GridItem>
        </GridContainer>

        {/* FORMULARIO CADASTRO/EDICAO */}
        <ConteudoForm
          modal={this.state.modal}
          modalAction={this.handleModal.bind(this)}
          title={this.state.modalTitle}
          assunto={this.state.assunto} />
      </React.Fragment>
    );
  }
}

Step1.propTypes = { classes: PropTypes.object };
export default withStyles({
  infoText: { fontWeight: "300", margin: "10px 0 30px", textAlign: "center" },
  inputAdornmentIcon: { color: "#555" },
  inputAdornment: { position: "relative" }, rt
})(Step1);
