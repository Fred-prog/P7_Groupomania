// Imports
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils')
let models = require('../models')
const { Op } = require("sequelize");
const fs = require('fs');

// Constants Regex
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;

// middlewares
exports.signup = async (req, res, next) => {
    console.log("Voir la requete body signup: ", req.body);
    //Params
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    
    // verify pseudo length, email regex, password etc.
    
    if (email == null || username == null || password == null) {
        return res.status(400).json({ 'error': 'paramètre vide' });
    }

    if (username.length >= 13 || username.lenth <= 4) {
        return res.status(400).json({ 'error': 'le nom d utilisateur doit avoir entre 5 et 12 caractère' })
    }

    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ 'error': 'email is not valid' })
    }

    if (!PASSWORD_REGEX.test(password)) {
        return res.status(400).json({ 'error': 'le mot de passe doit comporter entre 4 - 8 caractère et 1 nombre' })
    }

    console.log("voir donnée entrée",req.body )
    try {
        
        const userFound = await models.user.findOne({
            where: { email: email }
        })
        console.log("apres le try email");
        if (userFound) {
            return res.status(400).json({ 'error': 'Adresse mail dejà utilisée' })
        } else {
            try {
                const usernameFound = await models.user.findOne({
                    attributes: ['username'],
                    where: {username: username }
                })
                if (usernameFound) {
                    return res.status(400).json({ 'error': 'Username dejà utilisé' })
                } else {
                    console.log(req.body.password);
                    bcrypt.hash(req.body.password, 10, function(err, hash) {
                        if (err){
                            return res.status(400).json({error: 'erreur cryptage'})
                        }
                        console.log(hash);
                        models.user.create({
                        email: email,
                        username: username,
                        password: hash,
                        moderator: 0 })
                        .then(() => {
                            return res.status(201).json({ message: 'user created'})
                        })
                        .catch(function(err) {
                            return res.status(500).json({ 'error': 'cannot create user' })
                        })
                    })
                }
                
            } catch (error) {
                return res.status(500).json({ 'error': 'error impossible de vérifer username' });
            }
        }
    } catch (error) {
         return res.status(500).json({ 'error': 'error impossible de vérifier adresse mail' });
    }
};

exports.login = async (req, res, next) => {
    console.log("voir les paramètre de login; ", req.body);
    //Params
    let email = req.body.email;
    let password = req.body.password;

    if (email == null || password == null) {
        return res.status(400).json({ 'error': 'missing parameters for login' });
    }

    try {
        const userFound = await models.user.findOne({
            where: { email: email }
        })
        if (userFound) {

            bcrypt.compare(password, userFound.password, function (err, resHash) {
                if (resHash) {
                    return res.status(200).json({
                        'userId': userFound.id,
                        'token': jwtUtils.generateTokenForUser(userFound)
                    });
                } else {
                    return res.status(400).json({ 'error': 'MOT DE PASSE INVALIDE' })
                }
            })
    
        } else {
            return res.status(400).json({ 'error': 'Utilisateur inconnu !' });
        }
    
    } catch (error) {
        return res.status(500).json({ 'error': 'DB error ' });
    }
};


exports.getAccount = async (req, res) => {
    try {
        const user = await models.user.findOne({
            where: { id: req.params.id },
            attributes: ['id', 'username', 'avatar', 'moderator'],
        })
        res.status(200).send(user)
    } catch (error) {
        return res.status(500).send({ error: "Erreur serveur" });
    }
};


exports.getAllUsers = async (req, res) => {
    // renvoi tous les utilisateur sauf le modérateur
    try {
        const users = await models.user.findAll({
            attributes: ["username", "id", "avatar", "email", "moderator"],
            where: {
                moderator: {
                  [Op.ne]: 1,
                },
              },
        })
        res.status(200).send(users)
    } catch (error) {
        return res.status(500).send({ error: "Erreur serveur" });
    }
};

exports.updateAccount = async (req, res) => {
    console.log("voir REQ PARAMS: ", req.params);
    console.log("voir username:", req.body.username);
    // modifier le profil
    console.log("avant try");
    try {
      const userId = req.params.id;
      let newAvatar;
      let user = await models.user.findOne({ where: { id: userId } }); // on trouve le user
      console.log("User trouver");
      if (userId == user.id) {
          console.log("condition userID");
        if (req.file && user.avatar) {
            console.log("condition req file");
            newAvatar = `${req.protocol}://${req.get("host")}/upload/${
            req.file.filename
          }`;
          console.log("milieu condition req file");
          const filename = user.avatar.split("/upload")[1];
          console.log("condition apres split");
          fs.unlink(`upload/${filename}`, (err) => {
            // s'il y avait déjà une photo on la supprime
            console.log("condition dans le unlink");
            if (err) console.log(err);
             else {
                console.log("fin condition req file");
              console.log(`Deleted file: upload/${filename}`);
            }
          });
        } else if (req.file) {
            newAvatar = `${req.protocol}://${req.get("host")}/upload/${
            req.file.filename
          }`;
        }
        if (newAvatar) {
          user.avatar = newAvatar;
        }

        if (req.body.username) {
          user.username = req.body.username;
        }
        const updateUser = await user.save({ fields: ["username", "avatar"] }); // on sauvegarde les changements dans la bdd
        res.status(200).json({
          user: updateUser,
          messageRetour: "Votre profil a bien été modifié",
        });
      } else {
        res
          .status(400)
          .json({ messageRetour: "Vous n'avez pas les droits requis" });
      }
    } catch (error) {
      return res.status(500).send({ error: "Erreur serveur" });
    }
};




//supression de compte

exports.deleteAccount = async (req,res) => {
    try {
        console.log("dans la controller delete");
        const verifModerator = await models.user.findOne({ 
            attributes: ["moderator"],
                where: {
                    moderator: {
                      [Op.eq]: 1,
                    },
                  },
                })
        const id = req.params.id;
        const user = await models.user.findOne({ where: {id: id } });
        if (user.id = id || verifModerator.moderator == 1 ) {
            if (user.avatar !== null) {
                const filename = user.avatar.split("/upload")[1];
                fs.unlink(`upload/${filename}`, () => {
                    //SI AVATAR SUPPRESSION
                    models.user.destroy({ where: {id: id} })
                    res.status(200).json({ messageRetour: "utilisateur supprimé" });
                });
            } else {
                models.user.destroy({ where: { id: id } });
                res.status(200).json({ messageRetour: "utilisateur supprimé" });
            }
        } else {
            res.status(400).json({ message: "Vous n'avez pas les droits requis" }); 
        }
    } catch (error) {
        return res.status(500).send({ error: "Erreur serveur" });
    }
};

