const express = require('express');
const app = express();
const desepesasCCRoute = express.Router();

// Despesas model
let DespesasCC = require('../models/despesasCC.models');
var table;

// Add, GET, UPDATE, DELETE Despesas
desepesasCCRoute.route('/depesaCC').post((req, res, next) => {
    DespesasCC.create(req.body, (error, data) => {
        if (error) {
            return next(error)
        } else {
            console.log(req.body);
            res.json(data)
        }
    })
});


desepesasCCRoute.route('/depesaCC').get((req, res) => {
    DespesasCC.find((error, data) => {
        if (error) {
            return next(error)
        } else {
            console.log('retorno get id');
            res.json(data)
        }
    })
})


desepesasCCRoute.route('/depesaCC/:id').get((req, res) => {
    DespesasCC.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error)
        } else {
            console.log('retorno get id');
            res.json(data)
        }
    })
})


desepesasCCRoute.route('/depesaCC/:id').put((req, res, next) => {
    DespesasCC.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error);
            console.log(error)
        } else {
            res.json(data)
            console.log('Despesas successfully updated!')
        }
    })
})

desepesasCCRoute.route('/depesaCC/:id').delete((req, res, next) => {
    DespesasCC.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

module.exports = desepesasCCRoute;
