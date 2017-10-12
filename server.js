var express = require('express');
var app = express();

app.use( express.static('.'));
app.listen(3333, function () {
    console.log('Demo server listening on port 3333.');
});