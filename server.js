import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js';
import {createFile, getFile, listAllFiles, deleteFileById} from './google_drive/drive.js';

import userRouter from './routes/users.routes.js';
import questionRouter from './routes/question.routes.js';
import courseRouter from './routes/course.routes.js';
import searchRouter from './routes/search.routes.js';
import solutionRouter from './routes/solution.routes.js';

dotenv.config();

const app = express();
app.use(cors());

// every request passes through jsonify
app.use(express.json({limit: '20mb'}));

app.use('/api/auth', userRouter);
app.use('/api/course', courseRouter);
app.use('/api/question', questionRouter);
app.use('/api/search', searchRouter);
app.use('/api/solution', solutionRouter);


app.get('/', (req, res) => {
    res.json({
        api: {
            auth: {
                register: "register new user",
                login: "user login",
                user: "get user info"
            },
            course: {
                "/": "home page courses",
                all: "all courses",
                add: "add a new course"
            },
            question: {
                post: "post a new question",
                view: "view a question and its solutions"
            },
            search: {
                question: "takes params for diplaying questions",
                course: "takes params for displaying courses"  
            }
        }
    }) 
});

const startServer = async() => {
    try {
        // connect to db
        connectDB(process.env.MONGODB_URL);

        // listAllFiles()
        // await getFile("1k0gKQqT-nOEuw7vCUMtPL8V6rmdiqnav")
        // deleteFileById("1uhCRHxDZlxk3qDelaEBg1lcFqu_tzJ7y")


        app.listen(process.env.PORT, () => {
            console.log("Server has started on port http://localhost:8080");
        });
    } catch(error) {
        console.log(error);
    }
}

startServer();



