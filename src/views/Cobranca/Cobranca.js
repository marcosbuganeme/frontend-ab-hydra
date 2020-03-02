import React from 'react';
import Wizard from 'components/Wizard/Wizard.js';
import GridContainer from 'components/Grid/GridContainer.js';
import GridItem from 'components/Grid/GridItem.js';

import Step1 from './CobrancaSteps/Step1/Step1.js';
import Step2 from './CobrancaSteps/Step2/Step2.js';
import Step3 from './CobrancaSteps/Step3/Step3.js';
import Step4 from './CobrancaSteps/Step4/Step4.js';

export default function Parametro() {
  return (
    <GridContainer justify='center'>
      <GridItem xs={12} sm={8}>
        <Wizard
          validate
          steps={[
            { stepName: 'Conteúdo', stepComponent: Step1, stepId: 'conteudo' },
            { stepName: 'Notificação', stepComponent: Step2, stepId: 'notificacao' },
            { stepName: 'Configuração', stepComponent: Step3, stepId: 'configuracao' },
            { stepName: 'Logs', stepComponent: Step4, stepId: 'logs' }
          ]}
          title='Notificação Cobrança'
          previousButtonText='Voltar'
          nextButtonText='Próximo'
          subtitle='Parametrização de notificações automáticas'
          showFinishButton={false}
          finishButtonClick={e => alert(JSON.stringify(e))}
        />
      </GridItem>
    </GridContainer>
  );
}
