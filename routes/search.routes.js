import express from 'express';
import {searchQuestion, searchCourse} from '../controllers/question.controller.js';

const router = express.Router();

router.route('/question').get(searchQuestion);
router.route('/course').get(searchCourse);

export default router;



