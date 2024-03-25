const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success: newProduct ? true : false,
        createdProduct: newProduct ? newProduct : 'Cannot create new product'
    })
})
const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const product = await Product.findById(pid)
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Cannot get product'
    })
})
// Filtering, sorting & pagination
const getProducts = asyncHandler(async (req, res) => {
    const queries = { ...req.query }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach(el => delete queries[el])
    //Filtering
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)    
    const formatedQueries = JSON.parse(queryString)

    if(queries?.title) formatedQueries.title = {$regex: queries.title, $options : 'i'}
    let queryCommand = Product.find(formatedQueries)
    //Sorting
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }
    //Pagination
    const page = +req.query.page ||1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
    const skip = (page -1) *limit
    queryCommand.skip(skip).limit(limit)


    
    try {
        const response = await queryCommand.exec();
        const counts = await Product.find(formatedQueries).countDocuments();
        return res.status(200).json({
            success: response ? true : false,
            products: response ? response : 'Cannot get products',
            counts
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
})

const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true })
    return res.status(200).json({
        success: updatedProduct ? true : false,
        updatedProduct: updatedProduct ? updatedProduct : 'Cannot update product'
    })
})
const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const deletedProduct = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        success: deletedProduct ? true : false,
        deletedProduct: deletedProduct ? deletedProduct : 'Cannot delete product'
    })
})

const ratings = asyncHandler(async (req,res) => {
    const {_id} = req.user
    const {star, comment, pid} = req.body
    if(! star|| !pid) throw new Error('Missing inputs')
    const ratingProduct = await Product.findById(pid)
    const alreadRating = ratingProduct?.ratings?.some(el => el.postedBy === _id)
    if(alreadRating){
        await Product.updateOne({
            ratings: {$elemMatch: alreadRating}
        },{
           $set: {"ratings.$.star": star,"ratings.$.comment": comment} 
        },{new: true})
    }else{
        const response = await Product.findByIdAndUpdate(pid,{
            $push: {ratings: {star,comment,postedBy: _id}}},
            {new: true })
    }
    const updateProduct = await Product.findById(pid)
    const ratingCount = updateProduct.ratings.length
    const sumRatings = updateProduct.ratings.reduce((sum, el) => sum+ +el.star ,0)
    updateProduct.totalRatings = Math.round(sumRatings*10/ratingCount)/10

    await  updateProduct.save()
    return res.status(200).json({
        status: true,
        updateProduct
    })

})
// truoc do chay qua ham up anh
const uploadImagesProduct = asyncHandler(async(req,res)=> {
    const {pid} = req.params
    if(!req.files) throw new Error('Missing inputs')
    // push cac ptu vao mang images 
    const response = await Product.findByIdAndUpdate(pid,{$push: {images: {$each: req.files.map(el => el.path) }}},{new: true})
    return res.status(200).json({
        status:response ? true : false,
        updateProduct: response ? response : 'Cannot upload images'
    })
})

module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    ratings, 
    uploadImagesProduct
}