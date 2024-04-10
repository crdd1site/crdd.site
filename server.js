import db from "./config/dbconnect.js";
import express from 'express';
import cors from 'cors';
import { cadastroServico, cliente, documentoGRT, grt, loginUsuario, usuarios, veiculo } from "./model/Models.js";
import toJson from "xml2json";
import axios from "axios"


const app = express();

db.on('error', console.log.bind(console, 'erro de conexão'))
db.once('open', () => {
    console.log('Conexão com o banco realizada com sucesso!')
})

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Server Online!')
})

app.post('/Login', (req, res) => {
    // console.log(req.body)
    let login = req.body.login
    let senha = req.body.senha
    let time = { ultimologin: new Date().toLocaleString() }
    let query = loginUsuario.findOneAndUpdate({}, time)
    query.where('login').equals(login)
    query.where('senha').equals(senha)
    query.exec((err, response) => {
        if (!err) {
            res.status(200).send(response)
        } else {
            // console.log(err)
            res.status(200).send(err)
        }
    })
})


app.get('/ValidaUsuario', (req, res) => {
    let login = req.query;
    loginUsuario.find(login, (err, response) => {
        if (!err) {
            if (response.length === 0) {
                res.status(200).json('valido')
            } else {
                res.status(200).json("invalido")
            }
        } else {
            // console.log(err)
        }
    })
})

app.get('/UserLoading', (req, res) => {
    let { usuario } = req.query;
    let query = usuarios.find({})
    query.where('id').equals(usuario.id)
    query.where('nome').equals(usuario.nome)
    query.exec((err, response) => {
        if (!err) {
            res.status(200).send(response)
        } else {
            // console.log('erro: ', err)
            res.status(200).send(err)
        }
    })
})

app.post('/Cadastro/Usuario', (req, res) => {
    var { dados } = req.body;
    // console.log(dados)
    usuarios.find((err, respo) => {
        if (!err) {
            dados['id'] = respo.length + 1;
            let user = new usuarios(dados)
            user.save(dados, (err, response) => {
                if (!err) {
                    // console.log(response)
                    let saveLogin = new loginUsuario(dados, response)
                    saveLogin.save((dados, response), (err, resp) => {
                        if (!err) {
                            return res.status(200).json(response, res, respo, resp)
                        } else {
                            return res.status(200).json(err)
                        }
                    })
                } else {
                    // console.log(err)
                    return res.status(200).json(err)
                }
            })
        } else {
            res.status(200).send(err)
        }
    });
})

app.get('/Usuario/Despachante', (req, res) => {
    const despachante = usuarios.find({})
    despachante.where('usuariotipo').equals("despachante")
    despachante.exec((err, response) => {
        if (!err) {
            res.status(200).json(response)
        } else {
            res.status(200).json(err)
        }
    })
})

app.post('/Usuario/Deletar', (req, res) => {
    usuarios.findByIdAndUpdate(req.body, { situacao: "inativo" }, (err, response) => {
        if (!err) {
            if (response.deletedCount === 0) {
                res.status(200).json(response)
            } else {
                res.status(200).json(response)
            }
        } else {
            res.status(200).json(err)
        }
    })

})

app.get('/Usuario/Detalhe/:id', (req, res) => {
    let id = req.params.id
    usuarios.findOne({ _id: id }, (err, response) => {
        if (!err) {
            res.status(200).json(response)
        } else {
            res.status(200).json(err)
        }
    })
})

app.get('/Usuario/Editar/:id', (req, res) => {
    let id = req.params.id
    usuarios.findOne({ _id: id }, (err, response) => {
        if (!err) {
            res.status(200).json(response)
        } else {
            res.status(200).json(err)
        }
    })
})

app.post('/Atualizar/Usuario', (req, res) => {
    let cadastro = req.body.dados
    let id = cadastro._id
    // console.log(cadastro, id)
    usuarios.updateOne({ _id: id }, cadastro, (err, response) => {
        if (!err) {
            // console.log("Foi", response)
            res.status(200).json(response)
        } else {
            // console.log("não")
            res.status(200).json(err)
        }
    })
})

app.get('/Usuarios/Listar', (req, res) => {
    let { user } = req.query
    // console.log('teste', user)
    if (user.usuariotipo === 'master') {
        // console.log(user.usuariotipo)
        let query = usuarios.find({})
        query.exec((err, response) => {
            if (!err) {
                // console.log('resposta: ', response, 'Fim resposta')
                return res.status(200).json(response)
            } else {
                return res.status(200).json(err)
            }
        })
    } else if (user.usuariotipo === 'administrador') {
        // console.log(user.usuariotipo)
        let query = usuarios.find({})
        query.where('usuariotipo').or([{ usuariotipo: 'despachante' }, { usuariotipo: 'preposto' }])
        query.exec((err, response) => {
            if (!err) {
                // console.log('resposta: ', response, 'Fim resposta')
                return res.status(200).json(response)
            } else {
                return res.status(200).json(err)
            }
        })
    } else if (user.usuariotipo === 'despachante') {
        // console.log(user.usuariotipo)
        let query = usuarios.find({})
        query.where('pai').equals(user.id)
        query.where('usuariotipo').equals('preposto')
        query.exec((err, response) => {
            if (!err) {
                // console.log('resposta: ', response, 'Fim resposta')
                res.status(200).json(response)
            } else {
                // console.log(err)
                return res.status(200).json(err)
            }
        })
    }
})

