import { MongoClient } from 'mongodb';
import logger from './utils/logger';

const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://akira:LqPOdUL0FpsB2jk7@cluster0.iwiba.mongodb.net/chatroom?retryWrites=true&w=majority';
export const mongoClient = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const initializeDatabase = async () => {
  await mongoClient.connect();
  logger.info('Connected successfully to mongo server');
};

export const closeDatabase = async () => {
  await mongoClient.close();
};
