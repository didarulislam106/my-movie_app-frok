import express from 'express';
import axios from 'axios';
import pool from './db.js';
import dotenv from 'dotenv';
import groupRoutes from './routes/groups.js';

dotenv.config(); // Load environment variables from .env file

const app = express();

app.use(express.json());
app.use('/api/groups', groupRoutes);

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN; // Add your TMDB access token here
const port = 3000;

// Route to fetch all movie data from TMDB and save to database
app.get('/api/tmdb/all_movies', async (req, res) => {
   try {
      let page = 1;
      let totalPages = 1;

      // Loop through all pages
      while (page <= totalPages) {
         const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?page=${page}`, {
            headers: {
               Accept: 'application/json',
               Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`
            }
         });

         const movies = response.data.results;
         totalPages = response.data.total_pages;

         // Insert each movie into PostgreSQL (Movies table)
         const insertMovieQuery = `
            INSERT INTO Movies (tmdb_id, title, release_date, description, created_at, original_language, popularity, poster_path)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (tmdb_id) DO UPDATE
            SET title = EXCLUDED.title,
                release_date = EXCLUDED.release_date,
                description = EXCLUDED.description,
                created_at = EXCLUDED.created_at,
                original_language = EXCLUDED.original_language,
                popularity = EXCLUDED.popularity,
                poster_path = EXCLUDED.poster_path
            RETURNING *;
         `;

         for (const movie of movies) {
            const { id, title, release_date, overview, original_language, popularity, poster_path } = movie;
            const validReleaseDate = release_date ? release_date : null; // Ensure release_date is valid or null
            const createdAt = new Date(); // Set created_at to current date and time
            await pool.query(insertMovieQuery, [id, title, validReleaseDate, overview, createdAt, original_language, popularity, poster_path]);
         }

         page++;
      }

      res.json({ message: 'All movies have been saved to the database' });

   } catch (error) {
      console.error('Error fetching data from TMDB:', error.response ? error.response.data : error.message);
      res.status(500).json({ message: 'Error fetching data from TMDB' });
   }
});

// Route to fetch movie data by movie ID from the database
app.get('/api/movies/:movie_id', async (req, res) => {
   const { movie_id } = req.params;
   try {
      const result = await pool.query('SELECT * FROM Movies WHERE movie_id = $1', [movie_id]);
      if (result.rows.length === 0) {
         return res.status(404).json({ message: 'Movie not found' });
      }
      res.json(result.rows[0]); // Respond with movie data
   } catch (error) {
      console.error('Error fetching data from database:', error.message);
      res.status(500).json({ message: 'Error fetching data from database' });
   }
});

// // Route to fetch all movie data from the database
// app.get('/api/movies/', async (req, res) => {
//    const { movie_id } = req.params;
//    try {
//       const result = await pool.query('SELECT * FROM Movies where movie_id=12');
//       res.json(result.rows); // Respond with all movie data
//    } catch (error) {
//       console.error('Error fetching data from database:', error.message);
//       res.status(500).json({ message: 'Error fetching data from database' });
//    }
// });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
