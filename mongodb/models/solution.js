import mongoose, { mongo } from "mongoose"

const SolutionSchema = new mongoose.Schema({
    isPDF: {
        type: Boolean,
        required: true
    },
    pdfFile: {
        type: String
    },
    pdfID: {
        type: String
    },
    hasImage: {
        type: Boolean,
        required: true
    },
    imageFile: {
        type: String
    },
    imageID: {
        type: String
    },
    postedBy: {
        type: String,
        required: true
    },
    solution: {
        type: String //actual solution text
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    questionID: {
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

SolutionSchema.statics.addSolution = async function(body) {
    const solution = await this.create(body);
    return solution;
}

SolutionSchema.statics.getSolution = async function(_id) {
    let solution
    try {
        solution = await this.find({questionID: _id})
    } catch(error) {
        console.log(error)
        return error
    }
    return solution
}


SolutionSchema.statics.upvoteSolution = async function(id, email) {
    console.log("solution id, email:", id, email)
    const solution = await this.findOne({_id: id})
    if(!solution) {
        throw Error("Solution not found")
    }
    console.log(solution)
    if(solution.downvotes.includes(email)) {
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

SolutionSchema.statics.removeUpvote = async function(id, email) {
    console.log("solution id, email:", id, email)
    const solution = await this.findOne({_id: id})
    if(!solution) {
        throw Error("Solution not found")
    }
    if(solution.upvotes.includes(email)) {
        await this.updateOne(
            {_id: id},
            {$pull: {upvotes: email}}
        )
    }
}

SolutionSchema.statics.removeDownvote = async function(id, email) {
    console.log("solution id, email:", id, email)
    const solution = await this.findOne({_id: id})
    if(!solution) {
        throw Error("Solution not found")
    }
    if(solution.downvotes.includes(email)) {
        await this.updateOne(
            {_id: id},
            {$pull: {downvotes: email}}
        )
    }
}


SolutionSchema.statics.downvoteSolution = async function(id, email) {
    console.log("solution id, email:", id, email)
    const solution = await this.findOne({_id: id})
    if(!solution) {
        throw Error("Solution not found")
    }
    if(solution.upvotes.includes(email)) {
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


const solutionModel = mongoose.model('Solution', SolutionSchema)

export default solutionModel