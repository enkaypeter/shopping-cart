'use strict';

const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
const basename  = path.basename(__filename);
const config    =  require("../config");
const { database } = config;
const db = {};

const sequelize = new Sequelize(database.name, database.username, database.password, {
  dialect: 'mysql',
  host: database.host,
  port: database.port
});

fs
  .readdirSync(process.cwd()+"/src/db/models")
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(process.cwd()+"/src/db/models", file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;