app.get('/Usuario/Listar/User=:id', (req, res) => {
    // console.log('Listando', req.params.id);
    let dado = req.params.id
    usuarios.find(
        {
            $or: [
                { nome: { $regex: new RegExp(`^${dado}$`, 'i') } },
                { usuariotipo: new RegExp(`^${dado}$`, 'i') },
                { cpf: dado },
                { rg: dado },
                { nCrddrs: { $regex: new RegExp(`^${dado}$`, 'i') } },
                { tel: dado },
                { email: dado },
                { cep: dado },
                { logradouro: new RegExp(`^${dado}$`, 'i') },
                { numero: dado },
                { bairro: new RegExp(`^${dado}$`, 'i') },
                { cidade: new RegExp(`^${dado}$`, 'i') },
                { uf: new RegExp(`^${dado}$`, 'i') },
                { complemento: new RegExp(`^${dado}$`, 'i') },
            ]
        }, (err, response) => {
            // console.log(response)
            if (!err) {
                res.status(200).json(response)
            } else {
                res.status(200).json(err)
            }
        })
})
app.get('/Usuario/Editar/:id', (req, res) => {
    let id = req.params.id
    usuarios.findOne({ _id: id }, (err, response) => {
        if (!err) {
            res.status(200).json(response)
        } else {
            res.status(200).json(err)
        }
    })
})

app.get('/Servicos', async (req, res) => {
    let { placa } = req.query;
    let url = 'http://consultas.consulcar.com.br/webservice/serach_agregados.php?serial=2AWBALR9ZTHCK4CC&placa=' + placa + '&tipo=1';
    const consulta = await axios.get(url)
    let resposta = pegaArquivo(consulta.data)
    if (resposta.RESPOSTA.BASE_AGREGADOS.situacao === true) {
        res.status(200).send(resposta.RESPOSTA.BASE_AGREGADOS)
    } else {
        res.status(200).send(resposta)
    }

    // res.send(pegaArquivo(consulta.data))
    // .then(res => {
    //     console.log(res)
    //     res.text()
    // })
    // .then(body => res.send(pegaArquivo(body)))
    // .catch(err => {
    //     // console.log(err)
    // })
})

app.get('/Servicos/Listar', (req, res) => {
    let { user } = req.query
    // console.log('teste', user)
    if (user.usuariotipo === 'master') {
        let query = veiculo.find({})
        query.exec((err, response) => {
            if (!err) {
                // console.log('resposta: ', response, 'Fim resposta')
                return res.status(200).json(response)
            } else {
                return res.status(200).json(err)
            }
        })
    } else if (user.usuariotipo === 'administrador') {
        let query = veiculo.find({})
        query.exec((err, response) => {
            if (!err) {
                // console.log('resposta: ', response, 'Fim resposta')
                return res.status(200).json(response)
            } else {
                return res.status(200).json(err)
            }
        })
    } else if (user.usuariotipo === 'despachante') {
        let query = veiculo.find({})
        query.where('pai').equals(user.id)
        query.exec((err, response) => {
            if (!err) {
                // console.log('resposta: ', response, 'Fim resposta')
                return res.status(200).json(response)
            } else {
                return res.status(200).json(err)
            }
        })
    } else if (user.usuariotipo === 'preposto') {
        let query = veiculo.find({})
        query.where('pai').equals(user.id)
        query.where('cadastradoPor.nome').equals(user.nome)
        query.exec((err, response) => {
            if (!err) {
                // console.log('resposta: ', response, 'Fim resposta')
                // console.log('preposto')
                return res.status(200).json(response)
            } else {
                // console.log('ops')
                return res.status(200).json(err)
            }
        })
    }
})

app.post('/Servicos/CadastrarVeiculo', (req, response) => {
    // console.log('teste', req.body.info)
    let query = new veiculo(req.body.info)
    query.save((err, res) => {
        if (!err) {
            // console.log(res)
            return response.status(200).send(res)
        } else {
            // console.log(err)
            return response.status(200).send(err)
        }
    })
})

app.post('/Servicos/CadastrarCliente', (req, res) => {
    // console.log(req.body.cadastro)
    const { cadastro } = req.body
    cliente.find({})
        .then(resposta => {
            cadastro['id'] = resposta.length + 1
            // console.log(cadastro)
            let query = new cliente(cadastro)
            query.save((err, response) => {
                if (!err) {
                    // console.log(response)
                    res.send(response)
                } else {
                    // console.log(err)
                    res.send(err)
                }
            })
        })
        .catch(erro => console.log(erro))
})

