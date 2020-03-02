/*eslint-disable*/
const dadosRelatorioEntregaFornecedor = [
  {
    filial: {
      codigo: "1A",
      razaoSocial: "goiás secos e molhados"
    },
    capacidade: {
      diaSemana: "seg",
      capacidadeTotalPorDiaSemana: 33,
      batida: {
        totalRealBatidaResfriadaPorDiaSemana: 4,
        totalRealBatidaCongeladaPorDiaSemana: 4,
        totalRealBatidaSecaPorDiaSemana: 4,
        totalDeCargaBatida: 12
      },
      paletizada: {
        totalRealPaletizadaResfriadaPorDiaSemana: 4,
        totalRealPaletizadaCongeladaPorDiaSemana: 4,
        totalRealPaletizadaSecaPorDiaSemana: 4,
        totalCargaPaletizada: 12
      }
    }
  }
]

const dadosTipoCarga = { capacidade: 'CAPACIDADE', batida: 'BATIDA', paletizada: 'PALETIZADA' }
const dadosSemana = {
  0: () => 'DOM',
  1: () => 'SEG',
  2: () => 'TER',
  3: () => 'QUA',
  4: () => 'QUI',
  5: () => 'SEX',
  6: () => 'SAB'
}
const dadosDiasDaSemana = [...Array(7)].map((_, i) => i)
const dadosConfiguracao = {
  filial: {
    codigo: '',
    razaoSocial: ''
  },
  batida: {
    resfriado: [
      {
        tonelada: 0, diaSemana: 'dom'
      },
      {
        tonelada: 0, diaSemana: 'seg'
      },
      {
        tonelada: 0, diaSemana: 'ter'
      },
      {
        tonelada: 0, diaSemana: 'qua'
      },
      {
        tonelada: 0, diaSemana: 'qui'
      },
      {
        tonelada: 0, diaSemana: 'sex'
      },
      {
        tonelada: 0, diaSemana: 'sab'
      }
    ],
    congelado: [
      {
        tonelada: 0, diaSemana: 'dom'
      },
      {
        tonelada: 0, diaSemana: 'seg'
      },
      {
        tonelada: 0, diaSemana: 'ter'
      },
      {
        tonelada: 0, diaSemana: 'qua'
      },
      {
        tonelada: 0, diaSemana: 'qui'
      },
      {
        tonelada: 0, diaSemana: 'sex'
      },
      {
        tonelada: 0, diaSemana: 'sab'
      }
    ],
    seco: [
      {
        tonelada: 0, diaSemana: 'dom'
      },
      {
        tonelada: 0, diaSemana: 'seg'
      },
      {
        tonelada: 0, diaSemana: 'ter'
      },
      {
        tonelada: 0, diaSemana: 'qua'
      },
      {
        tonelada: 0, diaSemana: 'qui'
      },
      {
        tonelada: 0, diaSemana: 'sex'
      },
      {
        tonelada: 0, diaSemana: 'sab'
      }
    ]
  },
  paletizada: {
    resfriado: [
      {
        tonelada: 0, diaSemana: 'dom'
      },
      {
        tonelada: 0, diaSemana: 'seg'
      },
      {
        tonelada: 0, diaSemana: 'ter'
      },
      {
        tonelada: 0, diaSemana: 'qua'
      },
      {
        tonelada: 0, diaSemana: 'qui'
      },
      {
        tonelada: 0, diaSemana: 'sex'
      },
      {
        tonelada: 0, diaSemana: 'sab'
      }
    ],
    congelado: [
      {
        tonelada: 0, diaSemana: 'dom'
      },
      {
        tonelada: 0, diaSemana: 'seg'
      },
      {
        tonelada: 0, diaSemana: 'ter'
      },
      {
        tonelada: 0, diaSemana: 'qua'
      },
      {
        tonelada: 0, diaSemana: 'qui'
      },
      {
        tonelada: 0, diaSemana: 'sex'
      },
      {
        tonelada: 0, diaSemana: 'sab'
      }
    ],
    seco: [
      {
        tonelada: 0, diaSemana: 'dom'
      },
      {
        tonelada: 0, diaSemana: 'seg'
      },
      {
        tonelada: 0, diaSemana: 'ter'
      },
      {
        tonelada: 0, diaSemana: 'qua'
      },
      {
        tonelada: 0, diaSemana: 'qui'
      },
      {
        tonelada: 0, diaSemana: 'sex'
      },
      {
        tonelada: 0, diaSemana: 'sab'
      }
    ]
  },
  capacidades: [
    {
      tonelada: 0, diaSemana: 'dom'
    },
    {
      tonelada: 0, diaSemana: 'seg'
    },
    {
      tonelada: 0, diaSemana: 'ter'
    },
    {
      tonelada: 0, diaSemana: 'qua'
    },
    {
      tonelada: 0, diaSemana: 'qui'
    },
    {
      tonelada: 0, diaSemana: 'sex'
    },
    {
      tonelada: 0, diaSemana: 'sab'
    }
  ]
};

