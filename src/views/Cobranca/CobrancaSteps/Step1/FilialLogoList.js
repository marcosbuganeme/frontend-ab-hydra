import React from 'react';
import axios from 'axios'
import _ from 'lodash';
import ReactTable from "react-table";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from '@material-ui/core/Tooltip';
import GridItem from "components/Grid/GridItem.js";
import ImageUpload from "components/CustomUpload/ImageUpload.js";
import Accordion from "components/Accordion/Accordion.js";
import styles from "assets/jss/material-dashboard-pro-react/modalStyle.js";

const useStyles = makeStyles(styles);
const columnType = [
  {
    Header: <div style={{ float: 'left' }}><b>Filial</b></div>,
    accessor: "codigoFilial",
    sortable: false,
    filterable: false,
    width: 80,
    Cell: row => <div><b>{row.value}</b></div>
  },
  {
    Header: <div style={{ float: 'left', position: 'relative', left: '50%' }}><b>Logo</b></div>,
    accessor: "actions",
    sortable: false,
    filterable: false
  }
];
const url = `/cobranca/arquivos/logo`;
export default function FilialLogoList(props) {
  const classes = useStyles();

  const { setHasChange } = props;

  const [filiaisLogo, setFiliaisLogo] = React.useState([]);
  const [tableLoading, setTableLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setTableLoading(true);
      let result1 = (await axios.get(url)).data.result.map(value => ({ ...value, codigoFilial: value.codigoFilial }));
      let result2 = (await axios.get(`/winthor/filiais/todas`)).data.result.map(value => ({ codigoFilial: value.codigo, urlDownload: '' }));

      setFiliaisLogo(_.union(result1, _.differenceBy(result2, result1, 'codigoFilial')));
      setTableLoading(false);
    };
    fetchData();
  }, []);

  const handleImageUpload = (arg) => setHasChange(arg);

  const tableAction = (props) => (
    <div style={{ float: 'left', position: 'relative', left: '44%' }}>
      <Tooltip
        id="tooltip-top"
        title="Logo"
        placement="top"
        classes={{ tooltip: classes.tooltip }}>
        <ImageUpload
          handleImageUpload={handleImageUpload.bind(this)}
          avatar={props.urlDownload}
          filial={props.codigoFilial}
          url={'/arquivos/logo'}
          maxHeight={100000}
          maxWidth={100000} />
      </Tooltip>
    </div>
  );

  return (
    <div>
      <Accordion
        active={0}
        collapses={[
          {
            title: "Filiais",
            content:
              <GridItem md={12}>
                <ReactTable
                  data={filiaisLogo.map(props => ({ ...props, actions: tableAction(props) }))}
                  columns={columnType}
                  filterable
                  nextText={'Próximo'}
                  previousText={'Voltar'}
                  rowsText={'Logos'}
                  pageText={'Página'}
                  ofText={'de'}
                  noDataText={''}
                  defaultPageSize={15}
                  showPaginationTop
                  showPaginationBottom={false}
                  loading={tableLoading}
                  className="-striped -highlight" />
              </GridItem>
          }
        ]} />
    </div>
  );
}
