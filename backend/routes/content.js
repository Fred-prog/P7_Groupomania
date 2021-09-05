// Imports 
const express = require('express');
const router = express.Router();

//importation controllers content
const contentCtrl = require('../controllers/contents');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Content route 

router.post('/', auth, multer, contentCtrl.createPosts);
router.get('/', auth, contentCtrl.getPosts);

router.get('/:id', contentCtrl.getOnPublication);
router.put('/:id', auth, multer, contentCtrl.updatePublication);
router.delete('/:id', auth, contentCtrl.deletePublication);

router.post('/:id/comments', auth, contentCtrl.createComment);
router.get('/:id/comments/:id', contentCtrl.getOneComment);
router.delete('/comments/:id', auth, contentCtrl.deleteComment);

//router.post('/:id/comment/:id/likes', contentCtrl.);

module.exports = router;