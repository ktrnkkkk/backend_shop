const mongoose = require('mongoose'); // Erase if already required
const {Schema} = require('mongoose')

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numberViews:{
        type:Number,
        default: 0,
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    dislikes: [
        {
            type:  Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    image: {
        type: String,
        default: 'https://designpickle-resources.s3.us-east-2.amazonaws.com/2020/Zoom+Backgrounds/April/20_DesignPickle_Zoom_Background-3.jpg'
    },
    author: {
        type: String,
        default: "admin"
    }
},{
    timestamps: true,
    toJSON: {virtuals: true}, 
    toObject: {virtuals: true}
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);  