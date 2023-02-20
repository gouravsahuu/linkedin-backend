const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

const postSchema = mongoose.Schema({
    title:{type:String,required:true},
    body:{type:String,required:true},
    device:{type:String,required:true},
    no_of_comments:{type:Number,required:true},
    userID:{type:String}
})

const PostModel = mongoose.model("post",postSchema);

module.exports = {PostModel};