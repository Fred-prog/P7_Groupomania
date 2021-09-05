'use strict';

module.exports = (sequelize, DataTypes) => {

  let comment = sequelize.define( 'comment', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    alert: DataTypes.INTEGER,
    deletedAt: DataTypes.DATE
  }, {
    underscored: false,
    freezeTableName: true, // Freeze du nom de la table
    paranoid: true, // Ajout du soft delete (Sequelize ajoute deleted_at)

  });
  comment.associate = function(models) {
    // associations can be defined here
    comment.belongsTo(models.user, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      onDelete:'CASCADE',
    })
    
    comment.belongsTo(models.post, {
      foreignKey: {
        name: 'postId',
        allowNull: false
      },
      onDelete:'CASCADE',
    })
  };
  return comment;
};