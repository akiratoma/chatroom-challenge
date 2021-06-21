import logger from './src/utils/logger';
import { initializeServer } from './src/wss';

try {
  initializeServer();
} catch (err) {
  logger.error(err.message);
}
