const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const despesasCC = new Schema({
    valor: { type: String },
    uid: { type: String },
    descricao: { type: String },
    fixa: { type: Boolean },
    conta: { type: String },
    categoria: { type: String },
    dataVencimento: { type: Date },
    repetir: { type: Number },
    periodo: { type: String },
    idCartao: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('despesasCC', despesasCC);
