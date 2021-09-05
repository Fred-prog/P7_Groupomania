//importation models
const models = require('../models');
const fs = require('fs');

// constants 
// const CONTENT_LIMIT = 3;
const ITEMS_LIMIT   = 50;


// logique métier (req et res)

//--------- CONTROLLER POST ----------------------------------////

exports.createPosts = async (req, res, next) => {
    console.log("voir req body: ", req.body);
    console.log("voir req file: ", req.file);
    console.log("voir req body ID: ", req.body.id);
    console.log("voir req body link: ", req.body.link);

    let imageUrl;
    try {
        const user = await models.user.findOne({
            where: { id: req.body.id }
        });
        console.log("try user id = req body Id");

        if (user !== null) {
            if (req.file) {
                imageUrl = `${req.protocol}://${req.get("host")}/upload/${
                    req.file.filename
                    }`;
            } else {
                imageUrl = null;
                console.log("show imageUrl: ", imageUrl);
            }
        
            const post = await  models.post.create({
                title : user.username,
                content: req.body.content,
                imageUrl: imageUrl,
                mediaUrl: req.body.link,
                alert: 0,
                likes : 0,
                dislikes : 0,
                userId : req.body.id
            })

            res
                .status(201)
                .json({ post: post, messageRetour: "Votre post est ajouté" });

        } else {
            res.status(400).send({ error: "Erreur " });
        }
    } catch (error) {
        return res.status(500).send({ error: "Erreur serveur" });
    }
};

exports.updatePublication = async (req, res, next) => {
    console.log("voir req file: ", req.file);
    console.log("voir req body UserId: ", req.body.userId);
    console.log("voir link: ", req.body.link);
    console.log("voir id du post", req.params.id);
    console.log("voir content", req.body.content);

    try {
        console.log("apres le try catch ");
        let newImageUrl;

        let post = await models.post.findOne({
            where: {id: req.params.id} 
        });
        console.log("apres findOne ");
        console.log("voir resultat post await: ", post.userId);
        if (req.body.userId == post.userId) {
            console.log("condition userId OK ");
            if (req.file) {
                console.log("condition req.fil OK ");
                newImageUrl = `${req.protocol}://${req.get("host")}/upload/${
                    req.file.filename
                }`;
                if (req.file == undefined) {
                    console.log("condition Undefined OK ");
                    const filename = post.imageUrl.split("/upload")[1];
                    fs.unlink(`upload/${filename}`, (err) => {
                        if (err) console.log(err);
                        else {

                          console.log(`Deleted file: upload/${filename}`);
                        }
                    });
                }
            }
            console.log("condition avant condition req.body.content OK ");
            if (req.body.content) {
                post.content = req.body.content;
            }
             
            post.link = req.body.link;
            post.imageUrl = newImageUrl;
            const newPost = await post.save({
                fields: ["content", "link", "imageUrl"],
            })
            res.status(200).json({ newPost: newPost, messageRetour: "post modifié" });
        } else {
            res.status(400).json({ message: "Vous n'avez pas les droits requis" });
        }
        
    } catch (error) {
        return res.status(500).send({ error: "Erreur serveur" });
    }
};

exports.deletePublication = async (req, res, next) => {
    console.log("test delete");
    console.log("voir l'id: ", req.body.id);
    console.log("voir le postId: ", req.params.id);
    const userId = req.body.id;

    try {
        console.log("test log dans le try");
        const verifModerator = await models.user.findOne({ where: {id: userId} });
        console.log("apres verif médiator");
        const post = await models.post.findOne({ where: {id: req.params.id} });
        console.log("apres post find one");
        if (userId == post.userId || verifModerator.moderator == 1) {
            console.log("apres la double condition");
            if (post.imageUrl) {
                const filename = post.imageUrl.split("/upload")[1];
                fs.unlink(`upload/${filename}`, () => {
                    models.post.destroy({ where: { id: post.id } });
                    res.status(200).json({ message: "Post supprimé" });
                });
                console.log("passage à sinon");
            } else {
                models.post.destroy({ where: { id: post.id } }, { truncate: true });
                res.status(200).json({ message: "Post supprimé" });
            }
        } else {
            res.status(400).json({ message: "Vous n'avez pas les droits requis" });
        }
    } catch (error) {
        return res.status(500).send({ error: "Erreur serveur" });
    }
};


