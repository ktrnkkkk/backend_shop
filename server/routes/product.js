const router = require('express').Router()
const productController = require('../controllers/product')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary')


router.post('/', [verifyAccessToken, isAdmin], productController.createProduct)
router.get('/', productController.getProducts)
router.put('/ratings',verifyAccessToken,productController.ratings)
router.put('/uploadimage/:pid', [verifyAccessToken, isAdmin], uploader.array('images',10), productController.uploadImagesProduct)
router.put('/:pid', [verifyAccessToken, isAdmin], productController.updateProduct)
router.delete('/:pid', [verifyAccessToken, isAdmin], productController.deleteProduct)
router.get('/:pid', productController.getProduct)


module.exports = router