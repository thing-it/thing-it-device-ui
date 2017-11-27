var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use( express.static('.'));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers",
        "accept, origin, content-type, cookie, X-Requested-With, X-HTTP-Method-Override, Authorization, client-token");
    res.header("Access-Control-Allow-Credentials", true);
    //res.header('Access-Control-Allow-Credentials', false);
    //res.header('Access-Control-Max-Age', '86400');

    if (req.method === 'OPTIONS') {
        // Fulfills pre-flight/promise request

        res.sendStatus(200);
    } else {
        next();
    }
});
app.use(bodyParser.json());
app.post("/portal/login",
    function (req, res) {
        console.log('=> login', req.body);
        res.send(req.body);
    });
app.listen(3333, function () {
    console.log('Demo server listening on port 3333.');
});