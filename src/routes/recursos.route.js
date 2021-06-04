const express = require('express');
const app = express();
const recursosRoute = express.Router();

// contas model
let Recursos = require('../models/recursos.models');
var table;

// Add, GET, UPDATE, DELETE contas
recursosRoute.route('/recursos').post((req, res, next) => {
    Recursos.create(req.body, (error, data) => {
        if (error) {
            return next(error)
        } else {
            console.log(req.body);
            res.json(data)
        }
    })
});


recursosRoute.route('/recursos').get((req, res) => {
    Recursos.find((error, data) => {
        if (error) {
            return next(error)
        } else {
            console.log('retorno get id');
            res.json(data)
        }
    })
})


recursosRoute.route('/recursos/:id').get((req, res) => {
    Recursos.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error)
        } else {
            console.log('retorno get id');
            res.json(data)
        }
    })
})


recursosRoute.route('/recursos/:id').put((req, res, next) => {
    Recursos.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error);
            console.log(error)
        } else {
            res.json(data)
            console.log('contas successfully updated!')
        }
    })
})

recursosRoute.route('/recursos/:id').delete((req, res, next) => {
    Recursos.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

module.exports = recursosRoute;