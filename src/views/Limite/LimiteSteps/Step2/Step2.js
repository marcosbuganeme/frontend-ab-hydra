import React from "react";
import PropTypes from "prop-types";
import _ from 'lodash';
import { grayColor } from "assets/jss/material-dashboard-pro-react.js";
import ReactTable from "react-table";
import SweetAlert from "react-bootstrap-sweetalert";
import axios from 'axios'
import withStyles from "@material-ui/core/styles/withStyles";
import Close from "@material-ui/icons/Close";
import Dvr from "@material-ui/icons/Dvr"
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js"
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";

class Step2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      faixa: { id: '', diaInicial: '', diaFinal: '', percentualLimite: '' },
      faixas: [],
      tableLoading: true,
      alert: null,
      modalTitle: '',
      modal: false
    };
  }

  componentDidMount() {
    axios.get(`/faixa`)
      .then(response =>
        response.data.map(faixa => ({
          id: faixa._id,
          diaInicial: faixa.diaInicial,
          diaFinal: faixa.diaFinal,
          percentualLimite: faixa.percentualLimite
        })))
      .then(faixas => this.setState({ faixas: faixas, tableLoading: false }))
      .catch(err => this.setState({ tableLoading: false }));
  }

  sendState() {
    return this.state;
  }

  isValidated() {
    return true;
  }

  getAlert(title) {
    return (
      <SweetAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title={title}
        onConfirm={() => this.setState({ alert: null })}
        onCancel={() => this.setState({ alert: null })}
        confirmBtnCssClass={`
          MuiButtonBase-root
          MuiButton-root
          makeStyles-button-173
          makeStyles-sm-197
          makeStyles-info-176
          MuiButton-text`}>
      </SweetAlert>
    );
  }

  handleForm(type, data) {
    const callModal = {
      'cadastro': () => this.setState({
        modal: true,
        modalTitle: <div><b>Cadastro de Faixa</b></div>,
        faixa: {
          id: '',
          diaInicial: '',
          diaFinal: '',
          percentualLimite: ''
        }
      }),
      'edicao': () => this.setState({
        modal: true,
        modalTitle: <div><b>Edição de Faixa</b></div>,
        faixa: {
          id: data.id,
          diaInicial: data.diaInicial,
          diaFinal: data.diaFinal,
          percentualLimite: data.percentualLimite
        }
      })
    }[type];

    callModal();
  }

  handleSaveForm({ request, data }) {
    this.setState({ tableLoading: true });

    const callRequest = {
      'post': () => axios.post(`/faixa`, data)
        .then(response =>
          this.setState({
            modal: false,
            tableLoading: false,
            alert: this.getAlert('Salvo com sucesso.'),
            faixas: _.unionBy([{
              id: '000',
              diaInicial: data.diaInicial,
              diaFinal: data.diaFinal,
              percentualLimite: data.percentualLimite
            }], this.state.faixas, 'id')
          })),
      'put': () => axios.put('/faixa', data)
        .then(response =>
          this.setState({
            modal: false,
            tableLoading: false,
            alert: this.getAlert('Atualizado com sucesso.'),
            faixas: _.unionBy([data], this.state.faixas, 'id')
          })),
    }[request];

    callRequest();
  }

  handleCloseModal() {
    this.setState({
      modal: false,
      faixa: { id: '', diaInicial: '', diaFinal: '', percentualLimite: '' }
    })
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
            onConfirm={() => {
              this.setState({ tableLoading: true, alert: null });
              axios.delete(`/faixa?id=${data.id}`)
                .then(response => _.remove(this.state.faixas, { id: data.id }))
                .then(resposne => this.setState({ tableLoading: false, alert: this.getAlert('Removido com sucesso.') }))
            }}
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
            Excluir faixa ?
          </SweetAlert>)
      });
    }

    const tableActions = (faixa) => ({
      ...faixa,
      actions: (
        <div className="actions-right">
          <Button
            justIcon
            round
            simple
            onClick={() => this.handleForm('edicao', faixa)}
            color="warning"
            className="edit">
            <Dvr />
          </Button>

          <Button
            justIcon
            round
            simple
            onClick={() => openAlert({ data: faixa })}
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
              Lista de faixas de acréscimo de limite.
            </h4>
            <div>{this.state.alert}</div>
          </GridItem>

          <GridItem md={12}>
            <ReactTable
              data={this.state.faixas.map(props => tableActions(props))}
              columns={[
                {
                  Header: <div style={{ float: 'left' }}>Qtd. Inicial atraso</div>,
                  accessor: "diaInicial",
                  sortable: true,
                  filterable: true
                },
                {
                  Header: <div style={{ float: 'left' }}>Qtd. Final atraso</div>,
                  accessor: "diaFinal",
                  sortable: true,
                  filterable: true
                },
                {
                  Header: <div style={{ float: 'left' }}>% Aumento limite</div>,
                  accessor: "percentualLimite",
                  sortable: true,
                  filterable: true
                },
                {
                  Header: <div style={{ float: 'left', position: 'relative', left: '50%' }}>Ações</div>,
                  accessor: "actions",
                  sortable: false,
                  filterable: false
                }
              ]}
              filterable
              nextText={'Próximo'}
              previousText={'Voltar'}
              rowsText={'Faixas'}
              pageText={'Página'}
              ofText={'de'}
              noDataText={''}
              defaultPageSize={5}
              showPaginationTop
              showPaginationBottom={false}
              loading={this.state.tableLoading}
              className="-striped -highlight" />

            <GridItem>
              <Button
                xs={3}
                size="sm"
                color="info"
                onClick={() => this.handleForm('cadastro')}>
                Adicionar
            </Button>
            </GridItem>
          </GridItem>

          <GridItem md={12}>
            <Dialog
              fullWidth={true}
              fullScreen={true}
              classes={{ paper: classes.modal }}
              open={this.state.modal}
              transition={
                React.forwardRef(function Transition(props, ref) {
                  return <Slide direction="down" ref={ref} {...props} />;
                })
              }
              keepMounted
              scroll={'body'}
              onClose={() => this.handleCloseModal()}
              aria-labelledby="modal-slide-title"
              aria-describedby="modal-slide-description">

              <DialogTitle
                id="classic-modal-slide-title"
                disableTypography
                className={classes.modalHeader}>
                <Button
                  justIcon
                  className={classes.modalCloseButton}
                  key="close"
                  aria-label="Close"
                  color="transparent"
                  onClick={() => this.handleCloseModal()}>
                  <Close className={classes.modalClose} />
                </Button>
                <h4 className={classes.modalTitle}>{this.state.modalTitle}</h4>
              </DialogTitle>

              <DialogContent id="modal-slide-description" className={classes.modalBody}>

                <GridContainer>
                  <GridItem md={4}>
                    <CustomInput
                      labelText={<span>Qtd. Inicial atraso:</span>}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: this.state.faixa.diaInicial,
                        onChange: event => this.setState({
                          faixa: { ...this.state.faixa, diaInicial: event.target.value }
                        })
                      }}
                    />
                  </GridItem>

                  <GridItem md={4}>
                    <CustomInput
                      labelText={<span>Qtd. Final atraso:</span>}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: this.state.faixa.diaFinal,
                        onChange: event => this.setState({
                          faixa: { ...this.state.faixa, diaFinal: event.target.value }
                        })
                      }}
                    />
                  </GridItem>

                  <GridItem md={4}>
                    <CustomInput
                      labelText={<span>% Aumento limite:</span>}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: this.state.faixa.percentualLimite,
                        onChange: event => this.setState({
                          faixa: { ...this.state.faixa, percentualLimite: event.target.value }
                        })
                      }}
                    />
                  </GridItem>
                </GridContainer>

              </DialogContent>

              <DialogActions className={classes.modalFooter + " " + classes.modalFooterCenter}>
                <Button onClick={() => this.handleSaveForm({
                  request: this.state.faixa.id === '' ? 'post' : 'put',
                  data: this.state.faixa
                })} color="success">Salvar</Button>
              </DialogActions>
            </Dialog>
          </GridItem>
        </GridContainer>
      </React.Fragment>
    );
  }
}

