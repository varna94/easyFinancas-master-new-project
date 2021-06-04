const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recursos = new Schema({
    uid: { type: String },
    saldo: { type: String },
    conta: { type: String },
    contaId: { type: String },
    descricao: { type: String },
    recebido: { type: Boolean },
    tipo: { type: String },
    receitaFixa: { type: Boolean },
    repetir: { type: Number },
    periodo: { type: String },
    dataRecebimento: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('recursos', recursos);
