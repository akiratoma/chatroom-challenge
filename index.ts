import logger from './utils/logger';
import { initializeServer } from './wss';

try {
  initializeServer();
} catch (err) {
  logger.error(err.message);
}
