import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import WebSocket from 'ws';
import http from 'http';
import logger from './utils/logger';
import { morganMiddleware, authMiddleware, unknownEndpointMiddleware } from './utils/middleware';
import staticRouter from './routes/static';
import loginRouter from './routes/login';
import { initializeDatabase, closeDatabase } from './database';
import initializeSocket from './socket';

const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morganMiddleware);
app.use(authMiddleware);
app.use('/', staticRouter);
app.use('/api/login', loginRouter);
app.use(unknownEndpointMiddleware);
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

export const initializeServer = async () => {
  await initializeDatabase();
  initializeSocket(wss);
  server.listen(PORT);
  logger.info(`Server ready at http://localhost:${PORT}`);
};

export const closeServer = () => {
  closeDatabase();
  wss.close();
  server.close();
};
