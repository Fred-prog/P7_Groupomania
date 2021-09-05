const models = require('../models');

exports.getRecentPosts = async (req, res, next) => {
    console.log("voir params: ", req.params.id);

try {
        const post = await models.post.findAll({
            limit: 10,
            where: {userId: req.params.id},
            include: [
                {
                    model: models.comment,
                }
            ],
           
        })
        return res.status(200).json(post);
    
} catch (error) {
    return res.status(500).send({
        error: "Une erreur est survenu lors de la récupération des posts ",
      });
}
};
