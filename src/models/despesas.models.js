const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const despesas = new Schema({
    valor: { type: Number },
    uid: { type: String },
    descricao: { type: String },
    fixa: { type: Boolean },
    status: { type: String },
    conta: { type: String },
    contaId: { type: String },
    categoria: { type: String },
    dataVencimento: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('despesas', despesas);
