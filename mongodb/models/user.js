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
    registrationNumber: {
        type: String,
        required: true
    },
    batch: {
        type: Number,
        required: true
    },
    role: {
        type: String
    },
    contributions: {
        type: Number,
        default: 0
    },
    recentActivity: {
        type: [
            {
                description: {type: String},
                answered: {type: Boolean},
                questionId: {type: String},
                courseCode: {type: String},
                courseName: {type: String},
                batch: {type: Number},
                examType: {type: String},
                timestamp: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    starred: {
        type: [
            {
                courseCode: {type: String},
                courseName: {type: String},
                batch: {type: Number},
                examType: {type: String},
                questionId: {type: String}
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
    console.log(user)
    return user;
}
  
UserSchema.statics.addToStarred = async function(email, body) {
    const user = await this.findOne({email})
    console.log(user._id)
    await this.updateOne(
        {_id: user._id},
        {$push: {starred: body}},
        {new: true}
    )
}

UserSchema.statics.removeFromStarred = async function (email, questionToRemove) {
    const user = await this.findOne({email})
    if(!user) {
        throw Error("User not found")
    }
    await this.updateOne(
        { _id: user._id },
        { $pull: { starred: { questionId: questionToRemove } } },
        { new: true }
    )
}

UserSchema.statics.addRecentActivity = async function(email, body) {
    console.log("add recent activity: email: ",email);
    const user = await this.findOne({email})
    console.log("add recent activity to user: ", user)
    await this.updateOne(
        {_id: user._id},
        { $push: {recentActivity: body}},
        { new: true}
    )
}

const userModel = mongoose.model('User', UserSchema);

export default userModel;


