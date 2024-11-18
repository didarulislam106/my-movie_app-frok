// routes/movies.js
import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Route to fetch movie data by movie ID from the database
router.get('/:movie_id', async (req, res) => {
   const { movie_id } = req.params;
   try {
      console.log(`Fetching movie with ID: ${movie_id}`);
      const result = await pool.query('SELECT * FROM Movies WHERE movie_id = $1', [movie_id]);
      if (result.rows.length === 0) {
         console.log('Movie not found');
         return res.status(404).json({ message: 'Movie not found' });
      }
      console.log('Movie data:', result.rows[0]);
      res.json(result.rows[0]); // Respond with movie data
   } catch (error) {
      console.error('Error fetching data from database:', error.message);
      res.status(500).json({ message: 'Error fetching data from database' });
   }
});

export default router;