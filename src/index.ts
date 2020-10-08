import path from "path";
import express from "express";
import chalk from "chalk";

import { initMongoose } from "./db/init";

const app = express();
app.use(express.static(path.join(__dirname, "../public")));

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
