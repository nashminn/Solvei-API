import Question from '../mongodb/models/question.js';
import multer from 'multer';
import express from 'express';
import { createFile, getFile } from '../google_drive/drive.js';
import { Readable } from 'stream';
import { type } from 'os';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const addQuestion = async (req, res)  => {
    upload.single('pdfFile')(req, res, async function (err) {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: 'Error in parsing form data' });
        }

        const { postedBy, courseCode, batch, examType, teacher, numOfQuestions } = req.body;
        var {topics} = req.body
        topics = topics.split(',')
        console.log(numOfQuestions)
        console.log(topics)
        
        // rest of the code
        // console.log(req.file)
        let pdfFile 
        let fileId
        try {
            // console.log(req.file.originalname)
            // console.log(req.file.mimetype)
            // console.log(req.file.buffer)

            const bufferStream = new Readable();
            bufferStream.push(req.file.buffer);
            bufferStream.push(null);

            const fileName = batch + "_" + examType + "_" + courseCode + "_" + req.file.originalname;
            const result = await createFile(fileName, req.file.mimetype, bufferStream);
            fileId = result[0]
            pdfFile = result[1]
            console.log("fileId: ", fileId)
                       
            console.log("webViewLink from question controller: ", pdfFile);

            const body = {
                postedBy,
                examType,
                batch, 
                courseCode,
                topics, 
                teacher,
                numOfQuestions,
                pdfFile,
                fileId
            }
            console.log("postedBy: ", postedBy)
            console.log("webviewlink : ", pdfFile);
            try {
                const question = await (Question.addQuestion(body));
                res.status(200).json(question);
            } catch(error) {
                console.log("from inside add question")
                console.log(error, error.message)
                res.status(400).json({error: error.message});
            }

            
        } catch(error) {
            console.log("error while uploading to google drive");
            console.log(error, error.message)
            res.status(400).json({error: error.message});
        }
        console.log("pdfFile inside callback function: ", pdfFile);
    });
};

const getQuestion = async(req, res) => {
    const question = req.query.question;
    console.log("question id: ", question)
    
    try {
        const q = await Question.getQuestionByID(question)
        console.log("actual question: ", q)
        res.status(200).json(q)
    } 
    catch(error) {
        res.status(400).json(error);
    }
}

export {
    addQuestion,
    getQuestion
}