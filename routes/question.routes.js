import express from 'express';

import {addQuestion, getQuestion} from '../controllers/question.controller.js';

const router = express.Router();

router.route('/post').post(addQuestion);
router.route('/view').get(getQuestion);
// router.route('/flag/blurry').post();
// router.route('/flag/incorrect').post();

export default router;