Step2.propTypes = { classes: PropTypes.object };
export default withStyles({
  infoText: { fontWeight: "300", margin: "10px 0 30px", textAlign: "center" },
  inputAdornmentIcon: { color: "#555" },
  inputAdornment: { position: "relative" },
  modalRoot: {
    overflow: "auto",
    alignItems: "unset",
    justifyContent: "unset"
  },
  modal: {
    margin: "200px",
    width: '98% !important',
    marginTop: '15px !important',
    borderRadius: "20px",
    padding: "10px",
    overflow: "visible",
    maxHeight: "unset",
    position: "relative",
    height: "fit-content"
  },
  modalHeader: {
    borderBottom: "none",
    paddingTop: "24px",
    paddingRight: "24px",
    paddingBottom: "0",
    paddingLeft: "24px",
    minHeight: "16.43px"
  },
  modalTitle: {
    margin: "0",
    lineHeight: "1.42857143"
  },
  modalCloseButton: {
    color: grayColor[0],
    marginTop: "-12px",
    WebkitAppearance: "none",
    padding: "0",
    cursor: "pointer",
    background: "0 0",
    border: "0",
    fontSize: "inherit",
    opacity: ".9",
    textShadow: "none",
    fontWeight: "700",
    lineHeight: "1",
    float: "right"
  },
  modalClose: {
    width: "16px",
    height: "16px"
  },
  modalBody: {
    paddingTop: "24px",
    paddingRight: "24px",
    paddingBottom: "16px",
    paddingLeft: "24px",
    position: "relative",
    overflow: "visible"
  },
  modalFooter: {
    padding: "15px",
    textAlign: "right",
    paddingTop: "0",
    margin: "0"
  },
  modalFooterCenter: {
    marginLeft: "auto",
    marginRight: "auto"
  },
  instructionNoticeModal: {
    marginBottom: "25px"
  },
  imageNoticeModal: {
    maxWidth: "150px"
  },
  modalSmall: {
    width: "300px"
  },
  modalSmallBody: {
    paddingTop: "0"
  },
  modalSmallFooterFirstButton: {
    margin: "0",
    paddingLeft: "16px",
    paddingRight: "16px",
    width: "auto"
  },
  modalSmallFooterSecondButton: {
    marginBottom: "0",
    marginLeft: "5px"
  }
})(Step2);
