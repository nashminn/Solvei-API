import { mongoose } from "mongoose";


const ReplySchema = new mongoose.Schema({
    postedBy: {
        type: String,
        required: true
    },
    reply: {
        type: String,
        required: true
    }, 
    timestamp: {
        type: Date, 
        default: Date.now
    },
    questionId: {
        type: String,
        required: true
    },
    solutionId: {
        type: String,
        required: true
    },
    edited: {
        type: Boolean
    },
    editTime: {
        type: Date
    },
    upvotes: {
        type: [String]
    }, 
    downvotes: {
        type: [String]
    }
})

ReplySchema.statics.addReply = async function (body) {
    let reply
    try {
        reply = await this.create(body)
    } catch(error) {
        throw Error(error.message)
    }
    return reply
}

ReplySchema.statics.getReply = async function(_id) {
    let reply
    try {
        reply = await this.find({solutionId: _id})
    } catch(error) {
        console.log(error)
        throw Error(error.message)
    }
    return reply
}

ReplySchema.statics.upvoteReply = async function(id, email) {
    // console.log("reply id, email: ", id, email)
    const reply = await this.findOne({_id: id})
    if(!reply) {
        throw Error("Reply not found")
    }

    if(reply.downvotes.includes(email)) {
        await this.updateOne(
            {_id: id},
            {$pull: {downvotes: email}}
        )
    }
    await this.updateOne(
        {_id: id},
        {$push: {upvotes: email}},
        {new: true}
    )
}

ReplySchema.statics.removeUpvote = async function(id, email) {
    // console.log("reply id, email:", id, email)
    const reply = await this.findOne({_id: id})
    if(!reply) {
        throw Error("Reply not found")
    }
    if(reply.upvotes.includes(email)) {
        await this.updateOne(
            {_id: id},
            {$pull: {upvotes: email}}
        )
    }
}

ReplySchema.statics.downvoteReply = async function(id, email) {
    // console.log("reply id, email:", id, email)
    const reply = await this.findOne({_id: id})
    if(!reply) {
        throw Error("Reply not found")
    }
    if(reply.upvotes.includes(email)) {
        await this.updateOne(
            {_id: id},
            {$pull: {upvotes: email}}
        )
    }
    await this.updateOne(
        {_id: id},
        {$push: {downvotes: email}},
        {new: true}
    )
}

ReplySchema.statics.removeDownvote = async function(id, email) {
    // console.log("reply id, email:", id, email)
    const reply = await this.findOne({_id: id})
    if(!reply) {
        throw Error("Reply not found")
    }
    if(reply.downvotes.includes(email)) {
        await this.updateOne(
            {_id: id},
            {$pull: {downvotes: email}}
        )
    }
}

ReplySchema.statics.deleteReply = async function (replyId) {
    const reply = await this.findOne({_id: new mongoose.Types.ObjectId(replyId)})
    if(!reply) {
        throw Error("Reply not found for deletion")
    }

    await this.deleteOne({_id: new mongoose.Types.ObjectId(replyId)})
    await User.deleteRecentActivity(reply.postedBy, reply._id, false)
}

const replyModel = mongoose.model('Reply', ReplySchema)

export default replyModel



