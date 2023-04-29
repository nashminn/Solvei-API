import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js';
import {createFile, getFile, listAllFiles, deleteFileById} from './google_drive/drive.js';

import userRouter from './routes/users.routes.js';
import questionRouter from './routes/question.routes.js';
import courseRouter from './routes/course.routes.js';

dotenv.config();

const app = express();
app.use(cors());

// every request passes through jsonify
app.use(express.json({limit: '20mb'}));

app.use('/api/auth', userRouter);
app.use('/api/question', questionRouter);
app.use('/api/course', courseRouter);


app.get('/', (req, res) => {
    res.json({message: "hello world!"});
});

const startServer = async() => {
    try {
        // connect to db
        connectDB(process.env.MONGODB_URL);

        // console.log(process.env.MONGODB_URL);
        // const fileName = 'abcd.pdf'; // Replace with your file name
        // const mimeType = 'application/pdf'; // Replace with your file MIME type
        // const fileBody = 'Hello World'; // Replace with your file content

        // try {
        //     // await createFile(fileName, mimeType, fileBody);
        //     await getFile("1WdXAxDBWI2PqzoQT7mWmTf0kBKtPYVLs");

        // } catch(error) {
        //     console.log("error message from server.js: ", error.message, error)
        // }
        // listAllFiles()
        // await getFile("1k0gKQqT-nOEuw7vCUMtPL8V6rmdiqnav")
        // deleteFileById("14LeB25Pu_9iSN_9dwlORhttt8fH2crrJ")
        

        app.listen(process.env.PORT, () => {
            console.log("Server has started on port http://localhost:8080");
        });
    } catch(error) {
        console.log(error);
    }
}

startServer();



