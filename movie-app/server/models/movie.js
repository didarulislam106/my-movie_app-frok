import pool from '../helpers/db.js';

const Movie = {
   async getMovieById(movieId) {
      try {
         const result = await pool.query('SELECT * FROM Movies WHERE movie_id = $1', [movieId]);
         return result.rows[0]; 
      } catch (error) {
         throw new Error('Database query failed');
      }
   }
};

export default Movie;
