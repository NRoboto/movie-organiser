// @ts-ignore Catches async errors in express routes
import "express-async-errors";

import { initMongoose } from "./db/init";
import { app } from "./app";
import { logger } from "./logger";

// Setup passport
import "./services/passport";

initMongoose()
  .then((status) => {
    logger.info("Mongoose started", status);
  })
  .catch((err) => {
    logger.fatal("Mongoose failed to connect", err);
  });

app.listen(process.env.PORT, () => {
  logger.info(`Server is listening on port ${process.env.PORT}`);
});
