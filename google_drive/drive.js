import {google} from "googleapis"
import {JWT} from "google-auth-library"

import key from "../solvei-storage-e6b410c3a88b.json" assert {type:"json"}
// const key = require('./path/to/service-account-private-key.json');
const scopes = ['https://www.googleapis.com/auth/drive'];


const auth = new JWT({
    email: key.client_email, 
    key: key.private_key,
    keyFile: key,
    scopes,
    });

const drive = google.drive({ version: 'v3', auth });

const createFile = async (name, mimeType, body) => {
    const fileMetadata = {
        name,
        mimeType,
    };
    
    const media = {
        mimeType,
        body,
    };
    
    const res = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, webViewLink',
    });
      
    // Set the file's permission to "public"
    await drive.permissions.create({
        fileId: res.data.id,
        requestBody: {
        role: 'reader',
        type: 'anyone'
        }
    });
    
    console.log(`File created with ID: ${res.data.id}`);
    
    return [res.data.id, res.data.webViewLink];
};

const getFile = async (fileId) => {
    drive.files.get({
        fileId: fileId,
        fields: 'webViewLink',
    }, (err, file) => {
        if (err) {
          console.error(err);
        } else {
            
            console.log(`Web View Link: ${file.data.webViewLink}`);
            return file.data.webViewLink
        }
    });
};

const listAllFiles = async () => {
    drive.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
        }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
            const files = res.data.files;
            if (files.length) {
                console.log('Files:');
                files.map((file) => {
                console.log(`${file.name} (${file.id})`);
            });
        } else {
            console.log('No files found.');
        }
    });
};

const deleteFileById = async (fileId) => {
    try {
      await drive.files.delete({ fileId });
      console.log(`File ${fileId} was deleted successfully.`);
    } catch (err) {
      console.error(`Error deleting file ${fileId}: ${err}`);
    }
};


export {
    createFile,
    getFile,
    listAllFiles,
    deleteFileById
}


