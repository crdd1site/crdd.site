import { usuarios } from './model/Models.js';

class Validador {
    static ValidarLogin = (res, req) => {
        const valor = JSON.parse(req.params.login)
        console.log(valor)
        usuarios.find(valor, (err, usuarios) => {
            let dado = JSON.stringify(usuarios)
            if(!err) {
                if(dado !== '[]') {
                    res.status(200).json(usuarios)
                } else {
                    res.status(400).send({message: 400})
                }
            } else {
                console.log("aqui")
                res.status(500).send({message: 500})
            }
        })
    }
}