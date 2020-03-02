import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import SweetAlert from "react-bootstrap-sweetalert";

import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";

import styles from "assets/jss/material-dashboard-pro-react/components/customTabsStyle.js";

const useStyles = makeStyles(styles);

export default function CustomTabs(props) {
  const { headerColor, plainTabs, tabs, title, rtlActive, tabChange, setHasChange } = props;

  const [value, setValue] = React.useState(0);
  const [alert, setAlert] = React.useState(null);

  const classes = useStyles();
  const cardTitle = classNames({ [classes.cardTitle]: true, [classes.cardTitleRTL]: rtlActive });

  const openAlert = (value) => {
    setAlert(
      <SweetAlert
        danger
        style={{ display: "block", marginTop: "-100px", color: '#000000' }}
        showCancel={true}
        confirmBtnText={'Confirmar'}
        cancelBtnText={'Cancelar'}
        onConfirm={() => {
          setAlert(null);
          setValue(value);
          setHasChange(false);
        }}
        onCancel={() => setAlert(null)}
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
        Deseja cancelar as alterações ?
      </SweetAlert>);
  }

  const handleChange = (event, value) => {
    if (tabChange !== undefined && tabChange(value)) openAlert(value)
    else setValue(value)
  };

  return (
    <Card plain={plainTabs}>
      <CardHeader color={headerColor} plain={plainTabs}>
        {title !== undefined ? <div className={cardTitle}>{title}</div> : null}
        <div>{alert}</div>
        <Tabs
          value={value}
          onChange={handleChange}
          classes={{
            root: classes.tabsRoot,
            indicator: classes.displayNone
          }}
        >
          {tabs.map((prop, key) => {
            var icon = {};
            if (prop.tabIcon) {
              icon = {
                icon: <prop.tabIcon />
              };
            }
            return (
              <Tab
                classes={{
                  root: classes.tabRootButton,
                  selected: classes.tabSelected,
                  wrapper: classes.tabWrapper
                }}
                key={key}
                label={prop.tabName}
                {...icon}
              />
            );
          })}
        </Tabs>
      </CardHeader>
      <CardBody>
        {tabs.map((prop, key) => {
          if (key === value) {
            return <div key={key}>{prop.tabContent}</div>;
          }
          return null;
        })}
      </CardBody>
    </Card>
  );
}

CustomTabs.propTypes = {
  headerColor: PropTypes.oneOf([
    "warning",
    "success",
    "danger",
    "info",
    "primary",
    "rose"
  ]),
  title: PropTypes.string,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      tabName: PropTypes.string.isRequired,
      tabIcon: PropTypes.object,
      tabContent: PropTypes.node.isRequired
    })
  ),
  rtlActive: PropTypes.bool,
  plainTabs: PropTypes.bool
};