app.post('/Servicos/CadastrarServico', (req, response) => {
    // console.log(req.body.servico)
    const { servico } = req.body
    cadastroServico.find({})
        .then(resposta => {
            servico['id'] = resposta.length + 1
            // console.log(servico)
            let query = new cadastroServico(servico)
            query.save((err, res) => {
                if (!err) {
                    // console.log(res)
                    response.send(res)
                } else {
                    // console.log(err)
                    response.send(err)
                }
            })
        })
        .catch(erro => console.log(erro))
})

app.post("/Servico/GravaGrt", async (req, response) => {
    const { grt } = req.body
    const docx = documentoGRT.findOneAndUpdate({ GRT: grt }, { estado: "INDISPONIVEL" }) // contar grts
    const atu = await docx
    const servico = veiculo.findByIdAndUpdate(req.body.veiculo._id, { grtUtilizada: grt, situacaoServico: "SERVICO SOLICITADO" })
    const doc = await servico
    // console.log(doc, atu)
    response.status(200).send(doc)
})

app.post('/grt/solicitar', (req, response) => {
    // console.log("solicitando: ", req.body)
    const { nome, id } = req.body.loginUser;
    const { valor, quantidade, data, hora } = req.body.GRT
    // console.log(req.body)
    let query = new grt({ nome, id, valor, quantidade, data, hora })
    query.save((err, res) => {
        if (!err) {
            // console.log(res)
            response.status(200).send(res)
        } else {
            // console.log(res)
            response.status(200).send(err)
        }
    })
})

app.get('/grt/Listar', (req, res) => {
    let { user } = req.query
    // console.log('teste', user)
    if (user.usuariotipo === 'master') {
        let query = grt.find({})
        query.exec((err, response) => {
            if (!err) {
                // console.log(user.usuariotipo)
                // console.log('resposta: ', response, 'Fim resposta')
                return res.status(200).json(response)
            } else {
                // console.log(user.usuariotipo, "erro")
                return res.status(200).json(err)
            }
        })
    } else if (user.usuariotipo === 'administrador') {
        let query = grt.find({})
        query.exec((err, response) => {
            if (!err) {
                // console.log(user.usuariotipo)
                // console.log('resposta: ', response, 'Fim resposta')
                return res.status(200).json(response)
            } else {
                // console.log(user.usuariotipo, "erro")
                return res.status(200).json(err)
            }
        })
    } else if (user.usuariotipo === 'despachante') {
        let query = grt.find({})
        query.where('id').equals(user.id)
        query.exec((err, response) => {
            if (!err) {
                // console.log(user.usuariotipo)
                // console.log('resposta: ', response, 'Fim resposta')
                return res.status(200).json(response)
            } else {
                // console.log(user.usuariotipo, "erro")
                return res.status(200).json(err)
            }
        })
    }
})

app.post("/GerarGRT", async (req, res) => {
    const { row } = req.body
    const { grtTotal } = req.body.grt
    const despachante = usuarios.find({ nome: row.nome })//despachante que solicitou grt
    const doc = documentoGRT.find() // contar grts
    const atu = grt.findByIdAndUpdate(row, { situacao: "GRT ATIVA" })
    const documento = await despachante;
    const documentogrt = await doc
    const ativa = await atu
    const docs = []
    for (let x = 0; x !== row.quantidade; x++) {
        const gerargrt = new documentoGRT({ id: documentogrt.length + x, GRT: grtTotal[x], despachante_id: documento[0]._id })
        docs[x] = await gerargrt.save()
    }
    res.status(200).send({docs, ativa})
})

app.get("/GRT/Disponiveis", async (req, res) => {
    // console.log("Chego")
    let { nome } = req.query
    const despachant = usuarios.findOne({ nome: nome })
    const docx = await despachant
    //    console.log(docx._id)
    const doc = documentoGRT.find({ despachante_id: docx._id })
    doc.where('estado').equals('DISPONIVEL')
    const folha = await doc
       console.log(folha)
    return res.status(200).send(folha)
})

app.get("/GRT/Utilizaveis", async (req, res) => {
    let { user } = req.query
    // console.log(user)
    const GRT = documentoGRT.find({ despachante_id: user._id, estado: "DISPONIVEL" })
    const doc = await GRT
    // console.log(doc)
    return res.status(200).send(doc)
})


function pegaArquivo(body) {
    var dadoXML = body.indexOf('xml')
    if (dadoXML !== -1) {
        var xmlTOjson = toJson.toJson(body)//string xml to string JSON
        var jSON = JSON.parse(xmlTOjson)//string JSON to JSON
        return (jSON)
    } else {
        return (body)
    }
}

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;

