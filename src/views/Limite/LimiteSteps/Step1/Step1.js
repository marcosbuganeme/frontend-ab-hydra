import React from "react";
import PropTypes from "prop-types";
import axios from 'axios'
import SweetAlert from "react-bootstrap-sweetalert";
import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";

class Step1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      configuracao: {
        id: '',
        periodoHistorico: '',
        periodoAtualizacao: '',
        frequenciaAtualizacao: ''
      }
    };
  }

  componentDidMount() {
    axios.get(`/configuracao`)
      .then(res => {
        if (res.data.length > 0)
          this.setState({
            configuracao: res.data.map(c => ({
              id: c._id,
              periodoHistorico: c.periodoHistorico,
              periodoAtualizacao: c.periodoAtualizacao,
              frequenciaAtualizacao: c.frequenciaAtualizacao
            })).shift()
          })
      });
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

  salvarConfiguracao({ request, data }) {
    const callRequest = {
      'post': () => axios.post(`/configuracao`, data)
        .then(response => this.setState({ alert: this.getAlert('Salvo com sucesso.') })),
      'put': () => axios.put('/configuracao', data)
        .then(response => this.setState({ alert: this.getAlert('Atualizado com sucesso.') }))
    }[request];

    callRequest();
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment >
        <GridContainer justify="center">
          <GridItem md={12}>
            <h4 className={classes.infoText}>
              Configuração básica para verificação e upgrade de crédito
            </h4>
            <div>{this.state.alert}</div>
          </GridItem>
          <GridItem md={12}>
            <GridItem md={12}>
              <CustomInput
                labelText={
                  <span>
                    Período para buscar clientes com movimentações (em meses): <small>(obrigatório)</small>
                  </span>
                }
                formControlProps={{ fullWidth: true }}
                required={true}
                inputProps={{
                  type: 'number',
                  value: this.state.configuracao.periodoHistorico,
                  onChange: event => this.setState({
                    configuracao: {
                      ...this.state.configuracao,
                      periodoHistorico: event.target.value
                    }
                  })
                }} />
            </GridItem>

            <GridItem md={12}>
              <CustomInput
                labelText={
                  <span>
                    Período mínimo para atualizar um cliente após ser atualizado (em meses): <small>(obrigatório)</small>
                  </span>
                }
                formControlProps={{ fullWidth: true }}
                required={true}
                inputProps={{
                  type: 'number',
                  value: this.state.configuracao.periodoAtualizacao,
                  onChange: event => this.setState({
                    configuracao: {
                      ...this.state.configuracao,
                      periodoAtualizacao: event.target.value
                    }
                  })
                }} />
            </GridItem>

            <GridItem md={12}>
              <CustomInput
                labelText={
                  <span>
                    Tempo entre cada execução da atualização (em dias): <small>(obrigatório)</small>
                  </span>
                }
                formControlProps={{ fullWidth: true }}
                required={true}
                inputProps={{
                  type: 'number',
                  value: this.state.configuracao.frequenciaAtualizacao,
                  onChange: event => this.setState({
                    configuracao: {
                      ...this.state.configuracao,
                      frequenciaAtualizacao: event.target.value
                    }
                  })
                }} />
            </GridItem>

            <Button
              xs={3}
              size="sm"
              color="info"
              onClick={() => this.salvarConfiguracao({
                request: this.state.configuracao.id === '' ? 'post' : 'put',
                data: this.state.configuracao
              })}>
              Salvar
          </Button>
          </GridItem>
        </GridContainer>
      </React.Fragment >
    );
  }
}

Step1.propTypes = { classes: PropTypes.object };
export default withStyles({
  infoText: { fontWeight: "300", margin: "10px 0 30px", textAlign: "center" },
  inputAdornmentIcon: { color: "#555" },
  inputAdornment: { position: "relative" }
})(Step1);
