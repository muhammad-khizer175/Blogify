const { Schema, model } = require("mongoose");

const commentSchama = new Schema({
    content:{
        type:String,
        required:true
    },
    blogId:{
        type:Schema.Types.ObjectId,
        ref:"blog"
    },
    commentedBy:{
        type:Schema.Types.ObjectId,
        ref:"user"
    }
})


const Comment = model("comment",commentSchama)

module.exports = Comment
