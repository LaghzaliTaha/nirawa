var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan      = require('morgan');
var adminRoutes = require('./routes/admin'),
    userRoutes  = require('./routes/user');
var db = require('./models/db');
var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
/*********/
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});
/*********/
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views/'));
//app.use(express.static(__dirname + '/views/nirawa'));
app.use('/admin', adminRoutes);
app.use('/nirawa', userRoutes);
/******index*****/
app.get('/',function(req,res){
  res.redirect('/nirawa');
})
/*******end******/

app.listen(port);
console.log("Serveur running on port 8080");
