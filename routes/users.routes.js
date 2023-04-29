import express from 'express';

import { createUser, getUserInfo, loginUser,  } from '../controllers/user.controller.js';

const router = express.Router();


router.route('/register').post(createUser);
router.route('/login').post(loginUser);
router.route('/user/').get(getUserInfo);

export default router;

