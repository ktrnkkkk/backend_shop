const router = require('express').Router()
const blogController = require('../controllers/blog')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary')

router.post('/',[verifyAccessToken, isAdmin],blogController.createNewBlog)
router.put('/:bid',[verifyAccessToken, isAdmin],blogController.updateBlog)
router.put('/image/:bid',[verifyAccessToken, isAdmin],uploader.single("image"),blogController.uploadImageBlog)

router.get('/',blogController.getBlogs)
router.get('/one/:bid',blogController.getBlog)
router.put('/like/:bid',[verifyAccessToken],blogController.likeBlog )
router.put('/dislike/:bid',[verifyAccessToken],blogController.dislikeBlog )
router.delete('/:bid',[verifyAccessToken, isAdmin],blogController.deleteBlog)

module.exports = router