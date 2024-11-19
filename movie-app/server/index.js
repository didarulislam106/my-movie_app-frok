import express from 'express';
import cors from 'cors';
import groupsRouter from './routes/groups.js';
import movieRouter from './routes/movie.js';
import tmdbFetchRouter from './routes/tmdbFetch.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable cors in frontend url
app.use(cors({ origin: 'http://localhost:3001',
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
   credentials: true
 }));


app.use(express.json());

// Routes
app.use('/api/groups', groupsRouter);
app.use('/api/movies', movieRouter);
app.use('/api/tmdb', tmdbFetchRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Movie App API');
});

// Error handling middleware for JSON parsing errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Bad JSON');
        return res.status(400).json({ message: 'Invalid JSON' });
    }
    next();
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});