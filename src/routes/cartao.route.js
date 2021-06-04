const express = require('express');
const app = express();
const cartoesRoute = express.Router();

// cartoes model
let CartaoCC = require('../models/cartoes.models');
var table;

// Add, GET, UPDATE, DELETE cartoes
cartoesRoute.route('/cartoes').post((req, res, next) => {
    CartaoCC.create(req.body, (error, data) => {
        if (error) {
            return next(error)
        } else {
            console.log(req.body);
            res.json(data)
        }
    })
});


cartoesRoute.route('/cartoes').get((req, res) => {
    CartaoCC.find((error, data) => {
        if (error) {
            return next(error)
        } else {
            console.log('retorno get id');
            res.json(data)
        }
    })
})


cartoesRoute.route('/cartoes/:id').get((req, res) => {
    CartaoCC.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error)
        } else {
            console.log('retorno get id');
            res.json(data)
        }
    })
})


cartoesRoute.route('/cartoes/:id').put((req, res, next) => {
    CartaoCC.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error);
            console.log(error)
        } else {
            res.json(data)
            console.log('cartoes successfully updated!')
        }
    })
})

cartoesRoute.route('/cartoes/:id').delete((req, res, next) => {
    CartaoCC.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

module.exports = cartoesRoute;