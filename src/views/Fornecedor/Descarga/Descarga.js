import React from 'react'
import CustomTabs from 'components/CustomTabs/CustomTabs.js'
import GridContainer from 'components/Grid/GridContainer.js'
import GridItem from 'components/Grid/GridItem.js'
import Configuracao from './Configuracao/Configuracao'
import Acompanhamento from './Acompanhamento/Acompanhamento'
import Relatorio from './Relatorio/Relatorio'

export default () => {
  return (
    <GridContainer>
      <GridItem md={12}>
        <CustomTabs
          headerColor='primary'
          tabs={[
            { tabName: 'Configuração', tabContent: (<Configuracao />) },
            { tabName: 'Acompanhamento', tabContent: (<Acompanhamento />) },
            { tabName: 'Relatórios', tabContent: (<Relatorio />) }
          ]}
        />
      </GridItem>
    </GridContainer>
  )
}
