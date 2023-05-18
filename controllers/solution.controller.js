import Solution from '../mongodb/models/solution.js'
import Question from '../mongodb/models/question.js'
import User from '../mongodb/models/user.js'
import multer from 'multer'
import { createFile } from '../google_drive/drive.js'
import { Readable } from 'stream'

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const addSolution = async (req, res) => {
    var errorFlag = false
    var solutionId
    upload.fields([
        { name: 'pdfFile', maxCount: 1 },
        { name: 'imageFile', maxCount: 1 },
    ])(req, res, async (err) => {
        if(err) {
            console.log(err)
            return res.status(400).json({message: "Error in parsing form data in add solution"})
        }

        const {postedBy, questionID, isPDF, hasImage} = req.body
        // console.log("isPDF: ",isPDF)
        if(isPDF === 'true') {
            // console.log("isPDF true")
            var {pdfFile} = req.files
            pdfFile = pdfFile[0]

            let pdfID 
            try {
                const bufferStream = new Readable()
                bufferStream.push(pdfFile.buffer)
                bufferStream.push(null)

                const fileName = questionID  + '_' + postedBy +".pdf"
                // console.log(pdfFile)
                const result = await createFile(fileName, pdfFile.mimetype, bufferStream)
                pdfID = result[0]
                pdfFile = result[1]
                

                const body = {
                    postedBy,
                    hasImage,
                    isPDF,
                    pdfFile,
                    pdfID,
                    questionID
                }

                try {
                    // console.log(body)
                    const solution = await Solution.addSolution(body)
                    solutionId = solution._id
                    res.status(200).json(solution)
                } catch(error) {
                    errorFlag = true
                    console.log(error, error.message)
                    res.status(400).json({error: error.message});                    
                }
            } catch(error) {
                errorFlag = true
                console.log(error, error.message)
                res.status(400).json({error: error.message});
            }
        } else {
            const {solution} = req.body
            const body = {
                postedBy,
                hasImage,
                isPDF,
                questionID,
                solution
            }
            // console.log(solution)

            try {
                // console.log(body)
                const solution = await Solution.addSolution(body)
                solutionId = solution._id
                res.status(200).json(solution)
            } catch(error) {
                errorFlag = true
                console.log(error, error.message)
                res.status(400).json({error: error.message});                    
            }

        }

        if(!errorFlag) {
            // console.log("adding recent activity")
            const question = await Question.getQuestionByID(questionID)
            // console.log(question.courseName)
            const body = {
                description: "added a solution to "+question.courseCode + ': ' + question.courseName + " batch "+ question.batch + " " + question.examType + " exam",
                answered: true,
                questionId: questionID,
                solutionId: solutionId,
                courseCode: question.courseCode,
                courseName: question.courseName,
                batch: question.batch,
                examType: question.examType,
            }
            await User.addRecentActivity(postedBy, body)
        }
    })
}

const getSolution = async (req, res) => {
    const question = req.query.question
    // console.log("fetching solution for question: ", question)

    try {
        const sol = await Solution.getSolution(question)
        // console.log("actual solutions: ", sol)
        res.status(200).json(sol)
    } catch(error) {
        throw Error(error.message)
    }
}

// const deleteSolution = async (req, res) => {

// }

const upvoteSolution = async (req, res) => {
    try {
        const {email, solutionId} = req.body
        await Solution.upvoteSolution(solutionId, email)
        res.status(200).json({message: "Solution upvoted"})
    } catch(error) {
        res.status(400).json({error: error.message})
    }
}

const downvoteSolution = async (req, res) => {
    try {
        const {email, solutionId} = req.body
        await Solution.downvoteSolution(solutionId, email)
        res.status(200).json({message: "Solution downvoted"})
    } catch(error) {
        res.status(400).json({error: error.message})
    }
}

const removeUpvote = async (req, res) => {
    try {
        const {email, solutionId} = req.body
        await Solution.removeUpvote(solutionId, email)
        res.status(200).json({message: "Upvote removed"})
    } catch(error) {
        res.status(400).json({error: error.message})
    }
}

const removeDownvote = async (req, res) => {
    try {
        const {email, solutionId} = req.body
        await Solution.removeDownvote(solutionId, email)
        res.status(200).json({message: "Downvote removed"})
    } catch(error) {
        res.status(400).json({error: error.message})
    }
}

const deleteSolution = async(req, res) => {
    try {
        const { id } = req.params;
        await Solution.deleteSolution(id)
        res.status(200).json({ message: 'Solution deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete solution', error: error.message });
    }
}

export {
    addSolution,
    getSolution,
    upvoteSolution,
    downvoteSolution,
    removeUpvote,
    removeDownvote,
    deleteSolution
}


