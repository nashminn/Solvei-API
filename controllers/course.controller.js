import Course from '../mongodb/models/course.js';

const createCourse = async (req, res) => {
    // console.log("in course controller, req.body:", req.body)
    const {email, password, course} = req.body;
    // console.log("course: ", course);
    console.log("from course controller1:",course);
    try {
        
        const _course = await Course.addCourse(email, password, course);

        res.status(200).json({_course});
    } catch(error) {
        res.status(400).json({error: error.message});
    }
};

const getActiveCourses = async(req, res) => {
    try {
        const courses = await Course.getActiveCourses();

        res.status(200).json({courses});
    } catch(error) {
        res.status(400).json({error: error.message})
    }
}

export {
    createCourse,
    getActiveCourses
}