const dadosCliente = [
  { valor: '', macro: '${NOME_CLIENTE}', banco: 'PCCLIENT.CLIENTE' },
  { valor: '', macro: '${ENDERECO_COBRANCA}', banco: 'PCCLIENT.ENDERCOB' },
  { valor: '', macro: '${BAIRRO_COBRANCA}', banco: 'PCCLIENT.BAIRROCOB' },
  { valor: '', macro: '${CEP_COBRANCA}', banco: 'PCCLIENT.CEPCOB' },
  { valor: '', macro: '${TELEFONE_COBRANCA}', banco: 'PCCLIENT.TELCOB' },
  { valor: '', macro: '${MUNICIPIO_COBRANCA}', banco: 'PCCLIENT.MUNICCOB' },
  { valor: '', macro: '${IE_CLIENTE}', banco: 'PCCLIENT.' }

];

const dadosEmpresa = [
  { valor: '', macro: '${RAZAO_SOCIAL_FILIAL}', banco: 'PCFILIAL.RAZAOSOCIAL' },
  { valor: '', macro: '${CGC_FILIAL}', banco: 'PCFILIAL.CGC' },
  { valor: '', macro: '${ENDERECO_FILIAL}', banco: 'PCFILIAL.ENDERECO' },
  { valor: '', macro: '${BAIRRO_FILIAL}', banco: 'PCFILIAL.BAIRRO' },
  { valor: '', macro: '${CIDADE_FILIAL}', banco: 'PCFILIAL.CIDADE' },
  { valor: '', macro: '${UF_FILIAL}', banco: 'PCFILIAL.UF' },
  { valor: '', macro: '${CEP_FILIAL}', banco: 'PCFILIAL.CEP' },
  { valor: '', macro: '${IE_FILIAL}', banco: 'PCFILIAL.' },
  { valor: '', macro: '${TELEFONE_FILIAL}', banco: 'PCFILIAL.' },
  { valor: '', macro: '${NUMERO_FILIAL}', banco: 'PCFILIAL.' },
];

const dadosTitulo = [
  { valor: '', macro: '${NUMERO_TITULO}', banco: 'PCPREST.DUPLIC' },
  { valor: '', macro: '${VALOR_TITULO}', banco: 'PCPREST.VALOR' },
  { valor: '', macro: '${DATA_VENCIMENTO_TITULO}', banco: 'PCPREST.DTVENC' },
  { valor: '', macro: '${CODIGO_BARRAS}', banco: 'PCPREST.CODBARRA' },
  { valor: '', macro: '${OBSERVACAO_TITULO}', banco: 'PCPREST.' },
  { valor: '', macro: '${CODIGO_CLIENTE_TITULO}', banco: 'PCPREST.' },
  { valor: '', macro: '${CODIGO_RCA_TITULO}', banco: 'PCPREST.' },
  { valor: '', macro: '${PRESTACAO_TITULO}', banco: 'PCPREST.' },
  { valor: '', macro: '${CODIGO_COBRANCA_TITULO}', banco: 'PCPREST.' },
  { valor: '', macro: '${NUMERO_TRANSACAO_TITULO}', banco: 'PCPREST.' },
  { valor: '', macro: '${DATA_RECEBIMENTO_PREVISTO_TITULO}', banco: 'PCPREST.' },
  { valor: '', macro: '${JUROS_TITULO}', banco: 'PCPREST.' },
  { valor: '', macro: '${VALOR_DOCUMENTO_TITULO}', banco: 'PCPREST.' },
  { valor: '', macro: '${STATUS_TITULO}', banco: 'PCPREST.' }
];

const dadosNotificacao = [
  { alerta: '5 dias antes', assunto: 'Mensagem Cadastrada 1' },
  { alerta: '2 dias antes', assunto: 'Mensagem Cadastrada 2' },
  { alerta: '6 dias antes', assunto: 'Mensagem Cadastrada 3' },
  { alerta: '7 dias antes', assunto: 'Mensagem Cadastrada 4' },
  { alerta: '8 dias antes', assunto: 'Mensagem Cadastrada 5' },
  { alerta: '15 dias antes', assunto: 'Mensagem Cadastrada 6' },
  { alerta: '25 dias antes', assunto: 'Mensagem Cadastrada 7' },
  { alerta: '10 dias antes', assunto: 'Mensagem Cadastrada 8' }
];

const dadosConteudo = [
  {
    id: 1,
    assunto: 'Assunto 1',
    mensagem: 'Conteudo 1',
    SMS: '',
    WHATSAPP: ''
  },
  {
    id: 2,
    assunto: 'Assunto 2',
    mensagem: 'Conteudo 2',
    SMS: '',
    WHATSAPP: ''
  },
  {
    id: 3,
    assunto: 'Assunto 3',
    mensagem: 'Conteudo 3',
    SMS: '',
    WHATSAPP: ''
  },
  {
    id: 4,
    assunto: 'Assunto 4',
    mensagem: 'Conteudo 4',
    SMS: '',
    WHATSAPP: ''
  },
  {
    id: 5,
    assunto: 'Assunto 5',
    mensagem: 'Conteudo 5',
    SMS: '',
    WHATSAPP: ''
  },
];

export {
  dadosRelatorioEntregaFornecedor,
  dadosCliente,
  dadosEmpresa,
  dadosTitulo,
  dadosNotificacao,
  dadosConteudo,
  dadosConfiguracao,
  dadosDiasDaSemana,
  dadosSemana,
  dadosTipoCarga
};
