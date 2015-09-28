var express = require('express'),

  apiRoutes = express.Router(),
	bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  ejwt = require('express-jwt');
  apiRoutes.use(function(req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
      next();
  });
  apiRoutes.use(express.static(__dirname + '/views/admin'));
  apiRoutes.get('/', function(req, res) {
    res.render("index")
  });
//apiRoutes.set('superSecret','tecdev');


var secretToken = 'aMdoeb5ed87zorRdkD6greDML81DcnrzeSD648ferFejmplx';
var user = require('../models/administrators');
var Admin = mongoose.model('Administrator');
/**************update*********/
apiRoutes.post('/update',ejwt({secret: secretToken}),function(req, res) {
Admin.findOne({
   email_or_phone: req.body.email
 }, function(err, user) {
   if (err) throw err;
   if (!user) {
     res.json(1);
   } else if (user) {
     if (user.password != req.body.password) {
       res.json(0);
     } else {
       Admin.findById(user.id,function(err,userss){
       userss.update({
         email_or_phone: req.body.email,
         password: req.body.password,
         last_name : req.body.lastname,
         first_name: req.body.firstname
       },function(err,userID){
         if (err){
           res.send("There was a problem updating the information to the database"+err);
       }else{
           res.sendStatus(200);
       }
     })
   });
     }
   }
 });
 });
/********end-update*********/
/********logout***********/
apiRoutes.get('/logout'/*,ejwt({secret: secretToken})*/,function(req, res) {
  console.log(req.user);
  delete req.user;
  return res.send(200);
});
/********end logout *******/
/*************login*************/
apiRoutes.post('/login', function(req, res) {
Admin.findOne({
      email_or_phone: req.body.username
    }, function(err, user) {
      if (err) throw err;
      if (!user) {
        //res.json('no user');
        res.json(1);
      } else if (user) {
        
        if(req.body.password != user.password){
        res.json(0);
        //res.json('no pass');
        } else {
          var token = jwt.sign({id: user.email_or_phone,Admin:true},secretToken, { expiresInMinutes: 1 });
			    return res.json({token:token});
        }
      }
    });
  });
/***********end-login***********/
/**********get for update*******/
apiRoutes.get('/update/:id', function(req, res) {
    console.log(req.params.id);
    Admin.findOne({
          email_or_phone: req.params.id
        }, function(err, user) {
          if (err) throw err;
          if (user) {
              return res.json({ email_or_phone: user.email_or_phone , first_name: user.first_name ,last_name: user.last_name });
          }
        });
});
/******end get for update ******/
module.exports = apiRoutes;
