import express from "express";

import { addSolution, getSolution, upvoteSolution, downvoteSolution } from "../controllers/solution.controller.js";
import { removeUpvote, removeDownvote, deleteSolution } from "../controllers/solution.controller.js";

const router = express.Router()

router.route('/add').post(addSolution)
router.route('/get').get(getSolution)
router.route('/add/upvote').post(upvoteSolution)
router.route('/add/downvote').post(downvoteSolution)
router.route('/remove/upvote').post(removeUpvote)
router.route('/remove/downvote').post(removeDownvote)
router.route('/delete/:id').delete(deleteSolution)

export default router


