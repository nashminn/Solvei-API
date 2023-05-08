import express from 'express';

import {addQuestion, getQuestion} from '../controllers/question.controller.js';
import { flagAsBlurry, flagAsIncorrect, removeBlurryFlag, removeIncorrectFlag } from '../controllers/question.controller.js';

const router = express.Router();

router.route('/post').post(addQuestion);
router.route('/view').get(getQuestion);
router.route('/flag/blurry').post(flagAsBlurry);
router.route('/flag/incorrect').post(flagAsIncorrect);
router.route('/unflag/blurry').post(removeBlurryFlag);
router.route('/unflag/incorrect').post(removeIncorrectFlag);

export default router;

