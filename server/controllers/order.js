const Order= require("../models/order")
const Coupon= require("../models/coupon")
const User= require("../models/user")

const asyncHandler = require("express-async-handler")

const createOrder = asyncHandler(async(req,res)=> {
    const {_id} = req.user
    const {coupon} = req.body
    const userCart = await User.findById(_id).select('cart').populate("cart.product", 'title price')

    let total = 0; 
    if (userCart) {
        const products = userCart.cart.map(el => ({ 
            product: el.product._id,
            count: el.quantity,
            color: el.color
        }));
        total = userCart.cart.reduce((sum, el) => sum + el.product.price * el.quantity, 0); // Sửa thành userCart.cart.reduce
        const createData= {products,total,orderBy:_id}
        if (coupon){
            const selected = await Coupon.findById(coupon)
            total = Math.round(total * (1 - +selected.discount / 100) / 1000) * 1000||total;
            createData.total=total
            create.coupon=coupon
        } 
        const rs= await Order.create(createData)
    }

    return res.json({
        success: rs ? true : false,
        rs: rs ? rs : "some thing is wrong"
    });


})

const updateStatus = asyncHandler(async(req,res)=>{
    const {oid} = req.params
    const {status} =req.body
    if(!status) throw new Error("Missing input")
    const response = await Order.findByIdAndUpdate(oid,{status},{new:true})
    return res.json({
        success: response?true:false,
        response: response ?  response:'Someting went wrong'
    })
})

const getUserOrder = asyncHandler(async(req,res)=>{
    const {_id} =req.user
    const response = await Order.findById({orderBy:_id})
    return res.json({
        success: response?true:false,
        response: response ?  response:'Someting went wrong'
    })
})

const getOrder = asyncHandler(async(req,res)=>{
    const response = await Order.find()
    return res.json({
        success: response?true:false,
        response: response ?  response:'Someting went wrong'
    })
})

module.exports={
    createOrder,
    updateStatus,
    getUserOrder,
    getOrder
}