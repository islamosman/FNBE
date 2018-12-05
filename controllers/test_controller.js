const bcrypt = require('bcrypt-nodejs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const HTTPStatus = require('http-status');
const _ = require('lodash');
const TestModel = require('../models/testModel');

module.exports = (app) => {
    app.post('/test', (req, res, next) => {
        var newObj = new TestModel();
        newObj.param1 = req.query.rvalue;
       
        TestModel.deleteOne().then(data => {
        newObj.save().then(data2=>{
            TestModel.findOne().then(data=>{
                res.status(HTTPStatus.OK).send(data.param1);
            });

        })    
        });


    });

    app.get('/test', (req, res, next) => {
        TestModel.findOne().select('param1').then(data => {
            res.status(HTTPStatus.OK).send(data.param1);
        });
    });

    app.get('/SetDatatest', (req, res, next) => {
        var newObj = new TestModel();
        newObj.param1 = req.query.rvalue;
       
        TestModel.deleteOne().then(data => {
        newObj.save().then(data2=>{
            TestModel.findOne().then(data=>{
                res.status(HTTPStatus.OK).send(data.param1);
            });

        })    
        });

    });
}