const HTTPStatus = require('http-status');

module.exports = (req, res, next) => {
    if (req.user.subscription.end_date < Date.now){
        res.status(HTTPStatus.PAYMENT_REQUIRED).send("Payment Required.");
    }
    else{
        next();
    }
}