var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27002/stmw-auth');
mongoose.connect('mongodb://localhost:27001/auth', { useMongoClient: true })
//mongoose.connect('mongodb://stmwadmin:s23s05t89-SST@cluster0-shard-00-00-2vreg.mongodb.net:27017,cluster0-shard-00-01-2vreg.mongodb.net:27017,cluster0-shard-00-02-2vreg.mongodb.net:27017/stmw-auth?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true', { useMongoClient: true })