exports.getOnPublication = (req, res, next) => {
    const postFound = req.params.id;
    console.log("Get On Publication");
    console.log("voir l'id du post", req.params.id);
    models.post.findOne({ where: {id: postFound }
    }).then(function(postFound) {
        if(postFound) {
            return res.status(200).json(postFound);
        } else {
            return res.status(404).json({ "error": "no messages found" });
        }
    }).catch(function(err) {
        console.log(err);
        res.status(500).json({ "error": "invalid fields !!" });
        });
};

exports.getPosts = async (req, res, next) => {
        await models.post.findAll({
        order: [['createdAt', 'DESC']],
        include: [
            {
                model: models.comment,
            }
        ],
    }).then((postsAll) => { 
            res.status(200).json(postsAll); 
          })
          .catch((error) => {
            res.status(400).json({ error: error });
          });
}

// ----- likes Publication ------------------------//

exports.alertPublication = async (req, res, next) => {
    console.log("voir req body: ", req.body.alert);

    try {
        let post = await models.post.findOne({
            where: {id: req.params.id} 
        });
        if (post.alert.length == '0') {
            post.alert++;
        } else {
            post.alert = post.alert + 1;
        }
            res.status(200).json({ newPost: newPost, messageRetour: "post modifié" });
        
    } catch (error) {
        return res.status(500).send({ error: "Erreur serveur" });
    }
};

// ------------------- Comment --------------------////

exports.createComment = (req, res, next) => {
    const content = req.body.contentCom;
    const postId = req.params.id;

    if (content == null){
        return res.status(400).json({ 'error': 'missing parameters !!!' });
    }

    // if (content.length <= CONTENT_LIMIT){
    //     return res.status(400).json({ 'error': 'invalid parameters' })
    // }

    models.user.findOne({
        where: { id: req.body.id }
    }).then(function(userFound) {
        //console.log(userFound);
        console.log(userFound.username);
        if(userFound) {
            models.comment.create({
                title : userFound.username,
                content: content,
                alert: 0,
                userId : userFound.id,
                postId : postId
            }).then(() => {
                return res.status(201).json({ message: 'comment created'})
            }).catch(function(err) {
                return res.status(500).json({ 'error': 'cannot add comment' })
            })
            
        } else {
            return res.status(400).json({ 'error': 'user not found for comment' })
        }
        
    }).catch(function(err) {
        return res.status(500).json({ 'error': 'Error DB for user verify' });
    })
};


exports.getOneComment = (req, res, next) => {
    const commentFound = req.params.id;
    models.comment.findOne({ where: { id: commentFound }
    }).then(function(commentFound) {
        if(commentFound) {
            return res.status(200).json(commentFound);
        } else {
            return res.status(404).json({ "error": "no messages found" });
        }
    }).catch(function(err) {
        console.log(err);
        res.status(500).json({ "error": "invalid fields !!" });
        });
};

exports.deleteComment = async (req, res, next) => {
    const userId = req.body.id;

    try {
        console.log("avant verif moderator");
        const verifModerator = await models.user.findOne({where: {id: userId} });
        console.log("apres verif moderator");
        const comment = await models.comment.findOne({ where: {id: req.params.id} });

        if (userId == comment.userId || verifModerator.moderator == 1) {
            models.comment.destroy({ where: { id: comment.id } }, { truncate: true });
            res.status(200).json({ message: "le Commentaire a été supprimé" });
        } else {
            res.status(400).json({ message: "Vous n'avez pas les droits requis" }); 
        }
    } catch (error) {
        return res.status(500).send({ error: error});
    }
};