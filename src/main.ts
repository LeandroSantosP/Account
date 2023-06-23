import "dotenv/config";
import { logger } from "./utils/logger";
logger.info(`${process.env.HOST}:${process.env.PORT} - ${process.env.ENV}`);
