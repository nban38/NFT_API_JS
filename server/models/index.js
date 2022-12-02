'use strict';
const Sequelize = require('sequelize');
const config = require('../config/dbconfig');
const db = {};

const sequelize = new Sequelize(
    config.development.database,
    config.development.username,
    config.development.password,
    {
        host : config.development.host,
        dialect : config.development.dialect
    }
);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.userModel = require("./userModel")(sequelize, Sequelize);
db.nftModel = require("./nftModel")(sequelize, Sequelize);
db.offerModel = require('./offerModel')(sequelize, Sequelize);
db.dealModel = require('./dealModel')(sequelize, Sequelize);
db.collectionModel = require('./collectionModel')(sequelize, Sequelize);
db.owner = require('./ownerModel')(sequelize, Sequelize);
db.tokenModel = require('./tokenModel')(sequelize, Sequelize);

module.exports = db;