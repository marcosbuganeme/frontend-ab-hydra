import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { makeStyles } from "@material-ui/core/styles"
import FormControl from "@material-ui/core/FormControl"
import MenuItem from "@material-ui/core/MenuItem"
import Select from "@material-ui/core/Select"
import CircularProgress from '@material-ui/core/CircularProgress'

import If from '../If/If'

import styles from "assets/jss/material-dashboard-pro-react/customSelectStyle.js"

const useStyles = makeStyles(styles)

export default function FilialAutoComplete(props) {
  const classes = useStyles()
  const { title, callBackHandleFilialChange, reset } = props

  const [loading, setLoading] = useState(true)
  const [filiais, setFiliais] = useState([])
  const [filial, setFilial] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      await axios.get(`/winthor/filiais/todas`)
        .then(response => setFiliais(response.data.result))
      setLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    setFilial('')
  }, [reset])

  const handleFilialChange = ({ data }) => {
    const filial = filiais.filter(filial => filial.codigo === data).shift()

    if (filial !== undefined) {
      setFilial(data)
      callBackHandleFilialChange({ data: filial })
    } else {
      setFilial('')
      callBackHandleFilialChange({ data: '' })
    }
  }

  return (
    <FormControl fullWidth>
      <p>{title}</p>

      <If test={loading}>
        <div style={{ float: 'left', position: 'relative', left: '0%' }}>
          <CircularProgress color="inherit" size={50} />
        </div>
      </If>

      <If test={!loading}>
        <Select
          MenuProps={{ className: classes.selectMenu }}
          classes={{ select: classes.select }}
          value={filial}
          onChange={(event) => handleFilialChange({ data: event.target.value })}
          inputProps={{ name: "simpleSelect", id: "simple-select" }}>

          <MenuItem
            classes={{ root: classes.selectMenuItem, selected: classes.selectMenuItemSelected }}
            key={'Nenhum'}>
            Nenhum
          </MenuItem>

          {filiais.map(filial => (
            <MenuItem
              classes={{ root: classes.selectMenuItem, selected: classes.selectMenuItemSelected }}
              value={filial.codigo}
              key={filial.codigo}>
              {`${filial.codigo} - ${filial.razaoSocial}`}
            </MenuItem>))}
        </Select>
      </If>
    </FormControl>
  )
}
