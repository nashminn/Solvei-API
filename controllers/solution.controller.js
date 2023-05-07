import Solution from '../mongodb/models/solution.js'
import multer from 'multer'
import { createFile } from '../google_drive/drive.js'
import { Readable } from 'stream'
import { buffer } from 'stream/consumers'

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const addSolution = async (req, res) => {
    const {postedBy, questionID} = req.body
    if(req.isPDF) {
        upload.single('pdfFile')(req, res, async function (err) {
            if(err) {
                console.log(err)
                res.status(400).json({message: 'Error in parsing solution data'})
            } else {
                const isPDF = true
                const hasImage = false

                let pdfFile 
                let pdfID 

                try {
                    const bufferStream = new Readable()
                    bufferStream.push(req.file.buffer)
                    bufferStream.push(null)

                    const fileName = questionID + '_' + postedBy
                    const result = await createFile(fileName, req.file.mimetype, bufferStream)
                    const pdfID = result[0]
                    const pdfFile = result[1]

                    console.log('pdfID: ', pdfID)
                    console.log('webViewLink from solution controller: ', pdfFile)

                    const body = {
                        postedBy,
                        questionID,
                        isPDF,
                        hasImage,
                        pdfID,
                        pdfFile
                    }

                    console.log('solution controller: only pdf: body: ', body)

                    try {
                        const solution = await (Solution.addSolution(body))
                        res.status(200).json(solution)
                    } catch(error) {
                        console.log('error in solution controller')
                        console.log(error) 
                        res.status(400).json({error: error.message})
                    }
                } catch(error) {
                    console.log('error in solution controller')
                    console.log(error) 
                    res.status(400).json({error: error.message})
                }

                console.log("solution pdf inside call back function: ", pdfFile)
            }
        })
    } else {
        if(req.hasImage) {
            upload.single('imageFile')(req, res, async function (err) {
                if(err) {
                    console.log(err)
                    res.status(400).json({message: 'Error in parsing image in solution'})
                }
                const {solution} = req.body 
                const isPDF = false
                const hasImage = true

                let imageFile 
                let imageID 

                try {
                    const bufferStream = new Readable()
                    bufferStream.push(req.file.buffer)
                    bufferStream.push(null)

                    const fileName = questionID + '_' + postedBy
                    const result = await createFile(fileName, req.file.mimetype, bufferStream)
                    imageID = result[0]
                    imageFile = result[1]

                    console.log("imageID: ", imageID, "imageFile: ", imageFile)

                    const body = {
                        postedBy,
                        questionID,
                        isPDF,
                        hasImage,
                        imageID,
                        imageFile,
                        solution
                    }

                    try {
                        const solution = await Solution.addSolution(body)
                        res.status(200).json(solution)
                    } catch(error) {
                        console.log("from solution controller, add, has image")
                        console.log(error.message)
                        res.status(400).json({error: error.message})
                    }

                } catch(error) {
                    console.log('error in solution controller')
                    console.log(error) 
                    res.status(400).json({error: error.message})
                }
            })
        } else {
            const isPDF = false
            const hasImage = false

            const {solution} = req.body 

            const body ={
                postedBy,
                questionID,
                isPDF,
                hasImage,
                solution
            } 

            try {
                const solution = await Solution.addSolution(body)
                res.status(200).json(solution)
            } catch(error) {
                console.log("from solution controller, add, has image")
                console.log(error.message)
                res.status(400).json({error: error.message})
            }
        }
    }
}

const getSolution = async (req, res) => {
    const question = req.query.question
    console.log("fetching solution for question: ", question)

    try {
        const sol = await Solution.getSolution(question)
        console.log("actual solutions: ", sol)
        res.status(200).json(sol)
    } catch(error) {
        res.status(400).json(error)
    }
}

export {
    addSolution,
    getSolution
}


