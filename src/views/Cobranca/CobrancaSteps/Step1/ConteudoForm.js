import React from 'react';
import ReactTable from "react-table";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Close from "@material-ui/icons/Close";
import InputAdornment from "@material-ui/core/InputAdornment";
import SubjectIcon from '@material-ui/icons/Subject';
import Tooltip from '@material-ui/core/Tooltip';
import FileCopy from "@material-ui/icons/FileCopy";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import AddAlert from "@material-ui/icons/AddAlert";

import CustomTabs from "components/CustomTabs/CustomTabs.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Accordion from "components/Accordion/Accordion.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import FilialAssinaturaList from './FilialAssinaturaList.js';
import FilialLogoList from './FilialLogoList.js';
import { dadosCliente, dadosEmpresa, dadosTitulo } from "variables/general.js";
import styles from "assets/jss/material-dashboard-pro-react/modalStyle.js";

const useStyles = makeStyles(styles);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const columnType = [
  {
    Header: "",
    accessor: "actions",
    sortable: false,
    filterable: false,
    width: 55
  },
  {
    Header: <div style={{ float: 'left' }}><b>Macros</b></div>,
    accessor: "name",
    sortable: false,
    filterable: false
  }
];

export default function ConteudoForm(props) {
  const classes = useStyles();
  const [title, setTitle] = React.useState(props.title);
  const [modal, setModal] = React.useState(props.modal);
  const [assunto, setAssunto] = React.useState({
    id: null,
    assunto: '',
    mensagem: React.useState(EditorState.createEmpty()),
    enviarAssinatura: false,
    geraPdf: false
  });

  const [teste, setTeste] = React.useState(EditorState.createEmpty());

  const [activePage, setActivePage] = React.useState(0);
  // eslint-disable-next-line
  const [hasChange, setHasChange] = React.useState(false);
  const [tc, setTC] = React.useState(false);
  const [errors, setErrors] = React.useState('');

  React.useEffect(() => {
    setAssunto({
      id: props.assunto.id,
      assunto: props.assunto.assunto,
      mensagem: EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(props.assunto.mensagem))),
      enviarAssinatura: props.assunto.enviarAssinatura,
      geraPdf: props.assunto.geraPdf
    })
    setTitle(props.title)
    setModal(props.modal)
  }, [props]);

  const callbackModalAction = (arg, data) => {
    setModal(arg);
    props.modalAction(arg, data ? data : null);
  }

  const onClose = () => {
    setModal(false);
    props.modalAction(false, null);
  }

  const onSave = () => {
    const a = `${draftToHtml(convertToRaw(assunto.mensagem.getCurrentContent()))}`;
    const b = `${draftToHtml(convertToRaw(teste.getCurrentContent()))}`;
    const msg = a.length > 8 && b.length === 8 ? a : b;
    const data = { ...assunto, mensagem: msg };

    let errors = '';
    if (!data.assunto) errors = errors.concat('assunto');
    if (!(data.mensagem.length > 8)) errors = errors.concat('conteudo');
    if (errors) return callNotification(`Favor preencher os campos corretamente antes de salvar.`);

    callbackModalAction(false, data);
  }

  const callNotification = msg => {
    setErrors(msg);
    setTC(true);

    setTimeout(() => {
      setTC(false);
      setErrors('');
    }, 6000);

    return;
  }

  const uploadImageCallBack = (file) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://api.imgur.com/3/image');
      xhr.setRequestHeader('Authorization', 'Client-ID 8d26ccd12712fca');
      const data = new FormData();
      data.append('image', file);
      xhr.send(data);
      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      });
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    });
  }

  const handleEditorChange = value => {
    if (false) getStringDifference(getPlainText(), value.getCurrentContent().getPlainText());
    setTeste(value);
    setAssunto({ ...assunto, mensagem: value });
  }

  const getPlainText = () => assunto.mensagem.getCurrentContent().getPlainText();

  const getStringDifference = (oldString, newString) => {
    let i = 0;
    let j = 0;
    let result = "";

    while (j < newString.length) {
      if (oldString[i] !== newString[j] || i === oldString.length)
        result += newString[j];
      else
        i++;
      j++;
    }
    return result;
  }

  const handleTabChange = (e) => {
    setActivePage(e);
    return false;
  }

  const tableAction = (props) => (
    <div>
      <Tooltip
        id="tooltip-top"
        title="Copiar"
        placement="top"
        classes={{ tooltip: classes.tooltip }}>
        <Button color="info" justIcon onClick={() => { navigator.clipboard.writeText(props.macro) }}>
          <FileCopy />
        </Button>
      </Tooltip>
    </div>
  )

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
        onClose={() => onClose()}
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
            onClick={() => onClose()}>
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
                tabChange={handleTabChange.bind(this)}
                setHasChange={setHasChange}
                tabs={[
                  {
                    tabName: "Conteúdo",
                    tabContent: (
                      <GridItem md={12}>
                        <GridContainer>
                          <GridItem md={9}>
                            <CustomInput
                              id="assunto"
                              labelText={<span>Assunto: <small>(obrigatório)</small></span>}
                              formControlProps={{ fullWidth: true }}
                              inputProps={{
                                value: assunto.assunto,
                                onChange: event => setAssunto({ ...assunto, assunto: event.target.value }),
                                endAdornment: (
                                  <InputAdornment position="end" className={classes.inputAdornment}>
                                    <SubjectIcon className={classes.inputAdornmentIcon} />
                                  </InputAdornment>
                                )
                              }}
                            />
                          </GridItem>

                          <GridItem md={9}>
                            <Editor
                              editorState={assunto.mensagem}
                              wrapperClassName="home-wrapper"
                              editorClassName="home-editor"
                              toolbar={{
                                image: { uploadCallback: uploadImageCallBack, alt: { present: true }, previewImage: true }
                              }}
                              onEditorStateChange={handleEditorChange}
                            />
                          </GridItem>

                          <GridItem md={3}>
                            <Accordion
                              collapses={[
                                {
                                  title: "Dados Cliente",
                                  content:
                                    <GridItem md={12}>
                                      <ReactTable
                                        data={
                                          dadosCliente.map(props => ({
                                            id: props.macro,
                                            name: props.macro,
                                            actions: tableAction(props)
                                          }))
                                        }
                                        columns={columnType}
                                        defaultPageSize={dadosCliente.length}
                                        showPagination={false}
                                        className="-striped -highlight"
                                      />
                                    </GridItem>
                                },
                                {
                                  title: "Dados Empresa",
                                  content:
                                    <GridItem md={12}>
                                      <ReactTable
                                        data={
                                          dadosEmpresa.map(props => ({
                                            id: props.macro,
                                            name: props.macro,
                                            actions: tableAction(props)
                                          }))
                                        }
                                        columns={columnType}
                                        defaultPageSize={dadosEmpresa.length}
                                        showPagination={false}
                                        className="-striped -highlight"
                                      />
                                    </GridItem>
                                },
                                {
                                  title: "Dados Título",
                                  content:
                                    <GridItem md={12}>
                                      <ReactTable
                                        data={
                                          dadosTitulo.map(props => ({
                                            id: props.macro,
                                            name: props.macro,
                                            actions: tableAction(props)
                                          }))
                                        }
                                        columns={columnType}
                                        defaultPageSize={dadosTitulo.length}
                                        showPagination={false}
                                        className="-striped -highlight"
                                      />
                                    </GridItem>
                                }
                              ]} />
                          </GridItem>

                          {
                            false ?
                              <GridItem md={9}>
                                <p>Visualização:</p>
                                <textarea style={{ width: '100%', height: '100%' }}
                                  disabled
                                  value={draftToHtml(convertToRaw(teste.getCurrentContent()))} />
                              </GridItem> : null
                          }

                          <GridItem md={12}>
                            <div>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={assunto.enviarAssinatura}
                                    onChange={event => setAssunto({ ...assunto, enviarAssinatura: event.target.checked })}
                                    value="enviarAssinatura"
                                    classes={{
                                      switchBase: classes.switchBase,
                                      checked: classes.switchChecked,
                                      thumb: classes.switchIcon,
                                      track: classes.switchBar
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Enviar Assinatura ?" />
                            </div>
                          </GridItem>

                          <GridItem md={12}>
                            <div>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={assunto.geraPdf}
                                    onChange={event => setAssunto({ ...assunto, geraPdf: event.target.checked })}
                                    value="geraPdf"
                                    classes={{
                                      switchBase: classes.switchBase,
                                      checked: classes.switchChecked,
                                      thumb: classes.switchIcon,
                                      track: classes.switchBar
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Gerar PDF ?" />
                            </div>
                          </GridItem>

                        </GridContainer>
                      </GridItem>
                    )
                  },
                  {
                    tabName: "Assinaturas",
                    tabContent: (
                      <div>
                        <GridItem md={12} style={{ marginTop: '5px' }}>
                          <FilialAssinaturaList setHasChange={setHasChange} />
                        </GridItem>
                      </div>
                    )
                  },
                  {
                    tabName: "Logos",
                    tabContent: (
                      <div>
                        <GridItem md={12} style={{ marginTop: '5px' }}>
                          <FilialLogoList setHasChange={setHasChange} />
                        </GridItem>
                      </div>
                    )
                  }
                ]}
              />
            </GridItem>
          </GridContainer>

        </DialogContent>

        <DialogActions className={classes.modalFooter + " " + classes.modalFooterCenter}>
          {activePage === 0 ? (<Button onClick={() => onSave()} color="success">Salvar</Button>) : null}
        </DialogActions>
      </Dialog>
    </div>
  );
}
