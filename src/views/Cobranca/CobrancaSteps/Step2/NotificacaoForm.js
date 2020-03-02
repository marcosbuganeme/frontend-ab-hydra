import React from 'react';
import axios from 'axios'
import _ from 'lodash';
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Close from "@material-ui/icons/Close";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddAlert from "@material-ui/icons/AddAlert";
import Snackbar from "components/Snackbar/Snackbar.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Button from "components/CustomButtons/Button.js";
import Accordion from "components/Accordion/Accordion.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import styles from "assets/jss/material-dashboard-pro-react/modalStyle.js";

const useStyles = makeStyles(styles);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
export default function NotificacaoForm(props) {
  const classes = useStyles();

  const [title, setTitle] = React.useState(props.title);
  const [modal, setModal] = React.useState(props.modal);

  const [id, setId] = React.useState(props.id);
  const [acao, setAcao] = React.useState(props.acao);
  const [dias, setDias] = React.useState(props.dias);
  const [conteudo, setConteudo] = React.useState(props.idConteudo);
  const [conteudos, setConteudos] = React.useState([]);

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [clientes, setClientes] = React.useState([]);
  const [clientesSelecionados, setClientesSelecionados] = React.useState([]);

  const [openCobranca, setOpenCobranca] = React.useState(false);
  const [loadingCobranca, setLoadingCobranca] = React.useState(false);
  const [cobrancas, setCobrancas] = React.useState([]);
  const [cobrancasSelecionadas, setCobrancasSelecionadas] = React.useState([]);

  const [openFilial, setOpenFilial] = React.useState(false);
  const [loadingFilial, setLoadingFilial] = React.useState(false);
  const [filiais, setFiliais] = React.useState([]);
  const [filiaisSelecionadas, setFiliaisSelecionadas] = React.useState([]);

  const [tc, setTC] = React.useState(false);
  const [errors, setErrors] = React.useState('');

  React.useEffect(() => {
    const fetchData = async () => {
      const { id, idConteudo, acao, dias, clientes, cobrancas, filiais, title, modal } = props;
      await axios.get(`/cobranca/conteudos`)
        .then(response => setConteudos(response.data.result.map(conteudo => ({
          ...conteudo,
          id: conteudo._id
        }))));

      setTitle(title);
      setModal(modal);
      setId('');
      setConteudo('');
      setAcao('');
      setDias('');
      setClientesSelecionados([]);
      setCobrancasSelecionadas([]);
      setFiliaisSelecionadas([]);

      if (id) {
        setLoading(true);
        setLoadingCobranca(true);
        setLoadingFilial(true);
        setConteudo(idConteudo);
        setAcao(acao);
        setDias(dias);

        if (clientes.length > 0)
          setClientesSelecionados(clientes.map(value => ({
            ...value,
            value: value.codigo,
            name: `${value.codigo} - ${value.cliente}`
          })));

        if (cobrancas.length > 0)
          setCobrancasSelecionadas(cobrancas.map(value => ({
            ...value,
            value: value.codigo,
            name: `${value.codigo} - ${value.cobranca}`
          })));

        if (filiais.length > 0)
          setFiliaisSelecionadas(filiais.map(value => ({
            ...value,
            value: value.codigo,
            name: `${value.codigo} - ${value.razaoSocial}`
          })));

        setLoading(false);
        setLoadingCobranca(false);
        setLoadingFilial(false);
        setId(id);
      }
    };
    fetchData();
  }, [props]);

  const callbackModalAction = (arg, data) => {
    setModal(arg);
    props.modalAction(arg, data ? data : null);
  }

  const onSave = () => {
    const notificacao = {
      id: id,
      acao: acao,
      dias: dias,
      idConteudo: conteudo,
      conteudo: conteudo,
      clientes: clientesSelecionados.map(value => ({
        codigo: value.codigo,
        cliente: value.cliente,
        idNotificacao: id
      })),
      cobrancas: cobrancasSelecionadas.map(value => ({
        codigo: value.codigo,
        cobranca: value.cobranca,
        idNotificacao: id
      })),
      filiais: filiaisSelecionadas.map(value => ({
        codigo: value.codigo,
        razaoSocial: value.razaoSocial,
        idNotificacao: id
      }))
    };

    let errors = '';
    if (!notificacao.acao) errors = errors.concat('acao');
    if (!notificacao.dias) errors = errors.concat('dias');
    if (!notificacao.conteudo) errors = errors.concat('conteudo');
    if (errors) return callNotification(`Favor preencher os campos corretamente antes de salvar.`);

    callbackModalAction(false, notificacao);
  }

  const setOptions = (data) => [{ value: 'TODOS', name: 'TODOS' }, ...data];

  const callNotification = msg => {
    setErrors(msg);
    setTC(true);

    setTimeout(() => {
      setTC(false);
      setErrors('');
    }, 6000);

    return;
  }

  const handleSearch = _.debounce(async (arg, api) => {
    if (arg && api)
      if (api === 'cliente') {
        setLoading(true);
        const response = await axios.get(`/winthor/clientes/${arg}`);

        if (response) {
          const data = response.data.result.map(value => ({
            ...value,
            value: value.codigo,
            name: `${value.codigo} - ${value.cliente}`
          }));
          setClientes(setOptions(data));
        }
        setLoading(false);
      } else if (api === 'cobranca') {
        setLoadingCobranca(true);
        const response = await axios.get(`/winthor/cobrancas/${arg}`);

        if (response) {
          const data = response.data.result.map(value => ({
            ...value,
            value: value.codigo,
            name: `${value.codigo} - ${value.cobranca}`
          }));
          setCobrancas(setOptions(data));
        }
        setLoadingCobranca(false);
      } else if (api === 'filial') {
        setLoadingFilial(true);
        const response = await axios.get(`/winthor/filiais/${arg}`);

        if (response) {
          const data = response.data.result.map(value => ({
            ...value,
            value: value.codigo,
            name: `${value.codigo} - ${value.razaoSocial}`
          }));
          setFiliais(setOptions(data));
        }
        setLoadingFilial(false);
      }
  }, 100);

  return (
    <div>
      <Dialog
        fullWidth={true}
        fullScreen={true}
        classes={{ paper: classes.modal }}
        open={modal}
        transition={Transition}
        keepMounted
        scroll={'body'}
        onClose={() => callbackModalAction(false)}
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
            onClick={() => callbackModalAction(false)}>
            <Close className={classes.modalClose} />
          </Button>
          <h4 className={classes.modalTitle}>{title}</h4>
        </DialogTitle>
        <DialogContent id="modal-slide-description" className={classes.modalBody}>
          <GridContainer>

            <GridItem xs={12} sm={12} md={3}>
              <Snackbar
                place="tc"
                color="warning"
                icon={AddAlert}
                message={errors}
                open={tc}
                closeNotification={() => setTC(false)}
                close />
            </GridItem>

            <GridItem md={12}>
              <CustomTabs
                headerColor="primary"
                tabs={[
                  {
                    tabName: "Notificação",
                    tabContent: (
                      <GridItem md={12}>
                        <GridContainer>
                          <GridItem md={12}>
                            <Accordion
                              active={0}
                              collapses={[
                                {
                                  title: "Notificar",
                                  content:
                                    <GridItem md={12}>
                                      <GridContainer>
                                        <GridItem md={12}>
                                          <span><small>(obrigatório)</small></span>
                                        </GridItem>
                                        <GridItem md={12}>
                                          <div className={classes.checkboxAndRadio + " " + classes.checkboxAndRadioHorizontal}>
                                            <FormControlLabel
                                              control={
                                                <Radio
                                                  checked={acao.toUpperCase() === 'ANTES'}
                                                  onChange={() => setAcao("ANTES")}
                                                  value="ACAO"
                                                  name="antesVencimento"
                                                  aria-label="A"
                                                  icon={<FiberManualRecord className={classes.radioUnchecked} />}
                                                  checkedIcon={<FiberManualRecord className={classes.radioChecked} />}
                                                  classes={{ checked: classes.radio, root: classes.radioRoot }} />}
                                              classes={{ label: classes.label }}
                                              label="Antes do vencimento" />

                                            <FormControlLabel
                                              control={
                                                <Radio
                                                  checked={acao.toUpperCase() === "DEPOIS"}
                                                  onChange={() => setAcao("DEPOIS")}
                                                  value="DEPOIS"
                                                  name="aposVencimento"
                                                  aria-label="B"
                                                  icon={<FiberManualRecord className={classes.radioUnchecked} />}
                                                  checkedIcon={<FiberManualRecord className={classes.radioChecked} />}
                                                  classes={{ checked: classes.radio, root: classes.radioRoot }} />}
                                              classes={{ label: classes.label }}
                                              label="Após vencimento" />
                                          </div>
                                        </GridItem>

                                        <GridItem md={2}>
                                          <CustomInput
                                            id="dias"
                                            labelText={<span>Quantos Dias: <small>(obrigatório)</small></span>}
                                            formControlProps={{ fullWidth: true }}
                                            inputProps={{
                                              type: 'number',
                                              value: dias,
                                              onChange: event => event.target.value > 0 ? setDias(event.target.value) : null
                                            }} />
                                        </GridItem>

                                        <GridItem xs={12} sm={6} md={5} lg={5}>
                                          <div style={{ marginTop: '9px' }}>
                                            <FormControl fullWidth className={classes.selectFormControl}>
                                              <InputLabel
                                                htmlFor="simple-select"
                                                className={classes.selectLabel}>
                                                <span>Conteúdo: <small>(obrigatório)</small></span>
                                              </InputLabel>

                                              <Select
                                                MenuProps={{ className: classes.selectMenu }}
                                                classes={{ select: classes.select }}
                                                value={conteudo}
                                                onChange={(event) => setConteudo(event.target.value)}
                                                inputProps={{ name: "simpleSelect", id: "simple-select" }}>
                                                {
                                                  conteudos.map((conteudo, key) => (
                                                    <MenuItem
                                                      classes={{ root: classes.selectMenuItem, selected: classes.selectMenuItemSelected }}
                                                      value={conteudo.id}
                                                      key={key}>
                                                      {`${conteudo.assunto}`}
                                                    </MenuItem>))
                                                }
                                              </Select>
                                            </FormControl>
                                          </div>
                                        </GridItem>
                                      </GridContainer>
                                    </GridItem>
                                },
                                {
                                  title: "Filtros",
                                  content:
                                    <GridItem md={12}>
                                      <GridContainer>
                                        <GridItem md={12}>
                                          {/* Cliente */}
                                          <GridItem xs={12}>
                                            <FormControl fullWidth>
                                              <p>Não notificar os Clientes: </p>
                                              <Autocomplete
                                                autoComplete
                                                multiple
                                                open={open}
                                                onOpen={() => setOpen(true)}
                                                onClose={() => setOpen(false)}
                                                getOptionSelected={(option, value) => option.name === value.name}
                                                getOptionLabel={option => option.name}
                                                options={clientes}
                                                loading={loading}
                                                value={clientesSelecionados}
                                                onChange={(event, value) => setClientesSelecionados(value)}
                                                onInputChange={(event, value, reason) => handleSearch(value, 'cliente')}
                                                renderInput={params => (
                                                  <TextField
                                                    {...params}
                                                    fullWidth
                                                    variant="outlined"
                                                    InputProps={{
                                                      ...params.InputProps,
                                                      endAdornment: (
                                                        <React.Fragment>
                                                          {
                                                            loading
                                                              ? <CircularProgress color="inherit" size={20} />
                                                              : null
                                                          }
                                                          {params.InputProps.endAdornment}
                                                        </React.Fragment>
                                                      ),
                                                    }}
                                                  />
                                                )}
                                              />
                                            </FormControl>
                                          </GridItem>

                                          {/* Cobrança */}
                                          <GridItem xs={12}>
                                            <FormControl fullWidth>
                                              <p>Cobranças que devem realizar notificação: </p>
                                              <Autocomplete
                                                autoComplete
                                                multiple
                                                open={openCobranca}
                                                onOpen={() => setOpenCobranca(true)}
                                                onClose={() => setOpenCobranca(false)}
                                                getOptionSelected={(option, value) => option.name === value.name}
                                                getOptionLabel={option => option.name}
                                                options={cobrancas}
                                                loading={loadingCobranca}
                                                value={cobrancasSelecionadas}
                                                onChange={(event, value) => setCobrancasSelecionadas(value)}
                                                onInputChange={(event, value, reason) => handleSearch(value, 'cobranca')}
                                                renderInput={params => (
                                                  <TextField
                                                    {...params}
                                                    fullWidth
                                                    variant="outlined"
                                                    InputProps={{
                                                      ...params.InputProps,
                                                      endAdornment: (
                                                        <React.Fragment>
                                                          {
                                                            loadingCobranca
                                                              ? <CircularProgress color="inherit" size={20} />
                                                              : null
                                                          }
                                                          {params.InputProps.endAdornment}
                                                        </React.Fragment>
                                                      ),
                                                    }}
                                                  />
                                                )}
                                              />
                                            </FormControl>
                                          </GridItem>

                                          {/* Filial */}
                                          <GridItem xs={12}>
                                            <FormControl fullWidth>
                                              <p>Filiais que devem realizar notificação: </p>
                                              <Autocomplete
                                                autoComplete
                                                multiple
                                                open={openFilial}
                                                onOpen={() => setOpenFilial(true)}
                                                onClose={() => setOpenFilial(false)}
                                                getOptionSelected={(option, value) => option.name === value.name}
                                                getOptionLabel={option => option.name}
                                                options={filiais}
                                                loading={loadingFilial}
                                                value={filiaisSelecionadas}
                                                onChange={(event, value) => setFiliaisSelecionadas(value)}
                                                onInputChange={(event, value, reason) => handleSearch(value, 'filial')}
                                                renderInput={params => (
                                                  <TextField
                                                    {...params}
                                                    fullWidth
                                                    variant="outlined"
                                                    InputProps={{
                                                      ...params.InputProps,
                                                      endAdornment: (
                                                        <React.Fragment>
                                                          {
                                                            loadingFilial
                                                              ? <CircularProgress color="inherit" size={20} />
                                                              : null
                                                          }
                                                          {params.InputProps.endAdornment}
                                                        </React.Fragment>
                                                      ),
                                                    }}
                                                  />
                                                )}
                                              />
                                            </FormControl>
                                          </GridItem>
                                        </GridItem>
                                      </GridContainer>
                                    </GridItem>
                                }
                              ]} />
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                    )
                  }
                ]}
              />
            </GridItem>
          </GridContainer>

        </DialogContent>
        <DialogActions className={classes.modalFooter + " " + classes.modalFooterCenter}>
          <Button onClick={() => onSave()} color="success">Salvar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
