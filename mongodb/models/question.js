import mongoose from "mongoose";


const QuestionSchema = new mongoose.Schema({
    postedBy: {
        type: String,
        required: true
    },
    examType: {
        type: String,
        required: true
    },
    batch : {
        type: Number,
        required: true
    },
    courseCode: {
        type: String,
        required: true
    },
    courseName: {
        type: String
    },
    topics: {
        type: [String]
    },
    teacher: {
        type: String
    },
    numOfQuestions: {
        type: Number,
        required: true
    },
    pdfFile: {
        // data: Buffer,
        // contentType: String
        type: String,
        required: true
    },
    fileId: {
        type: String,
        required: true
    }
});


QuestionSchema.statics.addQuestion = async function(body) {
    const question = await this.create(body);

    return question;
}

QuestionSchema.statics.getQuestionByID = async function(_id) {
    console.log("in question.js _id: ", _id)
    let question;
    try {
        question = await this.find({_id: new mongoose.Types.ObjectId(_id)})
    } catch(error) {
        console.log(error)
    }
    // console.log("hello?0")
    // console.log("question fetched from db:", question)
    return question
}

const questionModel = mongoose.model('Question', QuestionSchema);

export default questionModel;







