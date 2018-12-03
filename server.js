const body_parser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const server_configs = require('./configs/server-configs');
const setup_passport_strategies = require('./passport-strategies');
//const returnHandller = require('./utils/response_Helper');

mongoose.Promise = Promise;

 

var app = express();


//if (!isProduction) {
  //  app.use(returnHandller.errorHandler());
//}


app.use(cors());
app.use(body_parser.json());
app.use(body_parser.urlencoded({
    extended: true
}));

setup_passport_strategies();

var controller_setup_function_list = [
    require('./controllers/security_controller'),
    require('./controllers/test_controller'),
];

// process.on('uncaughtException', function(err) {
//     console.log('Caught exception: ' + err);
//   });

app.listen(server_configs.port, () => {
    console.log("Fly server running on port %d.", server_configs.port);
    mongoose.connect(server_configs.db.uri, (err) => {
        if (err) {
            console.log("There was an error connecting to the database.");
            console.log(err);
        }
        else {
            controller_setup_function_list.forEach((controller_setup_function) => {
                controller_setup_function(app);
            });
        }
    })
});