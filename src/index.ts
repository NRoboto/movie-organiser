import chalk from "chalk";
// @ts-ignore Catches async errors in express routes
import "express-async-errors";

import { initMongoose } from "./db/init";
import { app } from "./app";

// Setup passport
import "./services/passport";

initMongoose()
  .then((status) => {
    console.log("MongoDB", chalk.bgGreen(status));
  })
  .catch((err) => {
    console.log(chalk.bgRed("Error"), err);
  });

app.listen(process.env.PORT, () => {
  console.log(
    chalk.bgMagenta(`Server is listening on port ${process.env.PORT}`)
  );
});
