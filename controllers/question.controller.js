import Question from '../mongodb/models/question.js';
import multer from 'multer';
import { createFile, getFile } from '../google_drive/drive.js';
import { Readable } from 'stream';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const addQuestion = async (req, res)  => {
    upload.single('pdfFile')(req, res, async function (err) {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: 'Error in parsing form data' });
        }

        const { postedBy, courseCode, courseName, batch, examType, teacher, numOfQuestions } = req.body;
        var {topics} = req.body
        topics = topics.split(',')

        // rest of the code
        // console.log(req.file)
        let pdfFile 
        let fileId

        try {

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
                courseName,
                topics, 
                teacher,
                numOfQuestions,
                pdfFile,
                fileId
            }
            console.log("postedBy: ", postedBy)
            console.log("webviewlink : ", pdfFile);
            try {
                const exists = await (Question.searchQuestion(courseCode, courseName, batch, examType, undefined, undefined) )
                
                console.log("exists: ", exists)
                if(exists.length > 0) {
                    res.status(406).json({Error: "Question already exists"})
                } else {
                    const question = await (Question.addQuestion(body));
                    res.status(200).json(question);
                }
            } catch(error) {
                console.log("from inside add question")
                console.log(error)
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
        console.log("actual question: ", q[0])
        res.status(200).json(q[0])
    } 
    catch(error) {
        res.status(400).json(error);
    }
}

const searchQuestion = async(req, res) => {
    const batch = req.query.batch? Number(req.query.batch) : req.query.batch;
    const examType = req.query.examType;
    const course = (req.query.course===undefined)?req.query.course:decodeURIComponent(req.query.course);
    const yearSemester = req.query.yearSemester;
    const teacher = (!(req.query.teacher===undefined))?decodeURIComponent(req.query.teacher):req.query.teacher;
    
    let courseCode, courseName
    if(course && String(course).includes(':')) {
        courseCode = decodeURIComponent(course).split(':')[0]
        courseName = decodeURIComponent(course).split(':')[1].slice(1)
        if(courseName.length === 0) {
            courseName = undefined
        }
    } else {
        courseName = course?decodeURIComponent(course):undefined
    }

    console.log(courseCode, courseName, batch, examType, yearSemester, teacher)
    

    try {
        const qs = await Question.searchQuestion(courseCode, courseName, batch, examType, yearSemester, teacher)
        console.log(qs.length)
        res.status(200).json(qs)
    } catch(error) {
        res.status(400).json(error);
    }
}


const searchCourse = async(req, res) => {
    const batch = req.query.batch? Number(req.query.batch) : req.query.batch;
    const examType = req.query.examType;
    const yearSemester = req.query.yearSemester;
    const teacher = (!(req.query.teacher===undefined))?decodeURIComponent(req.query.teacher):req.query.teacher;
    
    let code, name
    

    console.log(code, name, batch, examType, yearSemester, teacher)
    

    try {
        const qs = await Question.searchQuestion(code, name, batch, examType, yearSemester, teacher)

        var forReturn = qs.map((q, index) => (
            {
                courseCode: q.courseCode,
                courseName: q.courseName
            }
        ));
        console.log(forReturn)
        res.status(200).json(forReturn)
    } catch(error) {
        res.status(400).json(error);
    }
}


export {
    addQuestion,
    getQuestion,
    searchQuestion,
    searchCourse
}