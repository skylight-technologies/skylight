var express     = require('express');
var bodyParser  = require('body-parser');
var bcrypt      = require('bcryptjs');
var VerifyToken = require('../auth/VerifyToken');

var router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var User = require('../models/User');

// CREATES A NEW USER
router.post('/', function (req, res) {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.create({
            name     : req.body.name,
            email    : req.body.email,
            password : hashedPassword, 
            userid   : req.body.userid,
            staffid  : req.body.staffid,
            scopes   : req.body.scopes
        }, 
        function (err, user) {
            if (err) return res.status(500).send(err);
            res.status(200).send(user);
        });
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', VerifyToken, function (req, res) {
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

// DELETES A USER FROM THE DATABASE
router.delete('/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User: "+ user.name +" was deleted.");
    });
});

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id', function (req, res) {

    User.findOne({_id:req.params.id},function(err, user) {
      if (err) {res.send(err);} else {
        if (!user) {res.statusCode = 400;res.send('Not found')
        } else {   
            if(req.body.name)  {user.name           = req.body.name;}
            if(req.body.email) {user.email          = req.body.email;}
            if(req.body.password) {
                var hashedPassword = bcrypt.hashSync(req.body.password, 8);
                user.password      = hashedPassword;
            }
            if(req.body.staffid) {user.staffid = req.body.staffid;}
            if(req.body.scopes)  {user.scopes  = req.body.scopes;}
          
            user.save(function (err, user) {
                if (err) {res.send(err);} else {
                    res.json(user);
                }
            });
        }
      }
    });  
    /*
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
    */
});


module.exports = router;