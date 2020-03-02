import React from 'react';
import axios from 'axios'
import PropTypes from 'prop-types';
import SweetAlert from "react-bootstrap-sweetalert";
import withStyles from '@material-ui/core/styles/withStyles';
import Accordion from "components/Accordion/Accordion.js";
import GridContainer from 'components/Grid/GridContainer.js';
import GridItem from 'components/Grid/GridItem.js';
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";

class Step3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      apiKey: '',
      emailCobranca: '',
      tableLoading: false,
      alert: null
    };
  }

  async componentDidMount() {
    this.setState({ tableLoading: true });
    const { _id, apiKey, emailCobranca } = (await axios.get(`/cobranca/configuracoes`)).data.result;
    this.setState({ id: _id });
    this.setState({ apiKey: apiKey });
    this.setState({ emailCobranca: emailCobranca });
    this.setState({ tableLoading: false });
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

  render() {
    const { classes } = this.props;

    const hideAlert = () => {
      this.setAlert(null);
    }
    const openAlert = () => {
      this.setAlert(null);
      this.setAlert(
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          showCancel={false}
          confirmBtnText={'Fechar'}
          onConfirm={() => hideAlert()}
          confirmBtnCssClass={`
              MuiButtonBase-root
              MuiButton-root
              makeStyles-button-173
              makeStyles-sm-197
              makeStyles-info-176
              MuiButton-text`}>
          Salvo com sucesso.
        </SweetAlert >);

    }

    const handleConfiguracaoSave = (e) => {
      e.preventDefault();
      const data = {
        id: this.state.id,
        apiKey: this.state.apiKey,
        emailCobranca: this.state.emailCobranca
      };

      if (data.id !== null)
        axios.put(`/cobranca/configuracoes/${data.id}`, data).then(response => openAlert());
      else
        axios.post(`/cobranca/configuracoes`, data).then(response => openAlert());
    }

    return (
      <React.Fragment>
        <GridContainer justify='center'>
          <GridItem xs={12} sm={12}>
            <h4 className={classes.infoText}>
              Configuração de conta para envio de email.
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
                      title: "Configuração",
                      content:
                        <GridContainer>
                          <GridItem md={12}>
                            <CustomInput
                              id="apiKey"
                              labelText={<span>Token: <small>(obrigatório)</small></span>}
                              formControlProps={{ fullWidth: true }}
                              inputProps={{
                                value: this.state.apiKey,
                                onChange: event => this.setState({ apiKey: event.target.value })
                              }}
                            />
                          </GridItem>

                          <GridItem md={12}>
                            <CustomInput
                              id="emailCobranca"
                              labelText={<span>Campo para envio do Email: <small>(obrigatório)</small></span>}
                              formControlProps={{ fullWidth: true }}
                              inputProps={{
                                value: this.state.emailCobranca,
                                onChange: event => this.setState({ emailCobranca: event.target.value })
                              }}
                            />
                          </GridItem>

                          <GridItem>
                            <Button
                              xs={3}
                              size="sm"
                              color="info"
                              onClick={e => handleConfiguracaoSave(e)}>
                              Salvar Configuração
                            </Button>
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
