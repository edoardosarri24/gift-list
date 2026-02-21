import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/auth.routes';
import listRoutes from './routes/list.routes';
import itemRoutes from './routes/item.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(
    cors({
        origin: corsOrigin,
        credentials: true, // Required for cookies (refresh_token, guest_session)
    })
);

// Routes
const apiPrefix = '/api/v1';

app.get(`${apiPrefix}/health`, (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/lists`, listRoutes);
app.use(`${apiPrefix}/items`, itemRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(port, () => {
    console.log(`[Backend] Server running at http://localhost:${port}`);
});
