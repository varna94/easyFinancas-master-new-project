const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const contas = new Schema({
    uid: { type: String },
    nome: { type: String },
    banco: { type: String },
    saldo: { type: String },
    totalDespesas: { type: Number },
    tipo: { type: String },
    descricao: { type: String }
}, { timestamps: true })

module.exports = mongoose.model('conta', contas);
