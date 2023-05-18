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
import replyRouter from './routes/reply.routes.js';

dotenv.config();

const app = express();

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

const allowedOrigins = ['https://solvei.vercel.app', 'postman-origin', 'http://localhost:3000']
// const allowedOrigins = ['https://solvei.vercel.app']

const corsOptions ={
    origin: function (origin, callback) {
        console.log("origin: ", origin)
        if (allowedOrigins.includes(origin) || !origin) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }, 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}

app.use(cors(corsOptions));



// every request passes through jsonify
app.use(express.json({limit: '20mb'}));

app.use('/api/auth', userRouter);
app.use('/api/user', userRouter);
app.use('/api/global', userRouter);
app.use('/api/course', courseRouter);
app.use('/api/question', questionRouter);
app.use('/api/search', searchRouter);
app.use('/api/solution', solutionRouter);
app.use('/api/reply', replyRouter);
app.use('/api/teachers', questionRouter);


app.get('/', (req, res) => {
    res.json({
        api: {
            auth: {
                register: "register new user",
                login: "user login",
            },
            user: {
                "/": "get user info",
                "star/add": "add question to starred",
                "star/remove": "remove question from starred"
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
            solution: {
                add: "add solution",
                get: "get solution",
                "add/upvote": "upvote solution",
                "add/downvote": "downvote solution",
                "remove/upvote": "remove upvote",
                "remove/downvote": "remove downvote"
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
        // deleteFileById("1xFoJLhI17hi14qIlsGNnXrK5MM_tjQ4E")


        app.listen(process.env.PORT, () => {
            console.log("Server has started on port http://localhost:8080");
        });
    } catch(error) {
        console.log(error);
    }
}

startServer();



