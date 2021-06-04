const express = require('express');
const app = express();
const contasRoute = express.Router();

// Contas model
let Contas = require('../models/contas.models');
var table;

// Add, GET, UPDATE, DELETE contas
contasRoute.route('/contas').post((req, res, next) => {
    Contas.create(req.body, (error, data) => {
        if (error) {
            return next(error)
        } else {
            console.log(req.body);
            res.json(data)
        }
    })
});

contasRoute.route('/contas').get((req, res) => {
    Contas.find((error, data) => {
        if (error) {
            return next(error)
        } else {
            console.log('retorno get id');
            res.json(data)
        }
    })
})

contasRoute.route('/contas/:id').get((req, res) => {
    Contas.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error)
        } else {
            console.log('retorno get id');
            res.json(data)
        }
    })
})

contasRoute.route('/contas/:id').put((req, res, next) => {
    Contas.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error);
            console.log(error)
        } else {
            res.json(data)
            console.log('Contas successfully updated!')
        }
    })
})

contasRoute.route('/contas/:id').delete((req, res, next) => {
    Contas.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

module.exports = contasRoute;