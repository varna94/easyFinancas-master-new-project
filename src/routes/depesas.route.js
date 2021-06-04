const express = require('express');
const app = express();
const desepesasRoute = express.Router();

// Despesas model
let Despesas = require('../models/despesas.models');
var table;

// Add, GET, UPDATE, DELETE Despesas
desepesasRoute.route('/despesas').post((req, res, next) => {
    Despesas.create(req.body, (error, data) => {
        if (error) {
            return next(error)
        } else {
            console.log(req.body);
            res.json(data)
        }
    })
});


desepesasRoute.route('/despesas').get((req, res) => {
    Despesas.find((error, data) => {
        if (error) {
            return next(error)
        } else {
            console.log('retorno get id');
            res.json(data)
        }
    })
})


desepesasRoute.route('/despesas/:id').get((req, res) => {
    Despesas.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error)
        } else {
            console.log('retorno get id');
            res.json(data)
        }
    })
})


desepesasRoute.route('/despesas/:id').put((req, res, next) => {
    Despesas.findByIdAndUpdate(req.params.id, {
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

desepesasRoute.route('/despesas/:id').delete((req, res, next) => {
    Despesas.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

module.exports = desepesasRoute;