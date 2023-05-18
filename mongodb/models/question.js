import mongoose from "mongoose";
import { deleteFileById } from "../../google_drive/drive.js";
import User from './user.js'
import Reply from "./reply.js";
import Solution from "./solution.js";

const QuestionSchema = new mongoose.Schema({
    postedBy: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
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
        type: String,
        required: true
    },
    fileId: {
        type: String,
        required: true
    },
    flagBlurry: {
        type: [String] // list of emails
    },
    flagIncorrect: {
        type: [String] // list of emails
    }
});


QuestionSchema.statics.addQuestion = async function(body) {
    const question = await this.create(body);

    return question;
}

QuestionSchema.statics.searchQuestion = async function(courseCode, courseName, batch, examType, yearSemester, teacher) {
    var query = {};
    // console.log("in question.js: ", courseCode, courseName, batch, examType, yearSemester, teacher)
    if(batch) {
        query.batch = batch;
    }
    
    if(examType) {
        query.examType = examType
    }

    if(courseCode) {
        query.courseCode = courseCode
    } else if(yearSemester) {
        query.courseCode = {$regex: ".*" + yearSemester + ".*" , $options : "i"}
    }

    if(courseName) {
        query.courseName =  {$regex : ".*" + courseName + ".*" , $options : "i"}
    }

    if(teacher) {
        query.teacher = {$regex: ".*" + teacher + ".*" , $options : "i"}
    }

    // console.log("query for find operation", query)
    const qList = await this.find(query)
    // console.log("questions list length", qList.length)
    return qList
    
}


QuestionSchema.statics.getQuestionByID = async function(id) {
    // console.log("in question.js _id: ", id)
    let question;
    try {
        question = await this.findOne({_id: (id)})
    } catch(error) {
        console.log(error)
    }
    // console.log("hello?0")
    // console.log("question fetched from db:", question)
    return question
}


QuestionSchema.statics.flagAsBlurry = async function(id, email) {
    // console.log("question id, email: ", id, email)
    const question = await this.findOne({_id: id})
    if(!question) {
        throw Error("Question not found")
    }
    if(!question.flagBlurry.includes(email)) {
        await this.updateOne(
            {_id: id},
            {$push: {flagBlurry: email}},
            {new: true}
        )
    }
}

QuestionSchema.statics.flagAsIncorrect = async function(id, email) {
    // console.log("question id, email: ", id, email)
    const question = await this.findOne({_id: id})
    if(!question) {
        throw Error("Question not found")
    }
    if(!question.flagIncorrect.includes(email)) {
        await this.updateOne(
            {_id: id},
            {$push: {flagIncorrect: email}},
            {new: true}
        )
    }
}

QuestionSchema.statics.removeBlurryFlag = async function(id, email) {
    // console.log("question id, email: ", id, email)
    const question = await this.findOne({_id: id})
    if(!question) {
        throw Error("Question not found")
    }
    if(question.flagBlurry.includes(email)) {
        await this.updateOne(
            {_id: id},
            {$pull: {flagBlurry: email}}
        )
    }
}

QuestionSchema.statics.removeIncorrectFlag = async function(id, email) {
    // console.log("question id, email: ", id, email)
    const question = await this.findOne({_id: id})
    if(!question) {
        throw Error("Question not found")
    }
    if(question.flagIncorrect.includes(email)) {
        await this.updateOne(
            {_id: id},
            {$pull: {flagIncorrect: email}}
        )
    }
}

QuestionSchema.statics.deleteQuestion = async function(questionId) {
    // console.log("question id: ", questionId)
    const question = await this.findOne({_id: questionId})
    if(!question) {
        throw Error("Question not found for deletion")
    }
    await deleteFileById(question.fileId)
    await Reply.deleteMany({questionId: question._id})
    await Solution.deleteMany({questionID: question._id})
    await User.deleteRecentActivity(question.postedBy, question._id, true)
    await User.updateMany(
        { $pull: {starred: {questionId: questionId}}},
    )
    await this.deleteOne({_id: question._id})
}

const questionModel = mongoose.model('Question', QuestionSchema);

export default questionModel;







