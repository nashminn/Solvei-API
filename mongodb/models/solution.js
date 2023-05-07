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


const solutionModel = mongoose.model('Solution', SolutionSchema)

export default solutionModel