const router = require('express').Router()
const blogCategoryController = require('../controllers/blogCategory')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')


router.post('/',[verifyAccessToken, isAdmin],blogCategoryController.createCategory)
router.get('/',blogCategoryController.getCategorys)
router.put('/:bcid',[verifyAccessToken, isAdmin],blogCategoryController.updateCategory)
router.delete('/:bcid',[verifyAccessToken, isAdmin],blogCategoryController.deleteCategory)

module.exports = router