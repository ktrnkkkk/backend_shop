const jwt = require("jsonwebtoken")
// 1 dang hash password
const generateAccessToken = (id,role) => jwt.sign({_id: id, role}, process.env.JWT_SECRET,{expiresIn: '3d'})
const generateRefreshToken = (id) => jwt.sign({_id: id}, process.env.JWT_SECRET,{expiresIn: '7d'})


module.exports = {
    generateAccessToken,
    generateRefreshToken
}
