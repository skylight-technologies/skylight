var express     = require('express');
var bodyParser  = require('body-parser');
var jwt         = require('jsonwebtoken');
var bcrypt      = require('bcryptjs');
var config      = require('../config');
var VerifyToken = require('./VerifyToken');

var User       = require('../models/User');

var router = express.Router();
router.use(bodyParser.urlencoded({ extended : false }));
router.use(bodyParser.json());

router.post('/register',function(req,res){
	var hashedPassword = bcrypt.hashSync(req.body.password, 8);

	User.create({
			//id       : req.body.id,
			name     : req.body.name,
			email    : req.body.email,
			password : hashedPassword, 
			staffid  : req.body.staffid,
			scopes   : req.body.scopes
		},
		function(err,user){
			if(err) return res.status(500).send("There was a problem registering the user.")
			
			// create a token
			var token = jwt.sign(
				{id : user._id}, 
				config.secret, 
				{expiresIn: 86400}				
			);	

			res.status(200).send({ auth : true, token : token });

		}
	);

});

router.get('/me', VerifyToken, function(req,res){
	User.findById(
		req.userid, 
		{ password : 0 }, // don't lookup password field
		function(err,user){
			if(err) return res.status(500).send("There was a problem finding the user.");

			if(!user) return res.status(404).send("No user found.");

			res.status(200).send(user);
			
		}
	);

});


router.post('/login', function(req,res){
	User.findOne({ email : req.body.email }, function(err, user){
		if(err) return res.status(500).send('Error on the server');
		if(!user) return res.status(404).send({ auth : false, token : null });

		var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		if (!passwordIsValid) return res.status(401).send({ auth : false, token : null });

		var token = jwt.sign({ id : user._id }, config.secret, { expiresIn: 85400 });

		res.status(200).send({ auth : true, token : token });
	});
});

router.get('/logout', function(req, res){
	res.status(200).send({ auth : false, token : null });
});

module.exports = router;