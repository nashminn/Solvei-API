import express from 'express';

import {createCourse, getActiveCourses, getAllCourses} from '../controllers/course.controller.js';

const router = express.Router();

router.route('/').get(getActiveCourses);
router.route('/all').get(getAllCourses);
router.route('/add').post(createCourse);

export default router;




