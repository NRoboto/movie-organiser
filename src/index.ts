import path from "path";
import express from "express";
import chalk from "chalk";
import passport from "passport";

import { initMongoose } from "./db/init";
import { router } from "./router";

const app = express();
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(passport.initialize());
app.use(router);

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
