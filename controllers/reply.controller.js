import Reply from '../mongodb/models/reply.js'
import Solution from '../mongodb/models/solution.js'
import Question from '../mongodb/models/question.js'
import User from '../mongodb/models/user.js'
import multer from 'multer'
import { createFile } from '../google_drive/drive.js'
import { Readable } from 'stream'

const addReply = async (req, res) => {
    const {postedBy, reply, solutionId, questionId} = req.body
    const body = {
        postedBy,
        reply,
        solutionId,
        questionId
    }

    try {
        // console.log(body)
        const solution = await Solution.getSolutionById(solutionId)
        // console.log(solution, "---solution in reply controller")
        const question = await Question.getQuestionByID({_id: solution.questionID})
        // console.log(question, "---question in reply controller")
        const reply = await Reply.addReply(body)
        const replyId = reply._id
        res.status(200).json(reply)
        const another = {
            description: "added a reply to " + question.courseCode + ': ' + question.courseName + " batch "+ question.batch + " " + question.examType + " exam",
            answered: true,
            replyId: replyId,
            questionId: questionId,
            solutionId: solutionId,
            courseCode: question.courseCode,
            courseName: question.courseName,
            batch: question.batch,
            examType: question.examType,
        }
        await User.addRecentActivity(postedBy, another)
    } catch(error) {
        throw Error(error.message)
    }
}

const getReply = async (req, res) => {
    const solution = req.query.solution
    // console.log("fetching replies for solution: ", solution)

    try {
        const rep = await Reply.getReply(solution)
        // console.log("actual reply : ", rep)
        res.status(200).json(rep)
    } catch(error) {
        throw Error(error.message)
    }
}

const upvoteReply = async(req, res) => {
    try {
        const {email, replyId} = req.body
        await Reply.upvoteReply(replyId, email)
        res.status(200).json({meesage: "Reply upvoted"})
    } catch(error) {
        res.status(400).json({error: error.message})
    }
}

const downvoteReply = async (req, res) => {
    try {
        const {email, replyId} = req.body
        await Reply.downvoteReply(replyId, email)
        res.status(200).json({mesage: "Reply downvoted"})
    } catch(error) {
        res.status(400).json({error: error.message})
    }
}

const removeUpvote = async (req, res) => {
    try {
        const {email, replyId} = req.body
        await Reply.removeUpvote(replyId, email)
        res.status(200).json({message: "Reply upvote removed"})
    } catch(error) {
        res.status(400).json({error: error.message})
    }
}

const removeDownvote = async (req, res) => {
    try {
        const {email, replyId} = req.body
        await Reply.removeDownvote(replyId, email)
        res.status(200).json({message: "Reply downvote removed"})
    } catch(error) {
        res.status(400).json({error: error.message})
    }
}

const deleteReply = async(req, res) => {
    try {
        const { id } = req.params;
        await Reply.deleteReply(id)
        res.status(200).json({ message: 'Reply deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete reply', error: error.message });
    }
}

export {
    addReply,
    getReply,
    upvoteReply,
    downvoteReply,
    removeUpvote,
    removeDownvote,
    deleteReply
}


