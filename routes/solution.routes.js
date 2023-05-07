import express from "express";

import { addSolution, getSolution } from "../controllers/solution.controller.js";

const router = express.Router()

router.route('/add').post(addSolution)
router.route('/get').get(getSolution)

export default router


