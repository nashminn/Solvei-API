import express from 'express';

import {createCourse, getActiveCourses} from '../controllers/course.controller.js';

const router = express.Router();

router.route('/').get(getActiveCourses);
router.route('/add').post(createCourse);

export default router;




