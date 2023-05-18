import express from "express"

import { addReply, getReply } from "../controllers/reply.controller.js"
import { upvoteReply, downvoteReply, removeUpvote, removeDownvote, deleteReply } from "../controllers/reply.controller.js"

const router = express.Router()

router.route('/add').post(addReply)
router.route('/get').get(getReply)
router.route('/add/upvote').post(upvoteReply)
router.route('/add/downvote').post(downvoteReply)
router.route('/remove/upvote').post(removeUpvote)
router.route('/remove/downvote').post(removeDownvote)
router.route('/delete/:id').delete(deleteReply)

export default router
