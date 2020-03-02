import React from 'react';
import Wizard from 'components/Wizard/Wizard.js';
import GridContainer from 'components/Grid/GridContainer.js';
import GridItem from 'components/Grid/GridItem.js';

import Step1 from './LimiteSteps/Step1/Step1.js';
import Step2 from './LimiteSteps/Step2/Step2.js';
import Step3 from './LimiteSteps/Step3/Step3.js';

export default function Limite() {
  return (
    <GridContainer justify='center'>
      <GridItem xs={12} sm={8}>
        <Wizard
          validate
          steps={[
            { stepName: 'Configuração básica', stepComponent: Step1, stepId: 'configuracao' },
            { stepName: 'Faixas de acréscimo de limite', stepComponent: Step2, stepId: 'faixas' },
            { stepName: 'Logs', stepComponent: Step3, stepId: 'logs' }
          ]}
          title='Upgrade de limite de crédito'
          previousButtonText='Voltar'
          nextButtonText='Próximo'
          subtitle='Configuração e logs'
          showFinishButton={false}
          finishButtonClick={e => alert(JSON.stringify(e))}
        />
      </GridItem>
    </GridContainer>
  );
}
