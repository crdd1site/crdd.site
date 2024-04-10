import mongoose from "mongoose";

//ver com diego se o despachante auxiliar tem GRT 
//ver com diego se cada tipo de usuario tera uma tabela separada assim segmentando as informações e simplificando as ações no banco
//  --  colocar um select no login para o usuario selecionar qual tipo de usuario ele é assim automatizando o login.

const grtSchema = mongoose.Schema({
    nome: {type: String},
    id: {type: String},
    data: String,
    hora: String,
    valor: {type: Number},
    quantidade: {type: Number},
    situacao: {type: String, default: 'SOLICITADO'},
    dataUso: {type: String, default: ''},
    usadoPor: {type: String, default: ''},
});

export const grt = mongoose.model('grt', grtSchema);

// const usuarioTipoSchema = mongoose.Schema({
//     tipo: {type: String},
//     codigo: {type: String},
//     descricao: {type: String},
//     usuario_id: {type: String},
// });

// export const tipoUsuario = mongoose.model('tipoUsuario', usuarioTipoSchema);

const usuarioSituacaoSchema = mongoose.Schema({
    situação: {type: String, require: true}, 
    codigo: {type: String, require: true},
    descricao: {type: String, require: true},
    usuarioId: {type: String},
})

export const situacaoUsuario = mongoose.model('situacaoUsuario', usuarioSituacaoSchema);

const usuarioLogin = mongoose.Schema({
    login: {type: String, require: true, unique: true},
    senha: {type: String, require: true},
    nome: {type: String, require: true},
    ultimologin: {type: String, default: ''},
    id: {type: String, require: true, unique: true},
});

export const loginUsuario = mongoose.model('loginUsuario', usuarioLogin);

const documentoGrtSchema = mongoose.Schema({
    id: Number,
    GRT: {type: String, unique: true},
    despachante_id: String,
    estado: {type: String, default: "DISPONIVEL"},
})
export const documentoGRT = mongoose.model("documentoGRT", documentoGrtSchema)

const usuarioSchema = mongoose.Schema({
    id: String,
    nome: {type: String},
    rg: {type: String},
    cpf: {type: String},
    nCrddrs: {type: String},
    email: {type: String},
    tel: {type: String},
    cep: {type: String},
    logradouro: {type: String},
    numero: {type: String},
    complemento: String,
    bairro: {type: String},
    cidade: {type: String},
    uf: {type: String},
    usuariotipo: String,
    pai: {type: String},
    Documento_GRT: {documentoGrtSchema},
    situacao: {type: String, default: 'ativo'},
    dataCriacao: {type: Date, default: Date.now},
    dataUltimaAtualizacao: {type: Date, default: Date.now},
});

export const usuarios = mongoose.model('usuarios', usuarioSchema);

const cadastradoPorSchema = mongoose.Schema({
    id: String,
    nome: String,
    Data: {type: Date, default: Date.now}
});

export const cadastradoPor = mongoose.model("cadastradoPor", cadastradoPorSchema)


const servicoSolicidatoSchema = mongoose.Schema({
    id: String,
    nome: String,
    Data: String,
    servico: {type: String, default: 'Nenhum'}
});

const veiculoSchema = mongoose.Schema({
    veiculo: {type: String},
    placa: {type: String},
    modelo: {type: String},
    chassi: {type: String},
    proprietario: {type: String},
    motor: {type: String},
    fabricante: {type: String},
    especieVeiculo: {type: String},
    corVeiculo: {type: String},
    combustivel: {type: String},
    cilindrada: {type: String},
    anoFabricacao: {type: String},
    anoModelo: {type: String},
    municipio: {type: String},
    uf: {type: String},
    tipoVeiculo: {type: String},
    potencia: {type: String},
    passageiroMax: {type: String},
    dataCriacao: {type: Date, default: Date.now},
    dataAtualizacao: {type: String},
    cadastradoPor: cadastradoPorSchema,
    situacaoServico: {type: String, default: 'NÃO SOLICITADO'},
    situacao: {type: String, default: 'CADASTRADO'},
    grtUtilizada: {type: String, default: "NÃO VINCULADO"},
    servicoSolicitado: servicoSolicidatoSchema
});

export const veiculo = mongoose.model('veiculo', veiculoSchema);

const cadastroServicoSchema = mongoose.Schema({
    id: Number,
    nome: String,
    rg: String,
    cpg: String,
    telefone: String,
    placa: String,
    chassi: String,
    servico: String,
    servicoPlaca: String,
    servicoLacre: String,
    servicoOutros: String,
    restricaoFinanceira: String,
    restricao: String,
    credor: String,
    agente: String,
    utilizarEndereco: String,
    alteraEndereco: String,
    telefoneProprietario: String,
    emailProprietario: String,
    autorizacao: String,
    municipio: String,
    dia: String,
    mes: String,
    ano: String,
    grtUtilizada: {type: String, default: "NÃO VINCULADO"}
})

export const cadastroServico = mongoose.model('cadastroServico', cadastroServicoSchema)

const clienteShema = mongoose.Schema({
    id: Number,
    nome: String,
    rgOuCnpj: String,
    endereco: String,
    utilizaEndereco: String,
    celular: String,
    email: String,
    restricaoFinanceira: String,
    restricao: String,
    agenteFinanceiro: String,
    segundaVia: String,
    segundaViaMotivo: String,
    alteraEndereco: String,
    novoEndereco: String,
    novoenderecoCEP: String,
    alteraInfoProprietario: String,
    alteraInfoVeiculo: String,
    alteraInfoFinanceira: String,
    alteraInfoEnderecoEntrega: String,
    novoEnderecoLogra: String,
    novoEnderecoNum: String,
    novoEnderecoBairro: String,
    novoEnderecoCidade: String,
    novoEnderecoUF: String,
    novoEnderecoCEP: String,
    correcaoRestricoes: String,
    emissaoDCPPO: String,
    fornecimentoPlacaExperienciaFabricante: String,
    inclusaoRestricaoFinanceria: String,
    liberacaoAverbacaoExecucao: String,
    liberacaoRestricaoFinanceira: String,
    licencaEspecialTransito: String,
    mudancaPlacaUnica: String,
    primeiroEmplacamento: String,
    renovacaoPlacaExperienciaFabricante: String,
    reservaPlaca: String,
    restricaoTransferencia: String,
    solicitacaoAlteracaoCaracteristicas: String,
    solicitacaoRegravacaoChassi: String,
    solicitacaoTransporteEscolar: String,
    alteracaoExecucao: String,
    baixaPlacaExperienciaFabricante: String,
    baixaOutraUF: String,
    baixaVeiculo: String,
    baixaVeiculoCampo: String,
    cancelamentoProcesso: String,
    colocacaoLacrePlaca: String,
    comunicacaoVenda: String,
    correcaoObservacoes: String,
    correcaoChassi: String,
    correcaoInformacoesProprietario: String,
    correcaoInformacoesVeiculo: String,
    correcaoMunicipio: String,
    autorizoEmailTelefone: String,
    naoAutorizoInformacoes: String,
    solicitaCertidao: String,
    solicitaCopiaDocumento: String,
    solicitaCopiaCRLV: String,
    solicitaVistoria: String,
    solicitaDCPPO: String,
    transferePropriedadeVeiculoOutro: String,
    transferePropriedadeVeiculoRS: String,
    trocaMunicipioOutroEstado: String,
    trocaMunicipioRS: String,
    Outros: String,
    campoOutros: String,
    relativoVeiculo: String,
    relativoChassiOuPlaca: String,
    data: String,
})

export const cliente = mongoose.model('cliente', clienteShema);