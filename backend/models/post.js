'use strict';

module.exports = (sequelize, DataTypes) => {

  let post = sequelize.define('post', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    mediaUrl: DataTypes.STRING,
    alert: DataTypes.INTEGER,
    likes: DataTypes.INTEGER,
    dislikes: DataTypes.INTEGER,
    user_liked: DataTypes.STRING,
    user_disliked: DataTypes.STRING,
    deletedAt: DataTypes.DATE
  }, {
    underscored: false,
    freezeTableName: true, // Freeze du nom de la table
    paranoid: true, // Ajout du soft delete (Sequelize ajoute deleted_at)
  })
  post.associate = function(models) {
    // associations can be defined here
    post.belongsTo(models.user, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      onDelete:'CASCADE',
    })
    post.hasMany(models.comment);
  };
  return post;
};