import express from 'express';

import { createUser, getUserInfo, loginUser, addToStarred, removeFromStarred } from '../controllers/user.controller.js';

const router = express.Router();


router.route('/register').post(createUser);
router.route('/login').post(loginUser);
router.route('/').get(getUserInfo);
router.route('/star/add').post(addToStarred);
router.route('/star/remove').post(removeFromStarred);

export default router;

