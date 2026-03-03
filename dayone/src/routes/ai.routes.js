import express from 'express';
import aiController from '../controllers/ai.controller.js';

const router = express.Router();

router.post('/askAi', aiController.askAi)

export default router;