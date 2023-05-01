import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import validator from "email-validator";


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required: true
    },
    batch: {
        type: Number
    },
    role: {
        type: String
    },
    recentActivity: {
        type: [
            {
                description: {
                    type: String,
                },
                questionId: {
                    type: String
                }
            }
        ]
    }
});

// static signup method
UserSchema.statics.createUser = async function(email, password, body) {

    if (!email || !password) {
      throw Error('All fields must be filled')
    }
    
    if(!validator.validate(email)) {
        throw Error('Invalid email')
    }

    if(password.length < 8) {
        throw Error('Password must be at least 8 characters')
    }
    
    const exists = await this.findOne({ email })
  
    if (exists) {
      throw Error('Email already in use')
    }
  
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    
    console.log("body: ", body)
  
    const user = await this.create({ password: hash, ...body })
  
    return user
}
  
// static login method
UserSchema.statics.login = async function(email, password) {

    if (!email || !password) {
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({ email })
    if (!user) {
        throw Error('Incorrect email')
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw Error('Incorrect password')
    }

    return user;
}

UserSchema.statics.getUserInfo = async function(email) {
    
    if(!email) {
        throw Error("no email")
    }

    const user = await this.findOne({email});

    if(!user) {
        throw Error("user not found");
    }

    return user;
}
  

const userModel = mongoose.model('User', UserSchema);

export default userModel;


