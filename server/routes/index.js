const userRouter = require('./user')
const productRoute = require('./product')
const productCategoryRoute = require('./productCategory')
const blogCategoryRoute = require('./blogCategory')
const blogRoute = require('./blog')
const couponRouter = require('./coupon')
const orderRouter = require('./order')



const {notFound,errHandler} = require('../middlewares/errorHandler')
// tich hop cac route vao app
const initRoutes = (app) => {
    app.use('/api/user',userRouter)
    app.use('/api/product',productRoute)
    app.use('/api/productcategory',productCategoryRoute)
    app.use('/api/blogcategory',blogCategoryRoute)
    app.use('/api/blog',blogRoute)
    app.use('/api/coupon',couponRouter)
    app.use('/api/order',orderRouter)



    app.use(notFound)
    app.use(errHandler)
}

module.exports = initRoutes