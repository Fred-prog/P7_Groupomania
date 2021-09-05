'use strict';

module.exports = function(sequelize, DataTypes) {

  let user = sequelize.define('user', {
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    avatar: DataTypes.STRING,
    password: DataTypes.STRING,
    moderator: DataTypes.BOOLEAN,
    deletedAt: DataTypes.DATE
  }, {
    underscored: false,
    freezeTableName: true, // Freeze du nom de la table
    paranoid: true, // Ajout du soft delete (Sequelize ajoute deleted_at)

  });
  return user;
};