const HTTPStatus = require('http-status');

exports.raiseRequestError = function (res, returnData) {
    res.status(HTTPStatus.BAD_REQUEST).send(returnData);
}

exports.errorHandler =  function () {
    // Useing production errors handler
//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';
    //Error handlers & middlewares
    if (!isProduction) {
        app.use((err, req, res) => {
            res.status(err.status || 500);

            res.json({
                errors: {
                    message: err.message,
                    error: err,
                },
            });
        });
    }

    app.use((err, req, res) => {
        res.status(err.status || 500);

        res.json({
            errors: {
                message: err.message,
                error: {},
            },
        });
    });
}
