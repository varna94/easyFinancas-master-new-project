const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartoes = new Schema({
    uid: { type: String },
    nome: { type: String },
    bandeira: { type: String },
    banco: { type: String },
    limite: { type: String },
    dataFechamentoFatura: { type: Date },
    dataVencimentoFatura: { type: Date },
    descricao: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('cartoes', cartoes);
