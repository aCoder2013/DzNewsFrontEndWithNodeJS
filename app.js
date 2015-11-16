var express = require("express");
var app  = express();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
var http = require('http');
var router = require('./router.js');


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/static'));
app.use('/',router);


var server = app.listen(3000, function () {
  console.log('DzNewsWithNodeJS is on port : %s', port);
});
