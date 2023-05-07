import Solution from '../mongodb/models/solution.js'
import Question from '../mongodb/models/question.js'
import User from '../mongodb/models/user.js'
import multer from 'multer'
import { createFile } from '../google_drive/drive.js'
import { Readable } from 'stream'
import { query } from 'express'
import { buffer } from 'stream/consumers'

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const addSolution = async (req, res) => {
    var errorFlag = false
    upload.fields([
        { name: 'pdfFile', maxCount: 1 },
        { name: 'imageFile', maxCount: 1 },
    ])(req, res, async (err) => {
        if(err) {
            console.log(err)
            return res.status(400).json({message: "Error in parsing form data in add solution"})
        }

        const {postedBy, questionID, isPDF, hasImage} = req.body
        console.log(isPDF)
        if(isPDF === true) {
            
            var {pdfFile} = req.files
            pdfFile = pdfFile[0]
            
            let pdfID 
            try {
                const bufferStream = new Readable()
                bufferStream.push(pdfFile.buffer)
                bufferStream.push(null)

                const fileName = questionID + "_" + postedBy
                
                const result = await createFile(fileName)
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
                    console.log(body)
                    const solution = await Solution.addSolution(body)
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
            console.log(solution)

            try {
                console.log(body)
                const solution = await Solution.addSolution(body)
                res.status(200).json(solution)
            } catch(error) {
                errorFlag = true
                console.log(error, error.message)
                res.status(400).json({error: error.message});                    
            }

        }

        if(!errorFlag) {
            console.log("adding recent activity")
            const question = await Question.getQuestionByID(questionID)
            console.log(question.courseName)
            const body = {
                description: "added a solution to "+question.courseCode + ' :' + question.courseName + " batch "+ question.batch + " " + question.examType + " exam ",
                answered: true,
                questionId: questionID,
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
    console.log("fetching solution for question: ", question)

    try {
        const sol = await Solution.getSolution(question)
        console.log("actual solutions: ", sol)
        res.status(200).json(sol)
    } catch(error) {
        throw Error(error.message)
    }
}

export {
    addSolution,
    getSolution
}


