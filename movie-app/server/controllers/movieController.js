import Movie from '../models/movie.js';

// Controller to handle fetching movie by ID
export const getMovieById = async (req, res) => {
   const { movie_id } = req.params;
   try {
      console.log(`Fetching movie with ID: ${movie_id}`);
      const movie = await Movie.getMovieById(movie_id);
      if (!movie) {
         console.log('Movie not found');
         return res.status(404).json({ message: 'Movie not found' });
      }
      console.log('Movie data:', movie);
      res.json(movie); 
   } catch (error) {
      console.error('Error fetching data from database:', error.message);
      res.status(500).json({ message: 'Error fetching data from database' });
   }
};
