import express from 'express';
import axios from 'axios';
import pool from '../db.js';
import dotenv from 'dotenv';

dotenv.config();

const routes = express.Router();

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

// Route to fetch all movie data from TMDB and save to database
routes.get('/all_movies', async (req, res) => {
    try {
       let page = 1;
       let totalPages = 1;
 
       // Loop through all pages
       while (page <= totalPages) {
          console.log(`Fetching page ${page} of ${totalPages}`);
          const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?page=${page}`, {
             headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`
             }
          });
 
          const movies = response.data.results;
          totalPages = response.data.total_pages;
          console.log(`Fetched ${movies.length} movies from page ${page}`);
 
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

export default routes;