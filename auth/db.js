var mongoose = require('mongoose');
mongoose.connect('mongodb://auth:auth@localhost:27017/auth', { useMongoClient: true })