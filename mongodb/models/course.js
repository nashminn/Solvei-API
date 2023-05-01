import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import User from './user.js';


const CourseSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
    altCodeName: {
        type: [{
            code: {
                type: String,
            },
            name: {
                type: String,
            }
        }]
    },
    altName: {
        type: [String]
    }
});

CourseSchema.statics.addCourse = async function(email, password, _course) {
    
    if (!email || !password) {
        throw Error('All fields must be filled')
    }
    
    const user = await User.findOne({ email })
    console.log(user);
    if (!user) {
        throw Error('Incorrect email')
    }

    const match = await bcrypt.compare(password, user.password)
    console.log("user role: ", user.role, user);
    if (!match || user.role !== 'admin') {
        throw Error('Incorrect password or not authorized')
    }

    console.log("before adding to course table: ",{_course});
    const course = await this.create(_course)

    return course;


}

CourseSchema.statics.getCourses = async function(active) {
    const courses = await this.find(active?{'active': true}:{})

    return courses;

}

const courseModel = mongoose.model('Course', CourseSchema);


export default courseModel;



