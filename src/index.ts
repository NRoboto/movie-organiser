import path from "path";
import express from "express";
import chalk from "chalk";

const app = express();
app.use(express.static(path.join(__dirname, "../public")));

app.listen(process.env.PORT, () => {
  console.log(
    chalk.bgMagenta(`Server is listening on port ${process.env.PORT}`)
  );
});
