import express from 'express';
import { getMovieById } from '../controllers/movieController.js';

const router = express.Router();

router.get('/:movie_id', getMovieById); // Route to get movie by ID

export default router;
